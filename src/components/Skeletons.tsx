export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-white p-5">
      <div className="mb-3 h-4 w-1/3 rounded bg-slate-200" />
      <div className="mb-6 h-3 w-2/3 rounded bg-slate-100" />
      <div className="flex gap-3">
        <div className="h-9 w-24 rounded-lg bg-slate-200" />
        <div className="h-9 w-24 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function UnitCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-white p-6">
      <div className="mb-3 h-5 w-1/2 rounded bg-slate-200" />
      <div className="mb-4 h-3 w-3/4 rounded bg-slate-100" />
      <div className="h-3 w-1/4 rounded bg-slate-100" />
    </div>
  );
}

export function ResourceListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading resources">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}