import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlantCard } from "@/components/plant-card";
import { SearchForm } from "@/components/search-form";
import { getPlantFamilies, getPlants } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import { foldText } from "@/lib/search-text";

export const dynamic = "force-dynamic";

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: Promise<{ famille?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const selectedFamily = typeof params.famille === "string" ? params.famille : "";
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const [allPlants, families, { t }] = await Promise.all([
    getPlants(selectedFamily || undefined),
    getPlantFamilies(),
    getDictionary(),
  ]);
  // Filtrage local tolérant (casse, accents, mots partiels) sur les noms et les familles.
  const needle = foldText(query);
  const plants = needle
    ? allPlants.filter((plant) =>
        foldText(
          [
            plant.scientificName,
            plant.botanicalAuthor ?? "",
            plant.family,
            plant.summary,
            ...plant.commonNames.map((entry) => entry.name),
            ...plant.synonyms,
          ].join(" "),
        ).includes(needle),
      )
    : allPlants;
  const withQuery = (href: string) => (query ? `${href}${href.includes("?") ? "&" : "?"}q=${encodeURIComponent(query)}` : href);

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
          <div className="page-search-bar">
            <SearchForm placeholder={t.plants.searchPlaceholder} action="/plantes" defaultValue={query} />
          </div>
          <div className="filter-row" aria-label={t.plants.filterAria}>
            <Link href={withQuery("/plantes")} className={`filter-chip ${!selectedFamily ? "active" : ""}`}>{t.plants.allFamilies}</Link>
            {families.map((family) => <Link key={family} href={withQuery(`/plantes?famille=${encodeURIComponent(family)}`)} className={`filter-chip ${selectedFamily === family ? "active" : ""}`}>{family}</Link>)}
          </div>
          <p className="results-count">
            {plants.length} {plants.length === 1 ? t.plants.countOne : t.plants.countMany}
            {selectedFamily ? ` · ${selectedFamily}` : ""}
            {query ? ` · « ${query} »` : ""}
          </p>
          {plants.length
            ? <div className="plant-grid">{plants.map((plant, index) => <PlantCard key={plant.id} plant={plant} t={t} index={index} />)}</div>
            : (
              <div className="empty-note">
                {t.plants.empty}
                {query && (
                  <span className="empty-note-more">
                    {t.search.tryInstead}{" "}
                    <Link href={withQuery("/plantes")}>{t.plants.allFamilies}</Link> ·{" "}
                    <Link href={`/recherche?q=${encodeURIComponent(query)}`}>{t.search.localTitle}</Link>
                  </span>
                )}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
