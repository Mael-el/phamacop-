import Link from "next/link";
import type { StudyRecord, PlantRecord } from "@/lib/catalog";
import type { StudyType } from "@/db/schema";
import { Icon } from "@/components/icon";

const typeLabels: Record<StudyType, string> = {
  IN_VITRO: "In vitro",
  IN_VIVO: "In vivo · modèle animal",
  MIXED_PRECLINICAL: "Étude préclinique multi-modèles",
  CLINICAL: "Clinique",
  OBSERVATIONAL: "Observationnelle",
  REVIEW: "Revue de littérature",
  ETHNOBOTANICAL: "Ethnobotanique",
};

export function StudyTypeLabel({ type }: { type: StudyType }) {
  return <span className="study-type-label">{typeLabels[type] ?? "Étude"}</span>;
}

export function StudyCard({ study, associatedPlants = [] }: { study: StudyRecord; associatedPlants?: PlantRecord[] }) {
  const doiUrl = study.doi ? `https://doi.org/${study.doi}` : study.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/` : study.sourceUrl;
  return (
    <article className="study-card" id={study.slug}>
      <div className="study-card-head">
        <StudyTypeLabel type={study.studyType} />
        <span className="study-year">{study.year}</span>
      </div>
      <h3>{study.title}</h3>
      <p className="study-authors">{study.authors} · {study.journal}</p>
      <p className="study-summary">{study.keyResults}</p>
      {study.limitations && <p className="study-limit"><strong>Limites :</strong> {study.limitations}</p>}
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
