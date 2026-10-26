import Link from "next/link";
import type { EvidenceLevel } from "@/db/schema";

const evidenceMeta: Record<EvidenceLevel, { label: string; explanation: string; className: string }> = {
  HIGH: { label: "Preuve élevée", explanation: "Niveau réservé à des données humaines robustes, répliquées et évaluées; non attribué dans ce corpus de démonstration.", className: "evidence-high" },
  MODERATE: { label: "Preuve modérée", explanation: "Niveau réservé à des données humaines convergentes mais encore limitées; non attribué dans ce corpus de démonstration.", className: "evidence-moderate" },
  PRECLINICAL: { label: "Préclinique", explanation: "Résultat provenant d’essais in vitro, ex vivo ou de modèles animaux; il ne démontre pas un bénéfice clinique.", className: "evidence-preclinical" },
  ETHNOBOTANICAL: { label: "Donnée ethnobotanique", explanation: "Usage rapporté dans une source; ce constat ne prouve pas l’efficacité ni la sécurité.", className: "evidence-ethnobotanical" },
  INSUFFICIENT: { label: "Données insuffisantes", explanation: "Les sources recensées ne permettent pas de tirer une conclusion sur cette affirmation.", className: "evidence-insufficient" },
  RISK_SIGNAL: { label: "Signal de risque", explanation: "Un signal de prudence est rapporté indépendamment de l’activité étudiée; il doit être interprété dans son contexte.", className: "evidence-risk" },
};

export function EvidenceBadge({ level, compact = false }: { level: EvidenceLevel; compact?: boolean }) {
  const meta = evidenceMeta[level];
  return (
    <Link
      href={`/preuves/methodologie#${level.toLowerCase().replaceAll("_", "-")}`}
      className={`evidence-badge ${meta.className} ${compact ? "evidence-badge-compact" : ""}`}
      aria-label={`${meta.label}. ${meta.explanation} Ouvrir la méthodologie.`}
      title={meta.explanation}
    >
      <span className="evidence-dot" aria-hidden="true" />
      <span>{meta.label}</span>
      <span className="evidence-help" aria-hidden="true">i</span>
    </Link>
  );
}

export function ReviewStatus({ label = "À valider par un expert" }: { label?: string }) {
  return <span className="review-status"><span aria-hidden="true">↗</span> {label}</span>;
}
