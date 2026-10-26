import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getMechanisms } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function MechanismsPage() {
  const items = await getMechanisms();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Mécanismes" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Mesures expérimentales · pas des promesses</p><h1>Comprendre ce qui a été mesuré.</h1><p className="lead">Les termes ci-dessous décrivent les cibles ou résultats expérimentaux mentionnés dans les articles. Un résultat en culture ou chez l’animal ne démontre pas un mécanisme clinique chez l’humain.</p></div>
          <aside className="page-hero-aside"><strong>Lecture scientifique</strong>Chaque axe est relié à une affirmation, un modèle d’étude et une publication consultable.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/mecanismes/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">Axe expérimental</span><span>{item.claimCount} affirmation{item.claimCount === 1 ? "" : "s"}</span></div>
            <h2>{item.name}</h2><p>{item.description}</p>
            <span className="record-card-link">Lire l’explication <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">Aucun mécanisme n’est encore publié.</div>}
      </div></section>
    </main>
  );
}
