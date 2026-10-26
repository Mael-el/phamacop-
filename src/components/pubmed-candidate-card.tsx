import type { PubMedCandidate } from "@/lib/pubmed";
import { Icon } from "@/components/icon";

export function PubMedCandidateCard({ candidate }: { candidate: PubMedCandidate }) {
  return (
    <article className="candidate-card">
      <div className="candidate-card-head">
        <span className="candidate-status"><span aria-hidden="true" /> PubMed · à valider</span>
        {candidate.publicationYear && <span className="study-year">{candidate.publicationYear}</span>}
      </div>
      <h3>{candidate.title}</h3>
      <p className="candidate-authors">{candidate.authors || "Auteurs non renseignés"} · {candidate.journal || "Revue non renseignée"}</p>
      {candidate.publicationTypes.length > 0 && (
        <div className="candidate-tags">{candidate.publicationTypes.slice(0, 3).map((type) => <span key={type}>{type}</span>)}</div>
      )}
      {candidate.abstractText && (
        <details className="candidate-abstract">
          <summary>Lire le résumé original de PubMed</summary>
          <p>{candidate.abstractText}</p>
        </details>
      )}
      <div className="candidate-card-foot">
        <span><Icon name="shield" size={14} /> Notice candidate — pas encore validée ni publiée dans les fiches.</span>
        <div className="candidate-links">
          {candidate.doi && <a href={`https://doi.org/${candidate.doi}`} target="_blank" rel="noreferrer">DOI <Icon name="external" size={12} /></a>}
          <a href={candidate.sourceUrl} target="_blank" rel="noreferrer">PMID {candidate.pmid} <Icon name="external" size={12} /></a>
        </div>
      </div>
    </article>
  );
}
