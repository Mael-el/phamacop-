import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getCompoundBySlug } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getCompoundBySlug(slug), getDictionary()]);
  return { title: data?.compound.name ?? t.compounds.detailKicker, description: data?.compound.description };
}

export default async function CompoundDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getCompoundBySlug(slug), getDictionary()]);
  if (!data) notFound();

  return (
    <main><div className="wrap">
      <Breadcrumbs items={[{ label: t.nav.composes, href: "/composes" }, { label: data.compound.name }]} />
      <header className="detail-title-block">
        <p className="section-kicker">{t.compounds.detailKicker}</p>
        <h1 className="plant-detail-title">{data.compound.name}</h1>
        <span className="compound-family-pill">{data.compound.chemicalFamily}</span>
        <p className="detail-title-summary">{data.compound.description}</p>
      </header>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="section-heading">
          <div><p className="section-kicker">{t.compounds.relations}</p><h2>{t.compounds.plantsPublications}</h2></div>
          <span className="results-count">{data.plants.length} {data.plants.length === 1 ? t.compounds.associationOne : t.compounds.associationMany}</span>
        </div>
        <div className="related-record-grid">
          {data.plants.map(({ plant, source }) => (
            <article className="related-record" key={`${plant.id}-${source.id}`}>
              <span className="family-tag">{plant.family}</span>
              <h3><Link href={`/plantes/${plant.slug}`}><em>{plant.scientificName}</em><Icon name="arrow" size={14} /></Link></h3>
              <p>{plant.partsUsed.join(", ") || t.compounds.partUnspecified}</p>
              <div className="related-record-source">
                <strong>{t.compounds.identificationSource}</strong>
                <Link href={`/publications#${source.slug}`}>{source.authors} ({source.year})</Link>
                {source.doi && <a href={`https://doi.org/${source.doi}`} target="_blank" rel="noreferrer">DOI {source.doi} <Icon name="external" size={12} /></a>}
              </div>
            </article>
          ))}
        </div>
        <div className="method-callout" style={{ marginTop: 25, maxWidth: 760 }}><strong>{t.compounds.cautionTitle}</strong> {t.compounds.cautionBody}</div>
      </section>
    </div></main>
  );
}
