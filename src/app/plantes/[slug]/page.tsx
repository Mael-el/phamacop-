import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { Icon } from "@/components/icon";
import { StudyCard } from "@/components/study-card";
import { getPlantBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPlantBySlug(slug);
  if (!data) return { title: "Fiche plante" };
  return {
    title: `${data.plant.scientificName} — fiche botanique et études`,
    description: data.plant.summary,
  };
}

export default async function PlantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPlantBySlug(slug);
  if (!data) notFound();

  const { plant, traditionalUses, claims, compounds: plantCompounds, studies, safety } = data;
  const sourceNames = plant.sourceRegions.length ? plant.sourceRegions.join(" · ") : "Région non précisée dans les sources sélectionnées";
  const commonNames = plant.commonNames;

  return (
    <main>
      <div className="wrap">
        <Breadcrumbs items={[{ label: "Plantes", href: "/plantes" }, { label: plant.scientificName }]} />
        <div className="plant-detail-layout">
          <div className="detail-main">
            <header className="detail-title-block">
              <p className="section-kicker">Fiche botanique · {plant.family}</p>
              <h1 className="plant-detail-title"><em>{plant.scientificName}</em> <span>{plant.botanicalAuthor}</span></h1>
              <p className="detail-title-summary">{plant.summary}</p>
            </header>

            <section className="detail-section" id="usages-traditionnels">
              <h2 className="detail-section-title"><span className="section-index">01</span> Usages traditionnels rapportés</h2>
              <p className="detail-section-copy">Ce bloc documente ce que les sources rapportent. Il ne constitue pas une preuve d’efficacité, une recette ni une recommandation d’usage.</p>
              {traditionalUses.length ? traditionalUses.map(({ use, source }) => (
                <article className="tradition-panel" key={use.id}>
                  <span className="tradition-label">Donnée ethnobotanique · non preuve d’efficacité</span>
                  <h3>Contexte rapporté</h3>
                  <p>{use.description}</p>
                  {use.preparationReported && <p><strong>Préparation rapportée :</strong> {use.preparationReported}</p>}
                  <div className="tradition-meta"><strong>Région :</strong> {use.region}{use.partReported ? ` · Partie mentionnée : ${use.partReported}` : ""}</div>
                  <Link className="tradition-source" href={`/publications#${source.slug}`}><Icon name="book" size={13} /> Source : {source.authors} ({source.year})</Link>
                </article>
              )) : <div className="empty-note">Aucun usage traditionnel n’est consigné dans les sources sélectionnées pour cette fiche.</div>}
            </section>

            <section className="detail-section" id="donnees-scientifiques">
              <h2 className="detail-section-title"><span className="section-index">02</span> Affirmations scientifiques</h2>
              <p className="detail-section-copy">Le niveau porte sur l’affirmation et les études reliées, jamais sur l’espèce entière. Les niveaux de cette version initiale sont signalés comme provisoires et à valider par un expert.</p>
              {claims.length ? claims.map((claim) => (
                <div key={claim.id} className="claim-stack">
                  <ClaimCard claim={claim} />
                  <div className="claim-cross-links">
                    {claim.mechanism && <Link href={`/mecanismes/${claim.mechanism.slug}`}><span>Axe étudié</span>{claim.mechanism.name}<Icon name="arrow" size={13} /></Link>}
                    {claim.pathology && <Link href={`/pathologies/${claim.pathology.slug}`}><span>Parcours de recherche</span>{claim.pathology.name}<Icon name="arrow" size={13} /></Link>}
                  </div>
                </div>
              )) : <div className="empty-note">Aucune affirmation scientifique sourcée n’est publiée pour le moment.</div>}
            </section>

            <section className="detail-section" id="composes">
              <h2 className="detail-section-title"><span className="section-index">03</span> Composés identifiés</h2>
              {plantCompounds.length ? (
                <div className="compound-list">
                  {plantCompounds.map(({ compound, source }) => (
                    <article className="compound-mini" key={`${compound.id}-${source.id}`}>
                      <h3>{compound.name}</h3>
                      <span className="chemical-family">{compound.chemicalFamily}</span>
                      <p>{compound.description}</p>
                      <Link href={`/composes/${compound.slug}`}>Voir la fiche composé <Icon name="arrow" size={13} /></Link>
                    </article>
                  ))}
                </div>
              ) : <div className="empty-note">Aucun composé associé n’est enregistré dans le corpus actuel. Cela ne signifie pas que l’espèce ne contient pas de composés.</div>}
            </section>

            <section className="detail-section" id="publications">
              <h2 className="detail-section-title"><span className="section-index">04</span> Études scientifiques</h2>
              <p className="detail-section-copy">Les références ci-dessous possèdent un DOI ou un identifiant PubMed. Les résultats et leurs limites sont résumés en langage clair.</p>
              {studies.length ? studies.map((study) => <StudyCard key={study.id} study={study} />) : <div className="empty-note">Aucune publication liée à cette espèce.</div>}
            </section>

            <section className="detail-section" id="securite">
              <h2 className="detail-section-title"><span className="section-index">05</span> Sécurité & précautions</h2>
              {safety ? (
                <div className={`safety-panel ${safety.riskSignal ? "risk" : ""}`}>
                  <h3><Icon name="shield" size={18} /> {safety.riskSignal ? "Signal de prudence" : "Données de sécurité insuffisantes"}</h3>
                  <p>{safety.summary}</p>
                  {safety.riskRationale && <p><strong>Contexte :</strong> {safety.riskRationale}</p>}
                  <p>{safety.precautions}</p>
                  {safety.source && <Link className="safety-source" href={`/publications#${safety.source.slug}`}>Source de prudence : {safety.source.authors} ({safety.source.year})</Link>}
                </div>
              ) : <div className="empty-note">Les données spécifiques de sécurité ne sont pas renseignées dans cette fiche.</div>}
            </section>
          </div>

          <aside className="detail-aside" aria-label="Identité botanique et repères">
            <div className="detail-identity">
              <span className="family-tag">Identité botanique</span>
              <h2><em>{plant.scientificName}</em></h2>
              <span className="identity-author">{plant.botanicalAuthor ? `Autorité botanique : ${plant.botanicalAuthor}` : "Autorité botanique non renseignée"}</span>
              <span className="identity-family">Famille · {plant.family}</span>
              <dl className="identity-list">
                <div><dt>Parties étudiées</dt><dd>{plant.partsUsed.length ? plant.partsUsed.join(", ") : "Non documentées"}</dd></div>
                <div><dt>Noms usuels</dt><dd>{commonNames.length ? commonNames.map((record) => `${record.name}${record.region ? ` — ${record.region}` : ""}`).join("; ") : "Non harmonisés dans les sources consultées"}</dd></div>
                <div><dt>Synonymes</dt><dd>{plant.synonyms.length ? plant.synonyms.join("; ") : "Aucun synonyme documenté ici"}</dd></div>
                <div><dt>Contexte des sources</dt><dd>{sourceNames}</dd></div>
                <div><dt>Références</dt><dd>{studies.length} publication{studies.length === 1 ? "" : "s"} liée{studies.length === 1 ? "" : "s"}</dd></div>
              </dl>
            </div>
            <div className="detail-aside-note"><strong>Important.</strong> La présence d’une espèce dans une étude ne prouve ni sa sécurité ni son efficacité clinique. Les affirmations sont sourcées et les limites restent visibles.</div>
            <div className="detail-aside-badges">
              {claims.slice(0, 3).map((claim) => <div key={claim.id}><EvidenceBadge level={claim.evidenceLevel} compact /><span>{claim.pathology?.name ?? claim.mechanism?.name ?? "Affirmation de sécurité"}</span></div>)}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
