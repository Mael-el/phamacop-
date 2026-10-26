import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.understand.title, description: t.understand.description };
}

export default async function UnderstandPage() {
  const { t } = await getDictionary();
  const glossary = [
    { term: t.understand.terms.traditional, text: t.understand.terms.traditionalText },
    { term: t.understand.terms.inVitro, text: t.understand.terms.inVitroText },
    { term: t.understand.terms.inVivo, text: t.understand.terms.inVivoText },
    { term: t.understand.terms.exVivo, text: t.understand.terms.exVivoText },
    { term: t.understand.terms.clinical, text: t.understand.terms.clinicalText },
    { term: t.understand.terms.doi, text: t.understand.terms.doiText },
    { term: t.understand.terms.pmid, text: t.understand.terms.pmidText },
    { term: t.understand.terms.limit, text: t.understand.terms.limitText },
  ];

  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: t.understand.title }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">{t.understand.kicker}</p><h1>{t.understand.heading}</h1><p className="lead">{t.understand.lead}</p></div>
          <aside className="page-hero-aside"><strong>{t.understand.asideTitle}</strong>{t.understand.asideBody}</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="glossary-list">{glossary.map((item) => <article key={item.term} className="glossary-card"><h2>{item.term}</h2><p>{item.text}</p></article>)}</div>
        <div className="understand-callout"><Icon name="shield" size={22} /><div><strong>{t.understand.calloutTitle}</strong><p>{t.understand.calloutBody}</p></div></div>
        <Link className="text-link" href="/preuves/methodologie">{t.understand.seeMethod} <Icon name="arrow" size={15} /></Link>
      </div></section>
    </main>
  );
}
