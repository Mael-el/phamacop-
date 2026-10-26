import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary, htmlLang } from "@/lib/i18n";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://herbier-ouest-africain.example"),
    title: { default: t.meta.defaultTitle, template: `%s · ${t.meta.siteName}` },
    description: t.meta.defaultDescription,
    applicationName: t.meta.siteName,
    openGraph: {
      type: "website",
      locale: locale === "fon" ? "fr_BJ" : "fr_FR",
      siteName: t.meta.siteName,
      title: t.meta.defaultTitle,
      description: t.meta.defaultDescription,
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, t } = await getDictionary();
  return (
    <html lang={htmlLang(locale)}>
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <SiteHeader t={t} locale={locale} />
        {locale === "fon" && <div className="lang-banner wrap">{t.lang.workingNote}</div>}
        <div id="contenu">{children}</div>
        <SiteFooter t={t} />
      </body>
    </html>
  );
}
