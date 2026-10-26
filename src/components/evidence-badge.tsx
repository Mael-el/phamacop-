import Link from "next/link";
import type { EvidenceLevel } from "@/db/schema";
import type { Dictionary } from "@/lib/i18n";

export function evidenceMeta(t: Dictionary): Record<EvidenceLevel, { label: string; explanation: string; className: string }> {
  return {
    HIGH: { label: t.evidence.high, explanation: t.evidence.highText, className: "evidence-high" },
    MODERATE: { label: t.evidence.moderate, explanation: t.evidence.moderateText, className: "evidence-moderate" },
    PRECLINICAL: { label: t.evidence.preclinical, explanation: t.evidence.preclinicalText, className: "evidence-preclinical" },
    ETHNOBOTANICAL: { label: t.evidence.ethnobotanical, explanation: t.evidence.ethnobotanicalText, className: "evidence-ethnobotanical" },
    INSUFFICIENT: { label: t.evidence.insufficient, explanation: t.evidence.insufficientText, className: "evidence-insufficient" },
    RISK_SIGNAL: { label: t.evidence.risk, explanation: t.evidence.riskText, className: "evidence-risk" },
  };
}

export function EvidenceBadge({ level, t, compact = false }: { level: EvidenceLevel; t: Dictionary; compact?: boolean }) {
  const meta = evidenceMeta(t)[level];
  return (
    <Link
      href={`/preuves/methodologie#${level.toLowerCase().replaceAll("_", "-")}`}
      className={`evidence-badge ${meta.className} ${compact ? "evidence-badge-compact" : ""}`}
      aria-label={`${meta.label}. ${meta.explanation} ${t.evidence.openMethod}.`}
      title={meta.explanation}
    >
      <span className="evidence-dot" aria-hidden="true" />
      <span>{meta.label}</span>
      <span className="evidence-help" aria-hidden="true">i</span>
    </Link>
  );
}

export function ReviewStatus({ label }: { label: string }) {
  return <span className="review-status"><span aria-hidden="true">↗</span> {label}</span>;
}
