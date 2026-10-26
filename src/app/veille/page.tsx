import { Breadcrumbs } from "@/components/breadcrumbs";
import { PubMedCandidateCard } from "@/components/pubmed-candidate-card";
import { getPendingLiteratureCandidates } from "@/lib/literature";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.veille.title, description: t.veille.lead };
}

export default async function LiteratureWatchPage() {
  const [candidates, { t }] = await Promise.all([getPendingLiteratureCandidates(), getDictionary()]);
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.veille }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.veille.kicker}</p><h1>{t.veille.title}</h1><p className="lead">{t.veille.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.veille.asideTitle}</strong>{t.veille.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="candidate-queue-note">
          <strong>{candidates.length}</strong>
          <span>{candidates.length === 1 ? t.veille.queueOne : t.veille.queueMany}</span>
        </div>
        <p className="discovery-note">{t.veille.note}</p>
        {candidates.length
          ? <div className="candidate-list">{candidates.map((candidate) => <PubMedCandidateCard key={candidate.id} candidate={candidate} t={t} />)}</div>
          : <div className="empty-note">{t.veille.empty}</div>}
      </div></section>
    </main>
  );
}
