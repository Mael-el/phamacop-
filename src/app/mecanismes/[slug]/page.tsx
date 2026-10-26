import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { Icon } from "@/components/icon";
import { getMechanismBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMechanismBySlug(slug);
  return { title: data?.mechanism.name ?? "Mécanisme", description: data?.mechanism.description };
}

export default async function MechanismDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMechanismBySlug(slug);
  if (!data) notFound();
  const pathologies = [...new Map(data.claims.filter((claim) => claim.pathology).map((claim) => [claim.pathology!.id, claim.pathology!])).values()];

  return (
    <main><div className="wrap">
      <Breadcrumbs items={[{ label: "Mécanismes", href: "/mecanismes" }, { label: data.mechanism.name }]} />
      <header className="detail-title-block">
        <p className="section-kicker">Comprendre · résultat expérimental</p>
        <h1 className="plant-detail-title">{data.mechanism.name}</h1>
        <p className="detail-title-summary">{data.mechanism.description}</p>
      </header>
      <section className="mechanism-explainer">
        <span className="explainer-icon"><Icon name="flask" size={22} /></span>
        <div><strong>En termes simples</strong><p>{data.mechanism.readingText}</p></div>
      </section>
      {pathologies.length > 0 && <div className="related-mechanisms"><strong>Sujets associés</strong><div>{pathologies.map((pathology) => <Link key={pathology.id} href={`/pathologies/${pathology.slug}`}>{pathology.name}<Icon name="arrow" size={13} /></Link>)}</div></div>}
      <section className="page-content">
        <div className="section-heading"><div><p className="section-kicker">Études reliées</p><h2>Plantes & affirmations.</h2></div><span className="results-count">{data.claims.length} résultat{data.claims.length === 1 ? "" : "s"}</span></div>
        {data.claims.length ? <div className="pathology-claims">{data.claims.map((claim) => <ClaimCard key={claim.id} claim={claim} showPlant />)}</div> : <div className="empty-note">Aucune affirmation n’est associée à cet axe pour le moment.</div>}
      </section>
    </div></main>
  );
}
