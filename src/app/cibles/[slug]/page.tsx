import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClaimCard } from "@/components/claim-card";
import { Icon } from "@/components/icon";
import { PhotoFigure } from "@/components/plant-photo";
import { getTargetBySlug } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function TargetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [data, { t }] = await Promise.all([getTargetBySlug(slug), getDictionary()]);
  if (!data) notFound();

  const { target } = data;
  const preparations = new Map<number, string>();
  for (const claim of data.claims) {
    for (const preparation of claim.preparations ?? []) {
      preparations.set(preparation.id, preparation.name);
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: t.nav.cibles, href: "/cibles" }, { label: target.name }]} />
          <div className="page-hero-inner">
            <div>
              <p className="section-kicker">{t.chain.detailKicker}</p>
              <h1>{target.name}</h1>
              <p className="lead">{target.description}</p>
            </div>
            <aside className="page-hero-aside">
              <strong>{t.chain.tag}</strong>
              <p>
                {t.chain.types[target.targetType]}
                {target.organism ? ` · ${t.chain.organism} : ${target.organism}` : ""}
              </p>
              <p>
                {t.chain.externalId} : {target.externalId ?? t.chain.noExternalId}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="page-content">
        <div className="wrap detail-layout">
          <div className="detail-main">
            <section className="detail-section">
              <h2 className="detail-section-title">
                <span className="section-index">01</span> {t.chain.relatedClaims}
              </h2>
              <p className="detail-section-copy">{t.chain.pathwayNote}</p>
              {data.claims.length ? (
                <div className="claim-stack">
                  {data.claims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} t={t} showPlant />
                  ))}
                </div>
              ) : (
                <div className="empty-note">{t.chain.empty}</div>
              )}
            </section>

            {preparations.size > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">
                  <span className="section-index">02</span> {t.chain.relatedPreparations}
                </h2>
                <ul className="pathway-preparations">
                  {[...preparations.entries()].map(([id, name]) => (
                    <li key={id}>
                      <Icon name="book" size={14} /> {name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="detail-aside">
            {data.illustration && (
              <PhotoFigure
                photo={data.illustration}
                alt={t.plants.photoAlt.replace("{name}", data.illustration.scientificName)}
                caption={`${t.plants.photoIllustration} : ${data.illustration.scientificName}`}
                t={t}
              />
            )}
            <div className="aside-card">
              <h2>{t.chain.tag}</h2>
              <p>
                {t.chain.types[target.targetType]}
                {target.organism ? ` · ${target.organism}` : ""}
              </p>
              <Link className="aside-link" href="/plantes">
                {t.plants.title} <Icon name="arrow" size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
