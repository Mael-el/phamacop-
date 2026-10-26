import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { PubMedCandidateCard } from "@/components/pubmed-candidate-card";
import { SearchForm } from "@/components/search-form";
import { discoverPubMedCandidates } from "@/lib/discovery";
import { searchCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const [{ t }, localResults, pubmed] = await Promise.all([
    getDictionary(),
    query.length >= 2 ? searchCatalog(query) : Promise.resolve([]),
    query.length >= 3
      ? discoverPubMedCandidates(query)
      : Promise.resolve({ candidates: [], status: "no-results" as const }),
  ]);
  const categoryLabel = {
    Plante: t.search.categories.plant,
    Pathologie: t.search.categories.pathology,
    Mécanisme: t.search.categories.mechanism,
    Composé: t.search.categories.compound,
    Publication: t.search.categories.publication,
  } as const;

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.recherche }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.search.kicker}</p><h1>{t.search.title}</h1><p className="lead">{t.search.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.search.asideTitle}</strong>{t.search.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="page-search-bar"><SearchForm defaultValue={query} placeholder={t.search.placeholder} /></div>
        {!query ? (
          <div className="empty-note">{t.search.emptyPrompt}</div>
        ) : query.length < 2 ? (
          <div className="empty-note">{t.search.tooShort}</div>
        ) : (
          <div className="discovery-sections">
            <section className="discovery-section" aria-labelledby="local-results-heading">
              <div className="discovery-heading">
                <div><p className="section-kicker">{t.search.localKicker}</p><h2 id="local-results-heading">{t.search.localTitle}</h2></div>
                <span className="results-count">{localResults.length} {localResults.length === 1 ? t.search.resultOne : t.search.resultMany}</span>
              </div>
              {localResults.length ? (
                <div className="results-list">{localResults.map((result, index) => (
                  <Link className="result-row" href={result.href} key={`${result.category}-${result.href}-${index}`}>
                    <span className="result-category">{categoryLabel[result.category]}</span>
                    <div><h3>{result.title}</h3><p>{result.detail}</p></div>
                    <Icon name="arrow" size={17} />
                  </Link>
                ))}</div>
              ) : <div className="empty-note">{t.search.localEmpty}</div>}
            </section>

            <section className="discovery-section" aria-labelledby="pubmed-results-heading">
              <div className="discovery-heading">
                <div><p className="section-kicker">{t.search.pubmedKicker}</p><h2 id="pubmed-results-heading">{t.search.pubmedTitle}</h2></div>
                {pubmed.candidates.length > 0 && <span className="results-count">{pubmed.candidates.length} {pubmed.candidates.length === 1 ? t.search.candidateOne : t.search.candidateMany}</span>}
              </div>
              <p className="discovery-note">{t.search.pubmedNote}</p>
              {pubmed.candidates.length > 0 ? (
                <div className="candidate-list">{pubmed.candidates.map((candidate) => <PubMedCandidateCard key={candidate.pmid} candidate={candidate} t={t} />)}</div>
              ) : pubmed.status === "unavailable" ? (
                <div className="empty-note">{t.search.unavailable}</div>
              ) : pubmed.status === "not-saved" ? (
                <div className="empty-note">{t.search.notSaved}</div>
              ) : (
                <div className="empty-note">{t.search.noCandidate}</div>
              )}
            </section>
          </div>
        )}
      </div></section>
    </main>
  );
}
