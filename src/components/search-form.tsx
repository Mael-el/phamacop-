import { Icon } from "@/components/icon";
import { getDictionary } from "@/lib/i18n";

export async function SearchForm({
  placeholder,
  className = "",
  defaultValue = "",
  compact = false,
  action = "/recherche",
  name = "q",
}: {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  compact?: boolean;
  /** Page qui traite la recherche (par défaut la recherche globale). */
  action?: string;
  /** Nom du paramètre d’URL. */
  name?: string;
}) {
  const { t } = await getDictionary();
  return (
    <form
      action={action}
      method="get"
      role="search"
      className={`search-form ${compact ? "search-form-compact" : ""} ${className}`}
    >
      {/*
        Le libellé est masqué visuellement, mais l’input reste un enfant direct du
        formulaire : il ne doit jamais hériter de la classe `sr-only`, qui le
        réduirait à 1 px et le rendrait impossible à utiliser.
      */}
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder ?? t.nav.searchPlaceholder}
        aria-label={t.nav.searchLabel}
        autoComplete="off"
        maxLength={120}
      />
      <button type="submit" aria-label={t.nav.searchAria}>
        <Icon name="search" size={19} />
      </button>
    </form>
  );
}
