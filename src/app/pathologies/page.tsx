import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getPathologies } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function PathologiesPage() {
  const items = await getPathologies();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Pathologies" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Parcours guidé · du sujet à la source</p><h1>Explorer par sujet.</h1><p className="lead">Ces pages rassemblent des questions de recherche et les affirmations documentées qui y sont associées. Elles ne proposent ni diagnostic, ni recommandation de plante, ni traitement.</p></div>
          <aside className="page-hero-aside"><strong>À lire avec recul</strong>Un sujet pathologique relié à une plante signifie uniquement qu’une étude ou une source traite de cette relation.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {items.length ? <div className="record-grid">{items.map((item) => (
          <Link href={`/pathologies/${item.slug}`} className="record-card" key={item.id}>
            <div className="record-card-top"><span className="record-tag">Dossier documentaire</span><span>{item.claimCount} affirmation{item.claimCount === 1 ? "" : "s"}</span></div>
            <h2>{item.name}</h2><p>{item.summary}</p>
            <span className="record-card-link">Ouvrir le parcours <Icon name="arrow" size={15} /></span>
          </Link>
        ))}</div> : <div className="empty-note">Aucun dossier n’est encore publié.</div>}
      </div></section>
    </main>
  );
}
