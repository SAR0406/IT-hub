import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Terminal-style path eyebrow, e.g. "~/it-hub-11/chapters". */
  path: string;
  title: string;
  description?: string;
  /** Optional mono chips / badges shown under the description. */
  meta?: ReactNode;
  /** Optional right-aligned slot (e.g. a primary action). */
  action?: ReactNode;
};

/**
 * Standard page header — one hierarchy for every content page:
 * terminal path → display title → one-line description → chips/actions.
 */
export function PageHeader({ path, title, description, meta, action }: PageHeaderProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="font-mono text-xs font-medium text-brand">{path}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-mist">{description}</p>
        )}
        {meta && <div className="mt-5 flex flex-wrap gap-2">{meta}</div>}
      </div>
      {action}
    </div>
  );
}

/** Small mono pill used under PageHeader descriptions. */
export function HeaderPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
      {children}
    </span>
  );
}