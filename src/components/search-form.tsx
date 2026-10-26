import { Icon } from "@/components/icon";

export function SearchForm({
  placeholder = "Nom botanique, composé, mécanisme…",
  className = "",
  defaultValue = "",
  compact = false,
}: {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  compact?: boolean;
}) {
  return (
    <form action="/recherche" method="get" role="search" className={`search-form ${compact ? "search-form-compact" : ""} ${className}`}>
      <label className="sr-only">
        Rechercher dans la pharmacopée
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={120}
        />
      </label>
      <button type="submit" aria-label="Lancer la recherche">
        <Icon name="search" size={19} />
      </button>
    </form>
  );
}
