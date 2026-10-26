import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { Icon } from "@/components/icon";
import { PhotoFigure } from "@/components/plant-photo";
import { getPathologyBySlug } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getPathologyBySlug(slug), getDictionary()]);
  return { title: data?.pathology.name ?? t.pathologies.tag, description: data?.pathology.summary };
}

export default async function PathologyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getPathologyBySlug(slug), getDictionary()]);
  if (!data) notFound();
  const mechanisms = [...new Map(data.claims.filter((claim) => claim.mechanism).map((claim) => [claim.mechanism!.id, claim.mechanism!])).values()];

  return (
    <main><div className="wrap">
      <Breadcrumbs items={[{ label: t.nav.pathologies, href: "/pathologies" }, { label: data.pathology.name }]} />
      <header className="detail-title-block">
        <p className="section-kicker">{t.pathologies.detailKicker}</p>
        <h1 className="plant-detail-title">{data.pathology.name}</h1>
        <p className="detail-title-summary">{data.pathology.summary}</p>
      </header>
      {data.illustration && (
        <div className="detail-illustration">
          <PhotoFigure
            photo={data.illustration}
            alt={t.plants.photoAlt.replace("{name}", data.illustration.scientificName)}
            caption={`${t.plants.photoIllustration} : ${data.illustration.scientificName}`}
            t={t}
          />
        </div>
      )}
      <section className="pathology-caution">
        <Icon name="shield" size={20} /><p>{data.pathology.scopeNote}</p>
      </section>
      <div className="pathway-inline" aria-label={t.pathologies.relatedClaims}>
        <span>{t.pathologies.pathway}</span><Icon name="arrow" size={15} /><span>{t.pathologies.pathwayMechanism}</span><Icon name="arrow" size={15} /><span>{t.pathologies.pathwayPlant}</span><Icon name="arrow" size={15} /><span>{t.pathologies.pathwayEvidence}</span>
      </div>
      <section className="page-content">
        <div className="section-heading">
          <div><p className="section-kicker">{t.pathologies.relatedClaims}</p><h2>{t.pathologies.tested}</h2></div>
          <span className="results-count">{data.claims.length} {data.claims.length === 1 ? t.pathologies.countOne : t.pathologies.countMany}</span>
        </div>
        {mechanisms.length > 0 && <div className="related-mechanisms"><strong>{t.pathologies.relatedMechanisms}</strong><div>{mechanisms.map((mechanism) => <Link key={mechanism.id} href={`/mecanismes/${mechanism.slug}`}>{mechanism.name}<Icon name="arrow" size={13} /></Link>)}</div></div>}
        <div style={{ marginTop: 14 }}>
          <Link className="text-link" href="/solutions">{t.plants.solutionsTitle} <Icon name="arrow" size={15} /></Link>
        </div>
        {data.claims.length ? <div className="pathology-claims">{data.claims.map((claim) => <ClaimCard key={claim.id} claim={claim} t={t} showPlant />)}</div> : <div className="empty-note">{t.pathologies.claimsEmpty}</div>}
      </section>
    </div></main>
  );
}
