import Link from "next/link";
import type { PlantListItem } from "@/lib/catalog";
import { Icon } from "@/components/icon";

export function PlantCard({ plant, index }: { plant: PlantListItem; index?: number }) {
  const indexLabel = index === undefined ? null : String(index + 1).padStart(2, "0");
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
        <p>{plant.summary}</p>
      </div>
      <div className="plant-card-meta">
        <span>{plant.partsUsed.length ? plant.partsUsed[0] : "Partie non documentée"}</span>
        <span className="plant-card-sources"><Icon name="book" size={15} /> {plant.sourceCount} {plant.sourceCount === 1 ? "source" : "sources"}</span>
      </div>
      <span className="plant-card-arrow" aria-hidden="true"><Icon name="arrow" size={17} /></span>
    </Link>
  );
}
