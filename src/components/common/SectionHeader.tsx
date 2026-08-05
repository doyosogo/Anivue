import type { ReactNode } from 'react';

type SectionHeaderProps = {
  action?: ReactNode;
  id?: string;
  subtitle?: string;
  title: string;
  viewAll?: {
    href: string;
    label?: string;
  };
};

export function SectionHeader({
  action,
  id,
  subtitle,
  title,
  viewAll,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-foreground" id={id}>
          {title}
        </h2>
        {subtitle !== undefined ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action !== undefined || viewAll !== undefined ? (
        <div className="flex shrink-0 items-center gap-3">
          {action}
          {viewAll !== undefined ? (
            <a
              className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={viewAll.href}
            >
              {viewAll.label ?? 'View All'}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
