import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  memo,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useRef,
} from 'react';

type HorizontalCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  showControls?: boolean;
};

export const HorizontalCarousel = memo(function HorizontalCarousel({
  ariaLabel,
  children,
  showControls = true,
}: HorizontalCarouselProps) {
  const carouselId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByPage = useCallback((direction: 'left' | 'right') => {
    const element = scrollRef.current;
    if (element === null) {
      return;
    }

    const distance = element.clientWidth * 0.82;
    element.scrollBy({
      behavior: 'smooth',
      left: direction === 'left' ? -distance : distance,
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByPage('left');
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByPage('right');
      }
    },
    [scrollByPage],
  );

  return (
    <div className="relative" id={carouselId}>
      {showControls ? (
        <div className="absolute -top-14 right-0 hidden gap-2 sm:flex">
          <button
            aria-controls={carouselId}
            aria-label={`Scroll ${ariaLabel} left`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => scrollByPage('left')}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            aria-controls={carouselId}
            aria-label={`Scroll ${ariaLabel} right`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => scrollByPage('right')}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      ) : null}

      <div
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={handleKeyDown}
        ref={scrollRef}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
});
