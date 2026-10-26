import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlantCard } from "@/components/plant-card";
import { SearchForm } from "@/components/search-form";
import { getPlantFamilies, getPlants } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function PlantsPage({ searchParams }: { searchParams: Promise<{ famille?: string | string[] }> }) {
  const params = await searchParams;
  const selectedFamily = typeof params.famille === "string" ? params.famille : "";
  const [plants, families] = await Promise.all([getPlants(selectedFamily || undefined), getPlantFamilies()]);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Plantes" }]} />
          <div className="page-hero-inner">
            <div>
              <p className="section-kicker">Catalogue botanique · corpus initial</p>
              <h1>Les plantes documentées.</h1>
              <p className="lead">Chaque fiche relie identité botanique, usages rapportés, études scientifiques, composés et précautions. La présence d’une espèce dans l’herbier n’est ni une validation médicale ni une recommandation.</p>
            </div>
            <aside className="page-hero-aside"><strong>Comment lire ces fiches</strong>Les résultats scientifiques sont attachés à des affirmations précises et à leurs sources. Les traditions sont consignées séparément et étiquetées.</aside>
          </div>
        </div>
      </section>
      <section className="page-content">
        <div className="wrap">
          <div className="page-search-bar"><SearchForm placeholder="Nom scientifique, famille, sujet…" /></div>
          <div className="filter-row" aria-label="Filtrer par famille botanique">
            <Link href="/plantes" className={`filter-chip ${!selectedFamily ? "active" : ""}`}>Toutes les familles</Link>
            {families.map((family) => <Link key={family} href={`/plantes?famille=${encodeURIComponent(family)}`} className={`filter-chip ${selectedFamily === family ? "active" : ""}`}>{family}</Link>)}
          </div>
          <p className="results-count">{plants.length} {plants.length === 1 ? "espèce" : "espèces"} dans le catalogue{selectedFamily ? ` · ${selectedFamily}` : ""}</p>
          {plants.length ? <div className="plant-grid">{plants.map((plant, index) => <PlantCard key={plant.id} plant={plant} index={index} />)}</div> : <div className="empty-note">Aucune espèce ne correspond à cette famille dans le corpus actuel.</div>}
        </div>
      </section>
    </main>
  );
}
