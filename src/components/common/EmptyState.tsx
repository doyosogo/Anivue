import type { ReactNode } from 'react';

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  title: string;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        {description}
      </p>
      {action !== undefined ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
