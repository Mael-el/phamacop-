import Link from "next/link";
import type { StudyRecord } from "@/lib/catalog";
import type { EvidenceLevel } from "@/db/schema";
import { EvidenceBadge, ReviewStatus } from "@/components/evidence-badge";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";

type ClaimCardData = {
  slug: string;
  evidenceLevel: EvidenceLevel;
  reviewerStatus: string;
  claimText: string;
  rationale: string;
  limitations: string;
  sources: StudyRecord[];
  plant?: { slug: string; scientificName: string };
};

export function ClaimCard({ claim, t, showPlant = false }: { claim: ClaimCardData; t: Dictionary; showPlant?: boolean }) {
  return (
    <article className="claim-card" id={`affirmation-${claim.slug}`}>
      <div className="claim-card-heading">
        <EvidenceBadge level={claim.evidenceLevel} t={t} />
        <ReviewStatus label={claim.reviewerStatus} />
      </div>
      {showPlant && claim.plant && <Link className="claim-plant-link" href={`/plantes/${claim.plant.slug}`}><em>{claim.plant.scientificName}</em><Icon name="arrow" size={14} /></Link>}
      <p className="claim-text">{claim.claimText}</p>
      <div className="claim-rationale">
        <strong>{t.evidence.whyThisLevel}</strong>
        <p>{claim.rationale}</p>
      </div>
      <div className="claim-limit">
        <strong>{t.evidence.keepInMind}</strong>
        <p>{claim.limitations}</p>
      </div>
      {claim.sources.length > 0 && (
        <div className="claim-sources">
          <span className="claim-source-title"><Icon name="book" size={15} /> {t.evidence.claimSources}</span>
          <ul>
            {claim.sources.map((study) => (
              <li key={study.id}>
                <Link href={`/publications#${study.slug}`}>{study.authors} ({study.year})</Link>
                {study.doi && <a className="doi-link" href={`https://doi.org/${study.doi}`} target="_blank" rel="noreferrer">DOI <Icon name="external" size={12} /></a>}
                {!study.doi && study.pmid && <a className="doi-link" href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`} target="_blank" rel="noreferrer">PMID <Icon name="external" size={12} /></a>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
