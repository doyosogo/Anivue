import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { Modal } from '../../../components/common/Modal';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { getPreferredTitle } from '../../../services/anilist/media';
import { RemoveFromHistoryButton } from '../components/RemoveFromHistoryButton';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { mapRecentlyViewedItemToAnime } from '../utils/recentlyViewedAnimeAdapter';
import type { RecentlyViewedItem } from '../types';

type HistorySort = 'recent' | 'title' | 'score';

function sortHistoryItems(
  items: RecentlyViewedItem[],
  sort: HistorySort,
): RecentlyViewedItem[] {
  const sortedItems = [...items];

  if (sort === 'title') {
    return sortedItems.sort((first, second) =>
      getPreferredTitle(first.title).localeCompare(getPreferredTitle(second.title)),
    );
  }

  if (sort === 'score') {
    return sortedItems.sort(
      (first, second) =>
        (second.averageScore ?? -1) - (first.averageScore ?? -1),
    );
  }

  return sortedItems.sort(
    (first, second) =>
      new Date(second.viewedAt).getTime() - new Date(first.viewedAt).getTime(),
  );
}

export function ViewingHistoryPage() {
  const itemRecord = useRecentlyViewedStore((state) => state.items);
  const hasHydrated = useRecentlyViewedStore((state) => state.hasHydrated);
  const clearRecentlyViewed = useRecentlyViewedStore(
    (state) => state.clearRecentlyViewed,
  );
  const removeViewedAnime = useRecentlyViewedStore(
    (state) => state.removeViewedAnime,
  );
  const [sort, setSort] = useState<HistorySort>('recent');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const items = useMemo(() => Object.values(itemRecord), [itemRecord]);
  const sortedItems = useMemo(() => sortHistoryItems(items, sort), [items, sort]);

  function handleClearHistory() {
    clearRecentlyViewed();
    setIsClearModalOpen(false);
  }

  if (!hasHydrated) {
    return (
      <div
        aria-label="Loading viewing history"
        className="min-h-72 rounded-lg border border-border bg-surface"
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              to="/search"
            >
              Browse anime
            </Link>
            <Link
              className="rounded-md border border-white/15 bg-background/45 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              to="/search?q="
            >
              Search anime
            </Link>
          </div>
        }
        description="Opening an anime details page adds it here. This is not episode watch progress."
        title="No recently viewed titles."
      />
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <section aria-labelledby="viewing-history-title" className="space-y-5">
        <SectionHeader
          id="viewing-history-title"
          subtitle="Stored only in this browser. Opening an anime details page adds it here; this is not episode progress."
          title="Viewing History"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
          <p aria-live="polite" className="text-sm text-muted">
            {items.length === 1 ? '1 recently viewed title' : `${items.length} recently viewed titles`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-foreground" htmlFor="history-sort">
              Sort
            </label>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              id="history-sort"
              onChange={(event) => setSort(event.target.value as HistorySort)}
              value={sort}
            >
              <option value="recent">Recently viewed</option>
              <option value="title">Title A-Z</option>
              <option value="score">Highest score</option>
            </select>
            <Button
              aria-label="Clear viewing history"
              onClick={() => setIsClearModalOpen(true)}
              variant="secondary"
            >
              Clear History
            </Button>
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-muted">
          Recently Viewed remains in local browser storage. No viewing history is
          sent to an Anivue account or backend, and clearing browser storage
          removes it.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {sortedItems.map((item) => {
            const anime = mapRecentlyViewedItemToAnime(item);
            const title = getPreferredTitle(item.title);

            return (
              <AnimeCard anime={anime} key={item.id}>
                <RemoveFromHistoryButton
                  animeTitle={title}
                  onRemove={() => removeViewedAnime(item.id)}
                />
              </AnimeCard>
            );
          })}
        </div>
      </section>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Viewing History"
      >
        <div className="space-y-5">
          <p className="text-sm leading-6 text-muted">
            This removes all recently viewed titles from this browser. It does
            not affect My List and does not represent episode progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button aria-label="Confirm clear viewing history" onClick={handleClearHistory}>
              Clear History
            </Button>
            <Button onClick={() => setIsClearModalOpen(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
