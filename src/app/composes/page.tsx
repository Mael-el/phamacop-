import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getCompounds } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function CompoundsPage() {
  const [items, { t }] = await Promise.all([getCompounds(), getDictionary()]);
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.composes }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.compounds.kicker}</p><h1>{t.compounds.title}</h1><p className="lead">{t.compounds.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.compounds.asideTitle}</strong>{t.compounds.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/composes/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">{item.chemicalFamily}</span><span>{item.plantCount} {item.plantCount === 1 ? t.compounds.speciesOne : t.compounds.speciesMany}</span></div>
            <h2>{item.name}</h2><p>{item.description}</p>
            <span className="record-card-link">{t.compounds.open} <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">{t.compounds.empty}</div>}
      </div></section>
    </main>
  );
}
