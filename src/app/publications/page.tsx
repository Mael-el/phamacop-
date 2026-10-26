import type { StudyType } from "@/db/schema";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchForm } from "@/components/search-form";
import { StudyCard } from "@/components/study-card";
import { getStudies } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PublicationsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const [allStudies, { t }] = await Promise.all([getStudies(), getDictionary()]);
  const studyFilters: Array<{ value: StudyType | ""; label: string }> = [
    { value: "", label: t.publications.all },
    { value: "IN_VITRO", label: t.study.inVitro },
    { value: "IN_VIVO", label: t.study.inVivo },
    { value: "MIXED_PRECLINICAL", label: t.publications.preclinicalMixed },
    { value: "CLINICAL", label: t.publications.clinical },
    { value: "ETHNOBOTANICAL", label: t.publications.ethnobotanical },
    { value: "REVIEW", label: t.publications.reviews },
  ];
  const selectedType = studyFilters.some((filter) => filter.value === params.type) ? params.type ?? "" : "";
  const filteredStudies = selectedType ? allStudies.filter((study) => study.studyType === selectedType) : allStudies;

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.nav.publications }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.publications.kicker}</p><h1>{t.publications.title}</h1><p className="lead">{t.publications.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.publications.asideTitle}</strong>{t.publications.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="page-search-bar"><SearchForm placeholder={t.publications.searchPlaceholder} /></div>
        <div className="filter-row" aria-label={t.publications.filterAria}>
          {studyFilters.map((filter) => (
            <a key={filter.value || "all"} className={`filter-chip ${selectedType === filter.value ? "active" : ""}`} href={filter.value ? `/publications?type=${filter.value}` : "/publications"}>{filter.label}</a>
          ))}
        </div>
        <p className="results-count">{filteredStudies.length} {filteredStudies.length === 1 ? t.publications.countOne : t.publications.countMany}</p>
        {filteredStudies.length
          ? filteredStudies.map((study) => <StudyCard key={study.id} study={study} t={t} associatedPlants={study.plants} />)
          : <div className="empty-note">{t.publications.empty}</div>}
      </div></section>
    </main>
  );
}
