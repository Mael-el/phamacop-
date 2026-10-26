import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvidenceBadge } from "@/components/evidence-badge";
import { Icon } from "@/components/icon";
import { getSolutionsOverview } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.solutions.title, description: t.solutions.lead };
}

export default async function SolutionsPage() {
  const [groups, { t }] = await Promise.all([getSolutionsOverview(), getDictionary()]);
  const totalEntries = groups.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.solutions }]} />
        <div className="page-hero-inner">
          <div>
            <p className="section-kicker">{t.solutions.kicker}</p>
            <h1>{t.solutions.title}</h1>
            <p className="lead">{t.solutions.lead}</p>
          </div>
          <aside className="page-hero-aside"><strong>{t.solutions.asideTitle}</strong>{t.solutions.asideBody}</aside>
        </div>
      </div></section>

      <section className="page-content"><div className="wrap">
        <div className="solution-example">
          <strong>{t.solutions.caution}</strong>
          <ol className="solution-steps">
            <li>{t.solutions.nextStep1}</li>
            <li>{t.solutions.nextStep2}</li>
            <li>{t.solutions.nextStep3}</li>
          </ol>
        </div>

        <p className="results-count">
          {groups.length} {groups.length === 1 ? t.solutions.groupOne : t.solutions.groupMany} · {totalEntries} {totalEntries === 1 ? t.solutions.entryOne : t.solutions.entryMany}
        </p>

        {groups.length ? groups.map((group) => (
          <section className="detail-section" key={group.key} id={group.key}>
            <h2 className="detail-section-title">
              <span className="section-index">{String(groups.indexOf(group) + 1).padStart(2, "0")}</span>
              {group.href
                ? <Link href={group.href}>{group.key === "autres-pistes" ? t.solutions.otherTitle : group.title} <Icon name="arrow" size={15} /></Link>
                : (group.key === "autres-pistes" ? t.solutions.otherTitle : group.title)}
            </h2>
            <p className="detail-section-copy">{group.key === "autres-pistes" ? t.solutions.otherSummary : group.summary}</p>
            {group.scopeNote && <div className="solution-example">{group.scopeNote}</div>}
            <div className="solution-list">
              {group.entries.map((entry) => (
                <article className="solution-card" key={entry.id}>
                  <div className="solution-card-head">
                    <h3><Link className="solution-plant" href={`/plantes/${entry.plant.slug}`}><em>{entry.plant.scientificName}</em><Icon name="arrow" size={14} /></Link></h3>
                    <EvidenceBadge level={entry.evidenceLevel} t={t} compact />
                  </div>
                  <p>{entry.claimText}</p>
                  <dl className="solution-grid">
                    <div>
                      <dt>{t.solutions.testedPlants}</dt>
                      <dd>{entry.plant.partsUsed.length ? entry.plant.partsUsed.join(", ") : t.plants.notDocumented}</dd>
                    </div>
                    <div>
                      <dt>{t.solutions.mechanism}</dt>
                      <dd>{entry.mechanism?.name ?? t.plants.notDocumented}</dd>
                    </div>
                    <div>
                      <dt>{t.solutions.evidence}</dt>
                      <dd>{entry.rationale}</dd>
                    </div>
                    <div>
                      <dt>{t.plants.solutionsLimit}</dt>
                      <dd>{entry.limitations}</dd>
                    </div>
                  </dl>
                  <div className="claim-sources">
                    <span className="claim-source-title"><Icon name="book" size={15} /> {t.solutions.sources}</span>
                    <ul>{entry.sources.map((study) => (
                      <li key={study.id}><Link href={`/publications#${study.slug}`}>{study.authors} ({study.year})</Link></li>
                    ))}</ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )) : <div className="empty-note">{t.solutions.empty}</div>}
      </div></section>
    </main>
  );
}
