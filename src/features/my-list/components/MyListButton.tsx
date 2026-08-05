import { Check, Plus } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';

import { Button } from '../../../components/common/Button';
import { getPreferredTitle } from '../../../services/anilist/media';
import type { AniListMedia } from '../../../services/anilist/types';
import { useMyListStore } from '../store/useMyListStore';
import { MyListFeedback } from './MyListFeedback';

type MyListButtonProps = {
  anime: AniListMedia;
  className?: string;
  compact?: boolean;
};

export function MyListButton({
  anime,
  className = '',
  compact = false,
}: MyListButtonProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const isInMyList = useMyListStore((state) => state.isInMyList(anime.id));
  const toggleMyList = useMyListStore((state) => state.toggleMyList);
  const title = getPreferredTitle(anime.title);

  useEffect(() => {
    if (feedbackMessage === null) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 1800);

    return () => window.clearTimeout(timerId);
  }, [feedbackMessage]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleMyList(anime);
    setFeedbackMessage(
      isInMyList ? `${title} removed from My List` : `${title} added to My List`,
    );
  }

  return (
    <>
      <Button
        aria-label={
          isInMyList ? `Remove ${title} from My List` : `Add ${title} to My List`
        }
        className={`${compact ? 'h-9 w-9 px-0 py-0' : ''} ${className}`}
        onClick={handleClick}
        variant="secondary"
      >
        {isInMyList ? (
          <Check aria-hidden="true" size={17} />
        ) : (
          <Plus aria-hidden="true" size={17} />
        )}
        {compact ? (
          <span className="sr-only">My List</span>
        ) : isInMyList ? (
          'In My List'
        ) : (
          'My List'
        )}
      </Button>
      <MyListFeedback message={feedbackMessage} />
    </>
  );
}
