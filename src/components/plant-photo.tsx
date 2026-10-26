import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";

export type PhotoData = {
  imageUrl: string | null;
  imageCredit: string | null;
  imageSourceUrl: string | null;
  imageNote: string | null;
};

/** Vignette carrée utilisée dans les listes (photo réelle, jamais générée). */
export function PhotoThumb({
  photo,
  alt,
  t,
  className = "",
}: {
  photo: PhotoData;
  alt: string;
  t: Dictionary;
  className?: string;
}) {
  if (!photo.imageUrl) {
    return (
      <div className={`photo-thumb photo-thumb-empty ${className}`} aria-hidden="true">
        <Icon name="plant" size={34} />
        <span>{t.plants.photoNone}</span>
      </div>
    );
  }
  return (
    <div className={`photo-thumb ${className}`}>
      <Image src={photo.imageUrl} alt={alt} width={320} height={240} sizes="(max-width: 720px) 100vw, 320px" />
    </div>
  );
}

/** Photo grand format avec légende, crédit et lien vers la source d’origine. */
export function PhotoFigure({
  photo,
  alt,
  caption,
  t,
}: {
  photo: PhotoData;
  alt: string;
  caption?: string;
  t: Dictionary;
}) {
  if (!photo.imageUrl) return null;
  return (
    <figure className="photo-figure">
      <div className="photo-figure-image">
        <Image src={photo.imageUrl} alt={alt} width={1000} height={700} sizes="(max-width: 900px) 100vw, 720px" />
      </div>
      <figcaption>
        {caption && <span className="photo-caption">{caption}</span>}
        <span className="photo-credit">
          <Icon name="book" size={13} /> {t.plants.photoCredit} : {photo.imageCredit ?? t.plants.photoCreditUnknown}
          {photo.imageSourceUrl && (
            <Link href={photo.imageSourceUrl} target="_blank" rel="noreferrer">
              {t.plants.photoSource} <Icon name="external" size={11} />
            </Link>
          )}
        </span>
        <span className="photo-note">{photo.imageNote ?? t.plants.photoCreditNote}</span>
      </figcaption>
    </figure>
  );
}
