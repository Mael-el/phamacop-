import Link from "next/link";
import { Icon } from "@/components/icon";
import { SearchForm } from "@/components/search-form";

const navigation = [
  { href: "/plantes", label: "Plantes" },
  { href: "/pathologies", label: "Pathologies" },
  { href: "/mecanismes", label: "Mécanismes" },
  { href: "/composes", label: "Composés" },
  { href: "/publications", label: "Publications" },
  { href: "/veille", label: "Veille" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-main wrap">
        <Link href="/" className="brand" aria-label="Pharmacopée végétale, accueil">
          <span className="brand-mark"><Icon name="leaf" size={23} /></span>
          <span className="brand-copy"><strong>HERBIER</strong><span>OUEST-AFRICAIN</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-search"><SearchForm compact placeholder="Rechercher…" /></div>
        <Link className="header-method" href="/preuves/methodologie" aria-label="Lire la méthode">
          <span>Méthode</span><Icon name="arrow" size={15} />
        </Link>
      </div>
      <nav className="mobile-nav wrap" aria-label="Navigation principale mobile">
        {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
