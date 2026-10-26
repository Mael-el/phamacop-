import Link from "next/link";
import { Icon } from "@/components/icon";
import { getDictionary } from "@/lib/i18n";

export async function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  const { t } = await getDictionary();
  return (
    <nav className="breadcrumbs" aria-label={t.nav.breadcrumbAria}>
      <Link href="/" aria-label={t.nav.home}>{t.nav.home}</Link>
      {items.map((item, index) => (
        <span className="breadcrumb-item" key={`${item.label}-${index}`}>
          <Icon name="chevron" size={14} />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
