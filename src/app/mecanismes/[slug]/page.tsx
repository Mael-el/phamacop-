import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { Icon } from "@/components/icon";
import { getMechanismBySlug } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getMechanismBySlug(slug), getDictionary()]);
  return { title: data?.mechanism.name ?? t.mechanisms.tag, description: data?.mechanism.description };
}

export default async function MechanismDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getMechanismBySlug(slug), getDictionary()]);
  if (!data) notFound();
  const pathologies = [...new Map(data.claims.filter((claim) => claim.pathology).map((claim) => [claim.pathology!.id, claim.pathology!])).values()];

  return (
    <main><div className="wrap">
      <Breadcrumbs items={[{ label: t.nav.mecanismes, href: "/mecanismes" }, { label: data.mechanism.name }]} />
      <header className="detail-title-block">
        <p className="section-kicker">{t.mechanisms.detailKicker}</p>
        <h1 className="plant-detail-title">{data.mechanism.name}</h1>
        <p className="detail-title-summary">{data.mechanism.description}</p>
      </header>
      <section className="mechanism-explainer">
        <span className="explainer-icon"><Icon name="flask" size={22} /></span>
        <div><strong>{t.mechanisms.plainTitle}</strong><p>{data.mechanism.readingText}</p></div>
      </section>
      {pathologies.length > 0 && <div className="related-mechanisms"><strong>{t.mechanisms.relatedSubjects}</strong><div>{pathologies.map((pathology) => <Link key={pathology.id} href={`/pathologies/${pathology.slug}`}>{pathology.name}<Icon name="arrow" size={13} /></Link>)}</div></div>}
      <section className="page-content">
        <div className="section-heading">
          <div><p className="section-kicker">{t.mechanisms.relatedStudies}</p><h2>{t.mechanisms.plantsClaims}</h2></div>
          <span className="results-count">{data.claims.length} {data.claims.length === 1 ? t.mechanisms.resultOne : t.mechanisms.resultMany}</span>
        </div>
        {data.claims.length ? <div className="pathology-claims">{data.claims.map((claim) => <ClaimCard key={claim.id} claim={claim} t={t} showPlant />)}</div> : <div className="empty-note">{t.mechanisms.emptyDetail}</div>}
      </section>
    </div></main>
  );
}
