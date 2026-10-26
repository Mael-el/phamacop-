import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";
import type { PreparationRecord, TargetRecord } from "@/lib/catalog";

export type PathwayData = {
  targets?: TargetRecord[];
  preparations?: PreparationRecord[];
};

/**
 * Chaîne « cible biologique → préparation testée » d’une affirmation.
 * N’affiche que ce qui est documenté : les étapes absentes restent explicitement vides.
 */
export function ClaimPathway({ claim, t }: { claim: PathwayData; t: Dictionary }) {
  const targets = claim.targets ?? [];
  const preparations = claim.preparations ?? [];
  if (targets.length === 0 && preparations.length === 0) return null;

  return (
    <div className="claim-pathway">
      <div className="claim-pathway-block">
        <span className="claim-pathway-title">
          <Icon name="plant" size={14} /> {t.chain.targetLabel}
        </span>
        {targets.length === 0 ? (
          <p className="claim-pathway-empty">{t.chain.noneForClaim}</p>
        ) : (
          <ul className="claim-pathway-list">
            {targets.map((target) => (
              <li key={target.id}>
                <Link href={`/cibles/${target.slug}`}>{target.name}</Link>
                <span className="claim-pathway-type">{t.chain.types[target.targetType]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {preparations.length > 0 && (
        <div className="claim-pathway-block">
          <span className="claim-pathway-title">
            <Icon name="book" size={14} /> {t.chain.preparationLabel}
          </span>
          <ul className="claim-pathway-list">
            {preparations.map((preparation) => (
              <li key={preparation.id}>
                <span className="claim-pathway-name">{preparation.name}</span>
                <span className="claim-pathway-meta">
                  {t.chain.partLabel} : {preparation.partUsed} · {t.chain.solventLabel} :{" "}
                  {preparation.solvent ?? t.chain.notSpecified}
                </span>
                {preparation.concentrationTested && (
                  <span className="claim-pathway-meta">
                    {t.chain.concentrationLabel} : {preparation.concentrationTested}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
