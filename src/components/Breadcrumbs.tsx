import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 font-medium hover:text-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="px-1 py-0.5 font-medium text-zinc-800" aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRightIcon width={14} height={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}