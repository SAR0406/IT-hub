import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-400">
        <li className="text-slate-400">~/it-hub-11</li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded px-0.5 py-0.5 transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="px-0.5 py-0.5 font-semibold text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}