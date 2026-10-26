import Link from "next/link";
import { Icon } from "@/components/icon";
import { SearchForm } from "@/components/search-form";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavLinks } from "@/components/nav-links";
import type { Dictionary, Locale } from "@/lib/i18n";

export function SiteHeader({ t, locale }: { t: Dictionary; locale: Locale }) {
  const navigation = [
    { href: "/plantes", label: t.nav.plantes },
    { href: "/pathologies", label: t.nav.pathologies },
    { href: "/mecanismes", label: t.nav.mecanismes },
    { href: "/cibles", label: t.nav.cibles },
    { href: "/solutions", label: t.nav.solutions },
    { href: "/composes", label: t.nav.composes },
    { href: "/publications", label: t.nav.publications },
    { href: "/veille", label: t.nav.veille },
  ];

  return (
    <header className="site-header">
      <div className="header-main wrap">
        <Link href="/" className="brand" aria-label={t.meta.brandAria}>
          <span className="brand-mark"><Icon name="leaf" size={23} /></span>
          <span className="brand-copy"><strong>{t.meta.brandLine1}</strong><span>{t.meta.brandLine2}</span></span>
        </Link>
        <NavLinks items={navigation} className="desktop-nav" ariaLabel={t.nav.mainAria} />
        <div className="header-search"><SearchForm compact placeholder={t.nav.searchPlaceholder} /></div>
        <LocaleSwitcher locale={locale} t={t} />
        <Link className="header-method" href="/preuves/methodologie" aria-label={t.home.method}>
          <span>{t.nav.methode}</span><Icon name="arrow" size={15} />
        </Link>
      </div>
      <NavLinks items={navigation} className="mobile-nav wrap" ariaLabel={t.nav.mobileAria} />
    </header>
  );
}
