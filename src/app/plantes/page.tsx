import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlantCard } from "@/components/plant-card";
import { SearchForm } from "@/components/search-form";
import { getPlantFamilies, getPlants } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PlantsPage({ searchParams }: { searchParams: Promise<{ famille?: string | string[] }> }) {
  const params = await searchParams;
  const selectedFamily = typeof params.famille === "string" ? params.famille : "";
  const [plants, families, { t }] = await Promise.all([getPlants(selectedFamily || undefined), getPlantFamilies(), getDictionary()]);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: t.nav.plantes }]} />
          <div className="page-hero-inner">
            <div>
              <p className="section-kicker">{t.plants.kicker}</p>
              <h1>{t.plants.title}</h1>
              <p className="lead">{t.plants.lead}</p>
            </div>
            <aside className="page-hero-aside"><strong>{t.plants.asideTitle}</strong>{t.plants.asideBody}</aside>
          </div>
        </div>
      </section>
      <section className="page-content">
        <div className="wrap">
          <div className="page-search-bar"><SearchForm placeholder={t.plants.searchPlaceholder} /></div>
          <div className="filter-row" aria-label={t.plants.filterAria}>
            <Link href="/plantes" className={`filter-chip ${!selectedFamily ? "active" : ""}`}>{t.plants.allFamilies}</Link>
            {families.map((family) => <Link key={family} href={`/plantes?famille=${encodeURIComponent(family)}`} className={`filter-chip ${selectedFamily === family ? "active" : ""}`}>{family}</Link>)}
          </div>
          <p className="results-count">
            {plants.length} {plants.length === 1 ? t.plants.countOne : t.plants.countMany}{selectedFamily ? ` · ${selectedFamily}` : ""}
          </p>
          {plants.length
            ? <div className="plant-grid">{plants.map((plant, index) => <PlantCard key={plant.id} plant={plant} t={t} index={index} />)}</div>
            : <div className="empty-note">{t.plants.empty}</div>}
        </div>
      </section>
    </main>
  );
}
