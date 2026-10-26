import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { Icon } from "@/components/icon";
import { fonNames } from "@/components/plant-card";
import { PhotoFigure } from "@/components/plant-photo";
import { StudyCard } from "@/components/study-card";
import { getPlantBySlug } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getPlantBySlug(slug), getDictionary()]);
  if (!data) return { title: t.plants.detailKicker };
  return {
    title: `${data.plant.scientificName} — ${t.plants.detailKicker}`,
    description: data.plant.summary,
  };
}

export default async function PlantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getPlantBySlug(slug), getDictionary()]);
  if (!data) notFound();

  const { plant, traditionalUses, claims, compounds: plantCompounds, studies, safety } = data;
  const sourceNames = plant.sourceRegions.length ? plant.sourceRegions.join(" · ") : t.plants.regionUnknown;
  const fon = fonNames(plant.commonNames);
  const otherNames = plant.commonNames.filter((record) => !fon.includes(record));

  return (
    <main>
      <div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.plantes, href: "/plantes" }, { label: plant.scientificName }]} />
        <div className="plant-detail-layout">
          <div className="detail-main">
            <header className="detail-title-block">
              <p className="section-kicker">{t.plants.detailKicker} · {plant.family}</p>
              <h1 className="plant-detail-title"><em>{plant.scientificName}</em> <span>{plant.botanicalAuthor}</span></h1>
              <p className="detail-title-summary">{plant.summary}</p>
            </header>

            <PhotoFigure
              photo={plant}
              alt={t.plants.photoAlt.replace("{name}", plant.scientificName)}
              caption={`${plant.scientificName} — ${t.plants.photoIllustration}`}
              t={t}
            />

            <section className="detail-section" id="usages-traditionnels">
              <h2 className="detail-section-title"><span className="section-index">01</span> {t.plants.usesTitle}</h2>
              <p className="detail-section-copy">{t.plants.usesNote}</p>
              {traditionalUses.length ? traditionalUses.map(({ use, source }) => (
                <article className="tradition-panel" key={use.id}>
                  <span className="tradition-label">{t.plants.useLabel}</span>
                  <h3>{t.plants.useContext}</h3>
                  <p>{use.description}</p>
                  {use.preparationReported && <p><strong>{t.plants.usePreparation} :</strong> {use.preparationReported}</p>}
                  <div className="tradition-meta">
                    <strong>{t.plants.useRegion} :</strong> {use.region}
                    {use.partReported ? ` · ${t.plants.usePart} : ${use.partReported}` : ""}
                  </div>
                  <Link className="tradition-source" href={`/publications#${source.slug}`}><Icon name="book" size={13} /> {t.plants.sourcePrefix} : {source.authors} ({source.year})</Link>
                </article>
              )) : <div className="empty-note">{t.plants.usesEmpty}</div>}
            </section>

            <section className="detail-section" id="donnees-scientifiques">
              <h2 className="detail-section-title"><span className="section-index">02</span> {t.plants.claimsTitle}</h2>
              <p className="detail-section-copy">{t.plants.claimsNote}</p>
              {claims.length ? claims.map((claim) => (
                <div key={claim.id} className="claim-stack">
                  <ClaimCard claim={claim} t={t} />
                  <div className="claim-cross-links">
                    {claim.mechanism && <Link href={`/mecanismes/${claim.mechanism.slug}`}><span>{t.plants.axisLabel}</span>{claim.mechanism.name}<Icon name="arrow" size={13} /></Link>}
                    {claim.pathology && <Link href={`/pathologies/${claim.pathology.slug}`}><span>{t.plants.pathwayLabel}</span>{claim.pathology.name}<Icon name="arrow" size={13} /></Link>}
                  </div>
                </div>
              )) : <div className="empty-note">{t.plants.claimsEmpty}</div>}
            </section>

            <section className="detail-section" id="solutions">
              <h2 className="detail-section-title"><span className="section-index">03</span> {t.plants.solutionsTitle}</h2>
              <p className="detail-section-copy">{t.plants.solutionsNote}</p>
              {claims.length ? (
                <div className="solution-list">
                  {claims.map((claim) => {
                    const model = claim.sources
                      .map((study) => study.studyType)
                      .filter((type, index, array) => array.indexOf(type) === index)
                      .map((type) => ({
                        IN_VITRO: t.study.inVitro,
                        IN_VIVO: t.study.inVivo,
                        MIXED_PRECLINICAL: t.study.mixed,
                        CLINICAL: t.study.clinical,
                        OBSERVATIONAL: t.study.observational,
                        REVIEW: t.study.review,
                        ETHNOBOTANICAL: t.study.ethnobotanical,
                      })[type])
                      .join(" · ");
                    const preparation = traditionalUses[0]?.use.preparationReported
                      ?? (plant.partsUsed.length ? plant.partsUsed.join(", ") : t.plants.notDocumented);
                    return (
                      <article className="solution-card" key={`solution-${claim.id}`}>
                        <div className="solution-card-head">
                          <h3>{claim.pathology?.name ?? claim.mechanism?.name ?? t.plants.safetyClaim}</h3>
                          <EvidenceBadge level={claim.evidenceLevel} t={t} compact />
                        </div>
                        <p>{claim.claimText}</p>
                        <dl className="solution-grid">
                          <div><dt>{t.plants.solutionsModel}</dt><dd>{model || t.plants.notDocumented}</dd></div>
                          <div><dt>{t.plants.solutionsPreparation}</dt><dd>{preparation}</dd></div>
                          <div><dt>{t.plants.solutionsResult}</dt><dd>{claim.sources[0]?.keyResults ?? claim.rationale}</dd></div>
                          <div><dt>{t.plants.solutionsLimit}</dt><dd>{claim.limitations}</dd></div>
                        </dl>
                        {claim.sources.length > 0 && (
                          <div className="claim-sources">
                            <span className="claim-source-title"><Icon name="book" size={15} /> {t.evidence.claimSources}</span>
                            <ul>{claim.sources.map((study) => (
                              <li key={study.id}>
                                <Link href={`/publications#${study.slug}`}>{study.authors} ({study.year})</Link>
                              </li>
                            ))}</ul>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : <div className="empty-note">{t.plants.solutionsEmpty}</div>}
            </section>

            <section className="detail-section" id="composes">
              <h2 className="detail-section-title"><span className="section-index">04</span> {t.plants.compoundsTitle}</h2>
              {plantCompounds.length ? (
                <div className="compound-list">
                  {plantCompounds.map(({ compound }) => (
                    <article className="compound-mini" key={compound.id}>
                      <h3>{compound.name}</h3>
                      <span className="chemical-family">{compound.chemicalFamily}</span>
                      <p>{compound.description}</p>
                      <Link href={`/composes/${compound.slug}`}>{t.plants.seeCompound} <Icon name="arrow" size={13} /></Link>
                    </article>
                  ))}
                </div>
              ) : <div className="empty-note">{t.plants.compoundsEmpty}</div>}
            </section>

            <section className="detail-section" id="publications">
              <h2 className="detail-section-title"><span className="section-index">05</span> {t.plants.studiesTitle}</h2>
              <p className="detail-section-copy">{t.plants.studiesNote}</p>
              {studies.length ? studies.map((study) => <StudyCard key={study.id} study={study} t={t} />) : <div className="empty-note">{t.plants.studiesEmpty}</div>}
            </section>

            <section className="detail-section" id="securite">
              <h2 className="detail-section-title"><span className="section-index">06</span> {t.plants.safetyTitle}</h2>
              {safety ? (
                <div className={`safety-panel ${safety.riskSignal ? "risk" : ""}`}>
                  <h3><Icon name="shield" size={18} /> {safety.riskSignal ? t.plants.safetyRisk : t.plants.safetyInsufficient}</h3>
                  <p>{safety.summary}</p>
                  {safety.riskRationale && <p><strong>{t.plants.safetyContext} :</strong> {safety.riskRationale}</p>}
                  <p>{safety.precautions}</p>
                  {safety.source && <Link className="safety-source" href={`/publications#${safety.source.slug}`}>{t.plants.safetySource} : {safety.source.authors} ({safety.source.year})</Link>}
                </div>
              ) : <div className="empty-note">{t.plants.safetyEmpty}</div>}
            </section>
          </div>

          <aside className="detail-aside" aria-label={t.plants.identityTitle}>
            <div className="detail-identity">
              <span className="family-tag">{t.plants.identityTitle}</span>
              <h2><em>{plant.scientificName}</em></h2>
              <span className="identity-author">{plant.botanicalAuthor ? `${t.plants.botanicalAuthority} : ${plant.botanicalAuthor}` : t.plants.noAuthority}</span>
              <span className="identity-family">{t.plants.family} · {plant.family}</span>
              <dl className="identity-list">
                <div>
                  <dt>{t.plants.fonNames}</dt>
                  <dd>
                    {fon.length ? (
                      <span className="fon-name-block">
                        {fon.map((record) => (
                          <span className="fon-name-item" key={`${record.name}-${record.region ?? ""}`}>
                            <span className="fon-term">{record.name}</span>
                            {record.region && <span className="fon-variant">{record.region}</span>}
                          </span>
                        ))}
                        <span className="fon-variant">{t.plants.fonNote}</span>
                      </span>
                    ) : t.plants.fonNone}
                  </dd>
                </div>
                <div><dt>{t.plants.commonNames}</dt><dd>{otherNames.length ? otherNames.map((record) => `${record.name}${record.region ? ` — ${record.region}` : ""}`).join("; ") : t.plants.namesNotHarmonised}</dd></div>
                <div><dt>{t.plants.partsUsed}</dt><dd>{plant.partsUsed.length ? plant.partsUsed.join(", ") : t.plants.notDocumented}</dd></div>
                <div><dt>{t.plants.synonyms}</dt><dd>{plant.synonyms.length ? plant.synonyms.join("; ") : t.plants.noSynonym}</dd></div>
                <div><dt>{t.plants.sourceContext}</dt><dd>{sourceNames}</dd></div>
                <div><dt>{t.plants.references}</dt><dd>{studies.length} {studies.length === 1 ? t.plants.publicationOne : t.plants.publicationMany}</dd></div>
              </dl>
            </div>
            <div className="detail-aside-note"><strong>{t.plants.importantTitle}</strong> {t.plants.importantBody}</div>
            <div className="detail-aside-badges">
              {claims.slice(0, 3).map((claim) => (
                <div key={claim.id}>
                  <EvidenceBadge level={claim.evidenceLevel} t={t} compact />
                  <span>{claim.pathology?.name ?? claim.mechanism?.name ?? t.plants.safetyClaim}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
