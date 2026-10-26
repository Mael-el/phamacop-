import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getMechanisms } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function MechanismsPage() {
  const [items, { t }] = await Promise.all([getMechanisms(), getDictionary()]);
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.mecanismes }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.mechanisms.kicker}</p><h1>{t.mechanisms.title}</h1><p className="lead">{t.mechanisms.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.mechanisms.asideTitle}</strong>{t.mechanisms.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/mecanismes/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">{t.mechanisms.tag}</span><span>{item.claimCount} {item.claimCount === 1 ? t.mechanisms.claimOne : t.mechanisms.claimMany}</span></div>
            <h2>{item.name}</h2><p>{item.description}</p>
            <span className="record-card-link">{t.mechanisms.open} <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">{t.mechanisms.empty}</div>}
      </div></section>
    </main>
  );
}
