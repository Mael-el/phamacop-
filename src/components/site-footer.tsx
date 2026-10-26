import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ t }: { t: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand-block">
          <Link href="/" className="brand brand-footer">
            <span className="brand-mark"><Icon name="leaf" size={21} /></span>
            <span className="brand-copy"><strong>{t.meta.brandLine1}</strong><span>{t.meta.brandLine2}</span></span>
          </Link>
          <p>{t.footer.about}</p>
          <p className="footer-africa-note">{t.footer.africaNote}</p>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">{t.footer.explore}</span>
            <Link href="/plantes">{t.nav.plantes}</Link>
            <Link href="/pathologies">{t.nav.pathologies}</Link>
            <Link href="/solutions">{t.footer.solutions}</Link>
            <Link href="/publications">{t.nav.publications}</Link>
            <Link href="/veille">{t.footer.veille}</Link>
          </div>
          <div>
            <span className="footer-label">{t.footer.transparency}</span>
            <Link href="/preuves/methodologie">{t.footer.methodology}</Link>
            <Link href="/comprendre">{t.footer.understand}</Link>
            <Link href="/mentions-legales">{t.footer.legal}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© {new Date().getFullYear()} · {t.footer.copyright}</span>
        <span className="footer-disclaimer"><Icon name="shield" size={15} /> {t.footer.disclaimer}</span>
      </div>
    </footer>
  );
}
