import { Icon } from "@/components/icon";
import { getDictionary } from "@/lib/i18n";

export async function SearchForm({
  placeholder,
  className = "",
  defaultValue = "",
  compact = false,
}: {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  compact?: boolean;
}) {
  const { t } = await getDictionary();
  return (
    <form action="/recherche" method="get" role="search" className={`search-form ${compact ? "search-form-compact" : ""} ${className}`}>
      <label className="sr-only">
        {t.nav.searchLabel}
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder ?? t.nav.searchPlaceholder}
          autoComplete="off"
          maxLength={120}
        />
      </label>
      <button type="submit" aria-label={t.nav.searchAria}>
        <Icon name="search" size={19} />
      </button>
    </form>
  );
}
