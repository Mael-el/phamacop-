import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getPathologies } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PathologiesPage() {
  const [items, { t }] = await Promise.all([getPathologies(), getDictionary()]);
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.pathologies }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.pathologies.kicker}</p><h1>{t.pathologies.title}</h1><p className="lead">{t.pathologies.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.pathologies.asideTitle}</strong>{t.pathologies.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/pathologies/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">{t.pathologies.tag}</span><span>{item.claimCount} {item.claimCount === 1 ? t.pathologies.claimOne : t.pathologies.claimMany}</span></div>
            <h2>{item.name}</h2><p>{item.summary}</p>
            <span className="record-card-link">{t.pathologies.open} <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">{t.pathologies.empty}</div>}
      </div></section>
    </main>
  );
}
