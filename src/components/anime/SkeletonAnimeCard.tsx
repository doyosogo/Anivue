export function SkeletonAnimeCard() {
  return (
    <article
      aria-label="Loading anime"
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/10"
    >
      <div className="aspect-[2/3] animate-pulse bg-elevated" />
      <div className="space-y-3 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
          <div className="h-6 w-9 animate-pulse rounded-full bg-elevated" />
        </div>
        <div className="h-3 w-2/3 animate-pulse rounded bg-elevated" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-elevated" />
      </div>
    </article>
  );
}
