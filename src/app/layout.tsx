import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://herbier-ouest-africain.example"),
  title: {
    default: "Herbier ouest-africain — plantes, preuves et sources",
    template: "%s · Herbier ouest-africain",
  },
  description:
    "Base documentaire de pharmacopée végétale ouest-africaine : plantes, usages rapportés, études scientifiques, niveaux de preuve et limites, avec références DOI et PubMed.",
  applicationName: "Herbier ouest-africain",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Herbier ouest-africain",
    title: "Herbier ouest-africain — plantes, preuves et sources",
    description: "Une documentation scientifique sourcée, sans prescription ni diagnostic.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <SiteHeader />
        <div id="contenu">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
