import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getCompounds } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CompoundsPage() {
  const items = await getCompounds();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Composés" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Phytochimie · composés identifiés</p><h1>De l’espèce à la molécule.</h1><p className="lead">Les molécules listées ici sont celles que les études associées ont isolées ou caractérisées. Leur présence ne signifie ni efficacité thérapeutique ni sécurité d’emploi.</p></div>
          <aside className="page-hero-aside"><strong>Traçabilité chimique</strong>Chaque composé renvoie à la plante et à la publication qui l’a identifié. Les essais précliniques restent distincts des résultats cliniques.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/composes/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">{item.chemicalFamily}</span><span>{item.plantCount} espèce{item.plantCount === 1 ? "" : "s"}</span></div>
            <h2>{item.name}</h2><p>{item.description}</p>
            <span className="record-card-link">Suivre les références <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">Aucun composé n’est encore documenté dans le corpus.</div>}
      </div></section>
    </main>
  );
}
