import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getTargets } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function TargetsPage() {
  const [items, { t }] = await Promise.all([getTargets(), getDictionary()]);
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: t.nav.cibles }]} />
          <div className="page-hero-inner">
            <div>
              <p className="section-kicker">{t.chain.kicker}</p>
              <h1>{t.chain.title}</h1>
              <p className="lead">{t.chain.lead}</p>
            </div>
            <aside className="page-hero-aside">
              <strong>{t.chain.asideTitle}</strong>
              {t.chain.asideBody}
            </aside>
          </div>
        </div>
      </section>
      <section className="page-content">
        <div className="wrap">
          {items.length ? (
            <div className="record-grid">
              {items.map((item) => (
                <Link href={`/cibles/${item.slug}`} className="record-card" key={item.id}>
                  <div className="record-card-top">
                    <span className="record-tag">{t.chain.types[item.targetType]}</span>
                    <span>
                      {item.claimCount} {item.claimCount === 1 ? t.chain.claimOne : t.chain.claimMany}
                    </span>
                  </div>
                  <h2>{item.name}</h2>
                  {item.organism && <p className="record-card-organism">{item.organism}</p>}
                  <p>{item.description}</p>
                  <span className="record-card-link">
                    {t.chain.open} <Icon name="arrow" size={15} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-note">{t.chain.empty}</div>
          )}
        </div>
      </section>
    </main>
  );
}
