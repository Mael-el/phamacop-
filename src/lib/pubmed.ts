import { XMLParser } from "fast-xml-parser";

export type PubMedCandidate = {
  pmid: string;
  doi: string | null;
  title: string;
  authors: string;
  journal: string;
  publicationYear: number | null;
  publicationTypes: string[];
  abstractText: string | null;
  sourceUrl: string;
};

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const MAX_RESULTS = 5;
const MIN_REQUEST_INTERVAL_MS = 350;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true,
});

type RateLimitedGlobal = typeof globalThis & {
  __herbierNcbiQueue?: Promise<void>;
  __herbierNcbiLastRequestAt?: number;
};

async function waitForNcbiSlot() {
  const globalState = globalThis as RateLimitedGlobal;
  const previous = globalState.__herbierNcbiQueue ?? Promise.resolve();
  let release: () => void = () => {};
  globalState.__herbierNcbiQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;

  const elapsed = Date.now() - (globalState.__herbierNcbiLastRequestAt ?? 0);
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  globalState.__herbierNcbiLastRequestAt = Date.now();
  release();
}

function buildEutilsParams(values: Record<string, string>) {
  const params = new URLSearchParams(values);
  const email = process.env.NCBI_EMAIL?.trim();
  const apiKey = process.env.NCBI_API_KEY?.trim();
  params.set("tool", "herbier_ouest_africain");
  if (email) params.set("email", email);
  if (apiKey) params.set("api_key", apiKey);
  return params;
}

async function fetchEutils(url: URL, accept: string) {
  await waitForNcbiSlot();
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      "User-Agent": process.env.NCBI_EMAIL
        ? `HerbierOuestAfricain/1.0 (${process.env.NCBI_EMAIL})`
        : "HerbierOuestAfricain/1.0",
    },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`NCBI returned HTTP ${response.status}`);
  return response;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join(" ").trim();
  if (value === null || typeof value !== "object") return "";
  return Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !key.startsWith("@_"))
    .map(([, child]) => textOf(child))
    .filter(Boolean)
    .join(" ")
    .trim();
}

function parseYear(value: unknown): number | null {
  const match = textOf(value).match(/\b(?:18|19|20|21)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function parsePubmedAbstracts(xml: string): Map<string, string> {
  const parsed = asRecord(parser.parse(xml));
  const articleSet = asRecord(parsed.PubmedArticleSet);
  const abstracts = new Map<string, string>();

  for (const value of asArray(articleSet.PubmedArticle)) {
    const record = asRecord(value);
    const medline = asRecord(record.MedlineCitation);
    const article = asRecord(medline.Article);
    const pmid = textOf(medline.PMID);
    const abstractNode = asRecord(article.Abstract);
    const parts = asArray(abstractNode.AbstractText)
      .map((part) => {
        const partRecord = asRecord(part);
        const label = textOf(partRecord["@_Label"]) || textOf(partRecord["@_NlmCategory"]);
        const text = textOf(part);
        return text ? (label ? `${label}: ${text}` : text) : "";
      })
      .filter(Boolean);
    if (/^\d+$/.test(pmid) && parts.length > 0) abstracts.set(pmid, parts.join("\n\n"));
  }

  return abstracts;
}

function summaryDoi(summary: Record<string, unknown>): string | null {
  const articleIds = asArray(summary.articleids);
  const doi = articleIds
    .map((value) => asRecord(value))
    .find((value) => textOf(value.idtype).toLowerCase() === "doi");
  return doi ? textOf(doi.value) || null : null;
}

export async function searchPubMed(query: string): Promise<PubMedCandidate[]> {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").slice(0, 100);
  if (normalizedQuery.length < 3) return [];

  const searchParams = buildEutilsParams({
    db: "pubmed",
    term: normalizedQuery,
    retmode: "json",
    retmax: String(MAX_RESULTS),
    sort: "relevance",
  });
  const searchUrl = new URL(`${EUTILS_BASE}/esearch.fcgi?${searchParams.toString()}`);
  const searchResponse = await fetchEutils(searchUrl, "application/json");
  const searchJson = (await searchResponse.json()) as {
    esearchresult?: { idlist?: unknown[] };
  };
  const pmids = (searchJson.esearchresult?.idlist ?? [])
    .map((id) => String(id))
    .filter((id) => /^\d+$/.test(id))
    .slice(0, MAX_RESULTS);
  if (pmids.length === 0) return [];

  const summaryParams = buildEutilsParams({ db: "pubmed", id: pmids.join(","), retmode: "json" });
  const summaryUrl = new URL(`${EUTILS_BASE}/esummary.fcgi?${summaryParams.toString()}`);
  const summaryResponse = await fetchEutils(summaryUrl, "application/json");
  const summaryJson = (await summaryResponse.json()) as { result?: Record<string, unknown> };
  const summaryResult = asRecord(summaryJson.result);

  const fetchParams = buildEutilsParams({ db: "pubmed", id: pmids.join(","), retmode: "xml" });
  const fetchUrl = new URL(`${EUTILS_BASE}/efetch.fcgi?${fetchParams.toString()}`);
  const fetchResponse = await fetchEutils(fetchUrl, "application/xml, text/xml");
  const abstracts = parsePubmedAbstracts(await fetchResponse.text());

  return pmids
    .map((pmid): PubMedCandidate | null => {
      const summary = asRecord(summaryResult[pmid]);
      const title = textOf(summary.title);
      if (!title) return null;
      const authors = asArray(summary.authors)
        .map((author) => textOf(asRecord(author).name))
        .filter(Boolean)
        .slice(0, 8)
        .join(", ");
      const pubTypeValues = asArray(summary.pubtype).map(textOf).filter(Boolean);
      return {
        pmid,
        doi: summaryDoi(summary),
        title,
        authors,
        journal: textOf(summary.fulljournalname) || textOf(summary.source) || "PubMed",
        publicationYear: parseYear(summary.pubdate),
        publicationTypes: pubTypeValues,
        abstractText: abstracts.get(pmid) ?? null,
        sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      };
    })
    .filter((candidate): candidate is PubMedCandidate => candidate !== null);
}
