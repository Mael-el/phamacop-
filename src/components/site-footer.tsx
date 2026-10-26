import Link from "next/link";
import { Icon } from "@/components/icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand-block">
          <Link href="/" className="brand brand-footer">
            <span className="brand-mark"><Icon name="leaf" size={21} /></span>
            <span className="brand-copy"><strong>HERBIER</strong><span>OUEST-AFRICAIN</span></span>
          </Link>
          <p>Une base documentaire pour explorer les plantes, les travaux scientifiques et les savoirs rapportés — sans prescrire.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explorer</span><Link href="/plantes">Plantes</Link><Link href="/pathologies">Pathologies</Link><Link href="/publications">Publications</Link><Link href="/veille">Veille bibliographique</Link></div>
          <div><span className="footer-label">Transparence</span><Link href="/preuves/methodologie">Méthodologie des preuves</Link><Link href="/comprendre">Comprendre les études</Link><Link href="/mentions-legales">Mentions & précautions</Link></div>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© {new Date().getFullYear()} · Documentation scientifique ouverte</span>
        <span className="footer-disclaimer"><Icon name="shield" size={15} /> Information générale, pas un conseil médical.</span>
      </div>
    </footer>
  );
}
