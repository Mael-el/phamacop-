import type { StudyType } from "@/db/schema";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchForm } from "@/components/search-form";
import { StudyCard } from "@/components/study-card";
import { getStudies } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const studyFilters: Array<{ value: StudyType | ""; label: string }> = [
  { value: "", label: "Toutes les études" },
  { value: "IN_VITRO", label: "In vitro" },
  { value: "IN_VIVO", label: "In vivo" },
  { value: "MIXED_PRECLINICAL", label: "Préclinique multi-modèles" },
  { value: "CLINICAL", label: "Clinique" },
  { value: "ETHNOBOTANICAL", label: "Ethnobotanique" },
  { value: "REVIEW", label: "Revues" },
];

export default async function PublicationsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const allStudies = await getStudies();
  const selectedType = studyFilters.some((filter) => filter.value === params.type) ? params.type ?? "" : "";
  const filteredStudies = selectedType ? allStudies.filter((study) => study.studyType === selectedType) : allStudies;

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Publications" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Bibliographie · liens DOI et PubMed</p><h1>Les sources avant les conclusions.</h1><p className="lead">Les publications qui soutiennent le corpus sont consultables par leur DOI ou leur identifiant PubMed. Les résumés en français indiquent aussi le modèle d’étude et les limites.</p></div>
          <aside className="page-hero-aside"><strong>Références vérifiables</strong>Chaque publication de la base comporte au moins un DOI ou un PMID. Les liens ouvrent la source externe.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="page-search-bar"><SearchForm placeholder="Rechercher une publication ou une plante…" /></div>
        <div className="filter-row" aria-label="Filtrer les publications par type">
          {studyFilters.map((filter) => <a key={filter.value || "all"} className={`filter-chip ${selectedType === filter.value ? "active" : ""}`} href={filter.value ? `/publications?type=${filter.value}` : "/publications"}>{filter.label}</a>)}
        </div>
        <p className="results-count">{filteredStudies.length} publication{filteredStudies.length === 1 ? "" : "s"} · triées par année</p>
        {filteredStudies.length ? filteredStudies.map((study) => <StudyCard key={study.id} study={study} associatedPlants={study.plants} />) : <div className="empty-note">Aucune publication pour ce type.</div>}
      </div></section>
    </main>
  );
}
