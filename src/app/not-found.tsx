import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getDictionary();
  return (
    <main className="not-found">
      <div className="not-found-inner">
        <span className="not-found-code">{t.notFound.code}</span>
        <h1>{t.notFound.title}</h1>
        <p>{t.notFound.body}</p>
        <Link className="button button-primary" href="/plantes">{t.notFound.cta} <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
