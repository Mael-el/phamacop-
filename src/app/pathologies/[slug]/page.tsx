import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { Icon } from "@/components/icon";
import { getPathologyBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPathologyBySlug(slug);
  return { title: data?.pathology.name ?? "Dossier de recherche", description: data?.pathology.summary };
}

export default async function PathologyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPathologyBySlug(slug);
  if (!data) notFound();
  const mechanisms = [...new Map(data.claims.filter((claim) => claim.mechanism).map((claim) => [claim.mechanism!.id, claim.mechanism!])).values()];

  return (
    <main><div className="wrap">
      <Breadcrumbs items={[{ label: "Pathologies", href: "/pathologies" }, { label: data.pathology.name }]} />
      <header className="detail-title-block">
        <p className="section-kicker">Dossier documentaire · parcours guidé</p>
        <h1 className="plant-detail-title">{data.pathology.name}</h1>
        <p className="detail-title-summary">{data.pathology.summary}</p>
      </header>
      <section className="pathology-caution">
        <Icon name="shield" size={20} /><p>{data.pathology.scopeNote}</p>
      </section>
      <div className="pathway-inline" aria-label="Parcours de recherche">
        <span>Pathologie</span><Icon name="arrow" size={15} /><span>Mécanisme étudié</span><Icon name="arrow" size={15} /><span>Plante</span><Icon name="arrow" size={15} /><span>Preuve & source</span>
      </div>
      <section className="page-content">
        <div className="section-heading"><div><p className="section-kicker">Affirmations reliées</p><h2>Ce que les études ont testé.</h2></div><span className="results-count">{data.claims.length} affirmation{data.claims.length === 1 ? "" : "s"}</span></div>
        {mechanisms.length > 0 && <div className="related-mechanisms"><strong>Mécanismes ou résultats expérimentaux associés</strong><div>{mechanisms.map((mechanism) => <Link key={mechanism.id} href={`/mecanismes/${mechanism.slug}`}>{mechanism.name}<Icon name="arrow" size={13} /></Link>)}</div></div>}
        {data.claims.length ? <div className="pathology-claims">{data.claims.map((claim) => <ClaimCard key={claim.id} claim={claim} showPlant />)}</div> : <div className="empty-note">Aucune affirmation sourcée n’est actuellement associée à ce dossier.</div>}
      </section>
    </div></main>
  );
}
