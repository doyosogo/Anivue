import { X } from 'lucide-react';
import type { MouseEvent } from 'react';

type RemoveFromHistoryButtonProps = {
  animeTitle: string;
  onRemove: () => void;
};

export function RemoveFromHistoryButton({
  animeTitle,
  onRemove,
}: RemoveFromHistoryButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onRemove();
  }

  return (
    <button
      aria-label={`Remove ${animeTitle} from viewing history`}
      className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-background/80 text-foreground backdrop-blur transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={handleClick}
      type="button"
    >
      <X aria-hidden="true" size={16} />
    </button>
  );
}
