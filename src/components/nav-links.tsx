"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

/**
 * Navigation avec état actif. Composant client minimal : seuls les libellés
 * et les chemins sont envoyés au navigateur, pas le dictionnaire complet.
 */
export function NavLinks({
  items,
  className,
  ariaLabel,
}: {
  items: NavItem[];
  className: string;
  ariaLabel: string;
}) {
  const pathname = usePathname() ?? "/";
  return (
    <nav className={className} aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
