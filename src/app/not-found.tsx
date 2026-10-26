import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-inner">
        <span className="not-found-code">404 · FICHE INTROUVABLE</span>
        <h1>Cette page n’est pas dans l’herbier.</h1>
        <p>La référence a peut-être changé ou ne fait pas partie du corpus documenté pour le moment.</p>
        <Link className="button button-primary" href="/plantes">Explorer les plantes <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
