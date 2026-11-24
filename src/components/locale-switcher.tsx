"use client";

import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Sélecteur de langue FR / FON.
 * Deux liens HTML natifs (sans prefetch Next.js) : la route /langue/[locale]
 * pose le cookie puis renvoie sur la page courante avec un rechargement complet.
 */
export function LocaleSwitcher({ locale, t }: { locale: Locale; t: Dictionary }) {
  const pathname = usePathname() || "/";
  const next = encodeURIComponent(pathname);
  const options: Array<{ value: Locale; short: string; long: string; title: string }> = [
    { value: "fr", short: t.lang.frShort, long: t.lang.fr, title: t.lang.switchToFr },
    { value: "fon", short: t.lang.fonShort, long: t.lang.fon, title: t.lang.switchToFon },
  ];

  return (
    <div className="locale-switcher" role="group" aria-label={t.lang.label}>
      {options.map((option) => (
        <a
          key={option.value}
          href={`/langue/${option.value}?next=${next}`}
          title={option.title}
          aria-label={option.long}
          aria-current={locale === option.value ? "true" : undefined}
          className={`locale-option ${locale === option.value ? "active" : ""}`}
        >
          {option.short}
        </a>
      ))}
    </div>
  );
}
