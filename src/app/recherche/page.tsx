import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { PubMedCandidateCard } from "@/components/pubmed-candidate-card";
import { SearchForm } from "@/components/search-form";
import { discoverPubMedCandidates } from "@/lib/discovery";
import { searchCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const [localResults, pubmed] = await Promise.all([
    query.length >= 2 ? searchCatalog(query) : Promise.resolve([]),
    query.length >= 3
      ? discoverPubMedCandidates(query)
      : Promise.resolve({ candidates: [], status: "no-results" as const }),
  ]);

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Recherche" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Recherche plein texte · PostgreSQL + PubMed</p><h1>Retrouver une information.</h1><p className="lead">La recherche interroge le corpus local et, en parallèle, PubMed. Les notices externes retrouvées sont enregistrées comme candidates à vérifier — elles ne sont pas publiées automatiquement.</p></div>
          <aside className="page-hero-aside"><strong>Collecte avec garde-fou</strong>Les requêtes de trois caractères ou plus sont transmises à PubMed (NCBI). Seules les notices bibliographiques sont conservées; la requête elle-même n’est pas enregistrée.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="page-search-bar"><SearchForm defaultValue={query} placeholder="Ex. Nauclea, Plasmodium, limonoïde…" /></div>
        {!query ? (
          <div className="empty-note">Saisissez au moins deux caractères pour chercher dans l’herbier. À partir de trois caractères, la recherche consulte aussi PubMed.</div>
        ) : query.length < 2 ? (
          <div className="empty-note">Ajoutez un caractère pour lancer la recherche.</div>
        ) : (
          <div className="discovery-sections">
            <section className="discovery-section" aria-labelledby="local-results-heading">
              <div className="discovery-heading">
                <div><p className="section-kicker">Corpus documentaire local</p><h2 id="local-results-heading">Résultats vérifiés dans l’herbier</h2></div>
                <span className="results-count">{localResults.length} résultat{localResults.length === 1 ? "" : "s"}</span>
              </div>
              {localResults.length ? (
                <div className="results-list">{localResults.map((result, index) => (
                  <Link className="result-row" href={result.href} key={`${result.category}-${result.href}-${index}`}>
                    <span className="result-category">{result.category}</span>
                    <div><h3>{result.title}</h3><p>{result.detail}</p></div>
                    <Icon name="arrow" size={17} />
                  </Link>
                ))}</div>
              ) : <div className="empty-note">Aucun résultat exact dans l’herbier. Consultez les notices PubMed candidates ci-dessous ou essayez un nom scientifique.</div>}
            </section>

            <section className="discovery-section" aria-labelledby="pubmed-results-heading">
              <div className="discovery-heading">
                <div><p className="section-kicker">Collecte bibliographique en direct</p><h2 id="pubmed-results-heading">Nouvelles notices PubMed</h2></div>
                {pubmed.candidates.length > 0 && <span className="results-count">{pubmed.candidates.length} candidate{pubmed.candidates.length === 1 ? "" : "s"}</span>}
              </div>
              <p className="discovery-note">Source : PubMed / NCBI E-utilities. Les titres, auteurs, résumés et identifiants sont récupérés depuis les notices. Les résultats ne sont ni résumés par IA ni transformés en affirmations ou niveaux de preuve.</p>
              {pubmed.candidates.length > 0 ? (
                <div className="candidate-list">{pubmed.candidates.map((candidate) => <PubMedCandidateCard key={candidate.pmid} candidate={candidate} />)}</div>
              ) : pubmed.status === "unavailable" ? (
                <div className="empty-note">PubMed n’est pas joignable pour le moment. Les résultats du corpus local restent consultables; réessayez plus tard.</div>
              ) : pubmed.status === "not-saved" ? (
                <div className="empty-note">Les notices PubMed ont été récupérées mais la file de vérification n’a pas pu être mise à jour. Elles restent affichées comme candidates non validées.</div>
              ) : (
                <div className="empty-note">Aucune notice PubMed trouvée pour cette requête, ou ajoutez au moins trois caractères pour lancer la collecte externe.</div>
              )}
            </section>
          </div>
        )}
      </div></section>
    </main>
  );
}
