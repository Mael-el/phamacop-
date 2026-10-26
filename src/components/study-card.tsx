import Link from "next/link";
import type { StudyRecord, PlantRecord } from "@/lib/catalog";
import type { StudyType } from "@/db/schema";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";

function typeLabels(t: Dictionary): Record<StudyType, string> {
  return {
    IN_VITRO: t.study.inVitro,
    IN_VIVO: t.study.inVivo,
    MIXED_PRECLINICAL: t.study.mixed,
    CLINICAL: t.study.clinical,
    OBSERVATIONAL: t.study.observational,
    REVIEW: t.study.review,
    ETHNOBOTANICAL: t.study.ethnobotanical,
  };
}

export function StudyTypeLabel({ type, t }: { type: StudyType; t: Dictionary }) {
  return <span className="study-type-label">{typeLabels(t)[type] ?? t.study.fallback}</span>;
}

export function StudyCard({ study, t, associatedPlants = [] }: { study: StudyRecord; t: Dictionary; associatedPlants?: PlantRecord[] }) {
  const doiUrl = study.doi ? `https://doi.org/${study.doi}` : study.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/` : study.sourceUrl;
  return (
    <article className="study-card" id={study.slug}>
      <div className="study-card-head">
        <StudyTypeLabel type={study.studyType} t={t} />
        <span className="study-year">{study.year}</span>
      </div>
      <h3>{study.title}</h3>
      <p className="study-authors">{study.authors} · {study.journal}</p>
      <p className="study-summary">{study.keyResults}</p>
      {study.limitations && <p className="study-limit"><strong>{t.publications.limits} :</strong> {study.limitations}</p>}
      {associatedPlants.length > 0 && (
        <div className="study-plants">
          {associatedPlants.map((plant) => <Link key={plant.id} href={`/plantes/${plant.slug}`}><em>{plant.scientificName}</em></Link>)}
        </div>
      )}
      <div className="study-links">
        <a href={doiUrl} target="_blank" rel="noreferrer">
          <Icon name="external" size={15} /> {study.doi ? `DOI ${study.doi}` : `PMID ${study.pmid}`}
        </a>
        {study.pmid && <a href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`} target="_blank" rel="noreferrer">PubMed</a>}
      </div>
    </article>
  );
}
