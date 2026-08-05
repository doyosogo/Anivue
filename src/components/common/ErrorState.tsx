import { RefreshCw } from 'lucide-react';

type ErrorStateProps = {
  description: string;
  onRetry: () => void;
  title: string;
};

export function ErrorState({ description, onRetry, title }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        {description}
      </p>
      <button
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onRetry}
        type="button"
      >
        <RefreshCw aria-hidden="true" size={16} />
        Retry
      </button>
    </div>
  );
}
