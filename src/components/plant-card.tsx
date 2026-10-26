import Link from "next/link";
import type { PlantListItem } from "@/lib/catalog";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";

/** Noms fon saisis dans les noms usuels (`language: "fon"`). */
export function fonNames(commonNames: Array<{ language: string; name: string; region?: string }>) {
  const normalized = (value: string) => value.trim().toLowerCase();
  return commonNames.filter((record) => ["fon", "fɔngbè", "fongbe"].includes(normalized(record.language)));
}

export function PlantCard({ plant, t, index }: { plant: PlantListItem; t: Dictionary; index?: number }) {
  const indexLabel = index === undefined ? null : String(index + 1).padStart(2, "0");
  const fon = fonNames(plant.commonNames);
  return (
    <Link className="plant-card" href={`/plantes/${plant.slug}`}>
      <div className="plant-card-top">
        <span className="family-tag">{plant.family}</span>
        {indexLabel && <span className="plant-card-index">{indexLabel}</span>}
      </div>
      <div className="plant-illustration" aria-hidden="true">
        <Icon name="plant" size={54} />
        <span className="plant-illustration-ring" />
      </div>
      <div className="plant-card-content">
        <h3><em>{plant.scientificName}</em>{plant.botanicalAuthor && <span className="botanical-author"> {plant.botanicalAuthor}</span>}</h3>
        {fon.length > 0 && (
          <p className="plant-card-fon"><span className="fon-badge">{t.lang.fonShort}</span> {fon.map((record) => record.name).join(" · ")}</p>
        )}
        <p>{plant.summary}</p>
      </div>
      <div className="plant-card-meta">
        <span>{plant.partsUsed.length ? plant.partsUsed[0] : t.plants.notDocumented}</span>
        <span className="plant-card-sources"><Icon name="book" size={15} /> {plant.sourceCount} {plant.sourceCount === 1 ? t.plants.publicationOne : t.plants.publicationMany}</span>
      </div>
      <span className="plant-card-arrow" aria-hidden="true"><Icon name="arrow" size={17} /></span>
    </Link>
  );
}
