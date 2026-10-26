import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Bascule de langue sans JavaScript :
 *   GET /langue/fon?next=/plantes  →  cookie + redirection vers /plantes
 * Le paramètre `next` est restreint aux chemins internes (pas d’URL absolue).
 */
export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const url = new URL(request.url);
  const requested = url.searchParams.get("next") ?? "/";
  const target = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const value = isLocale(locale) ? locale : DEFAULT_LOCALE;
  // Redirection relative : conserve l’hôte public (proxy de prévisualisation).
  return new Response(null, {
    status: 307,
    headers: {
      location: target,
      "set-cookie": `${LOCALE_COOKIE}=${value}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`,
      "cache-control": "no-store",
    },
  });
}
