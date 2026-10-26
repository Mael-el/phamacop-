import { Breadcrumbs } from "@/components/breadcrumbs";
import { PubMedCandidateCard } from "@/components/pubmed-candidate-card";
import { getPendingLiteratureCandidates } from "@/lib/literature";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Veille bibliographique · notices candidates",
  description: "Notices PubMed recueillies automatiquement lors des recherches et en attente de vérification humaine.",
};

export default async function LiteratureWatchPage() {
  const candidates = await getPendingLiteratureCandidates();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Veille bibliographique" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">PubMed · collecte à la demande</p><h1>Notices à examiner.</h1><p className="lead">Les notices ci-dessous ont été trouvées automatiquement lorsqu’une recherche a interrogé PubMed. Elles sont conservées comme références candidates; elles ne font pas partie des fiches scientifiques validées.</p></div>
          <aside className="page-hero-aside"><strong>Validation humaine obligatoire</strong>Aucune notice de cette file ne crée automatiquement une affirmation, un niveau de preuve ou une recommandation. Un expert doit examiner la publication originale avant toute intégration.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="candidate-queue-note"><strong>{candidates.length}</strong><span>notice{candidates.length === 1 ? "" : "s"} en attente de vérification (100 dernières affichées).</span></div>
        <p className="discovery-note">Les métadonnées et résumés proviennent des notices PubMed, avec leur PMID et DOI lorsqu’il est disponible. Les requêtes de recherche ne sont pas stockées dans cette file. Les résumés affichés restent ceux de la source, dans leur langue d’origine.</p>
        {candidates.length ? (
          <div className="candidate-list">{candidates.map((candidate) => <PubMedCandidateCard key={candidate.id} candidate={candidate} />)}</div>
        ) : (
          <div className="empty-note">Aucune notice candidate pour le moment. Lancez une recherche par nom de plante, composé ou sujet pour interroger PubMed.</div>
        )}
      </div></section>
    </main>
  );
}
