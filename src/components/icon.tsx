import type { ReactNode } from "react";

type IconName = "leaf" | "search" | "arrow" | "external" | "book" | "flask" | "shield" | "menu" | "chevron" | "spark" | "plant" | "close";

const paths: Record<IconName, ReactNode> = {
  leaf: <><path d="M20.8 3.2c-6.4.1-11 .9-14 3.9-3.1 3.1-3.2 7.1-.8 9.4 2.3 2.3 6.4 2.2 9.4-.8 3-3 3.8-7.6 3.9-14Z" /><path d="M3.5 21c2.1-5 5.4-8.8 10.1-11.7" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
  external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16M8 7h8M8 11h8" /></>,
  flask: <><path d="M9 3h6M10 3v6l-5.4 9.1A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.9L14 9V3" /><path d="M7.8 15h8.4" /></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z" /></>,
  plant: <><path d="M12 21V11" /><path d="M12 14C6 14 3 10 3 4c6 0 9 3 9 10Z" /><path d="M12 11c0-5 3-8 9-8 0 6-3 9-9 9" /><path d="M8 21h8" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
};

export function Icon({ name, className, size = 20 }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
