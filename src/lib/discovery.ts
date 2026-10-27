import { sql } from "drizzle-orm";
import { db } from "@/db";
import { literatureCandidates } from "@/db/schema";
import { searchPubMed, type PubMedCandidate } from "@/lib/pubmed";
import { containsPattern, foldSql } from "@/lib/search-text";

export type DiscoveryStatus = "ok" | "no-results" | "unavailable" | "not-saved";

export type PubMedDiscovery = {
  candidates: PubMedCandidate[];
  status: DiscoveryStatus;
};

export async function discoverPubMedCandidates(rawQuery: string): Promise<PubMedDiscovery> {
  const query = rawQuery.trim().replace(/\s+/g, " ").slice(0, 100);
  if (query.length < 3) return { candidates: [], status: "no-results" };

  let candidates: PubMedCandidate[];
  try {
    candidates = await searchPubMed(query);
  } catch {
    console.error("[PubMed] La collecte distante est indisponible; les résultats locaux restent accessibles.");
    return { candidates: [], status: "unavailable" };
  }
  if (candidates.length === 0) return { candidates: [], status: "no-results" };

  try {
    await db.transaction(async (tx) => {
      for (const candidate of candidates) {
        await tx
          .insert(literatureCandidates)
          .values({
            pmid: candidate.pmid,
            doi: candidate.doi,
            title: candidate.title,
            authors: candidate.authors,
            journal: candidate.journal,
            publicationYear: candidate.publicationYear,
            publicationTypes: candidate.publicationTypes,
            abstractText: candidate.abstractText,
            sourceUrl: candidate.sourceUrl,
            status: "PENDING_REVIEW",
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
            discoveryCount: 1,
          })
          .onConflictDoUpdate({
            target: literatureCandidates.pmid,
            set: {
              doi: candidate.doi,
              title: candidate.title,
              authors: candidate.authors,
              journal: candidate.journal,
              publicationYear: candidate.publicationYear,
              publicationTypes: candidate.publicationTypes,
              abstractText: candidate.abstractText,
              sourceUrl: candidate.sourceUrl,
              lastSeenAt: new Date(),
              discoveryCount: sql`${literatureCandidates.discoveryCount} + 1`,
            },
          });
      }
    });
  } catch {
    console.error("[PubMed] Les notices ont été récupérées mais n’ont pas pu être enregistrées pour vérification.");
    return { candidates, status: "not-saved" };
  }

  return { candidates, status: "ok" };
}

/**
 * Repli local : les notices déjà collectées (file de veille) sont cherchées dans
 * la base quand PubMed n'est pas joignable. La recherche ne dépend donc jamais
 * entièrement du réseau.
 */
export async function searchCollectedCandidates(rawQuery: string): Promise<PubMedCandidate[]> {
  const needle = containsPattern(rawQuery);
  const rows = await db
    .select()
    .from(literatureCandidates)
    .where(
      sql`${foldSql(
        sql`${literatureCandidates.title} || ' ' || ${literatureCandidates.authors} || ' ' || ${literatureCandidates.journal} || ' ' || coalesce(${literatureCandidates.abstractText}, '')`,
      )} like ${needle} escape '\\'`,
    )
    .orderBy(sql`${literatureCandidates.lastSeenAt} desc`)
    .limit(5);

  return rows.map((row) => ({
    pmid: row.pmid,
    doi: row.doi,
    title: row.title,
    authors: row.authors,
    journal: row.journal,
    publicationYear: row.publicationYear,
    publicationTypes: row.publicationTypes,
    abstractText: row.abstractText,
    sourceUrl: row.sourceUrl,
  }));
}
