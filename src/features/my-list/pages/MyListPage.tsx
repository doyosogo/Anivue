import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { Modal } from '../../../components/common/Modal';
import { getPreferredTitle } from '../../../services/anilist/media';
import { useMyListStore } from '../store/useMyListStore';
import type { MyListItem } from '../types';
import { mapMyListItemToAnime } from '../utils/myListAnimeAdapter';

type MyListSort = 'recent' | 'title' | 'score';

function sortItems(items: MyListItem[], sort: MyListSort): MyListItem[] {
  const sortedItems = [...items];

  if (sort === 'title') {
    return sortedItems.sort((first, second) =>
      getPreferredTitle(first.title).localeCompare(getPreferredTitle(second.title)),
    );
  }

  if (sort === 'score') {
    return sortedItems.sort(
      (first, second) => (second.averageScore ?? -1) - (first.averageScore ?? -1),
    );
  }

  return sortedItems.sort(
    (first, second) =>
      new Date(second.dateAdded).getTime() - new Date(first.dateAdded).getTime(),
  );
}

function EmptyMyListState() {
  return (
    <EmptyState
      action={
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/search"
          >
            Browse anime
          </Link>
          <Link
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            to="/search?q="
          >
            Search anime
          </Link>
        </div>
      }
      description="Save anime from the homepage, search results, or details pages. Your list stays in this browser."
      title="Your list is empty."
    />
  );
}

export function MyListPage() {
  const [sort, setSort] = useState<MyListSort>('recent');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const itemRecord = useMyListStore((state) => state.items);
  const clearMyList = useMyListStore((state) => state.clearMyList);
  const items = useMemo(() => Object.values(itemRecord), [itemRecord]);
  const sortedItems = useMemo(() => sortItems(items, sort), [items, sort]);

  return (
    <section aria-labelledby="my-list-title" className="w-full space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-medium uppercase text-accent">
            Personal Library
          </p>
          <h1 className="text-4xl font-semibold text-foreground" id="my-list-title">
            My List
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {items.length} saved {items.length === 1 ? 'title' : 'titles'}.
            Stored only in this browser; clearing browser data removes it.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-muted" htmlFor="my-list-sort">
              Sort
            </label>
            <select
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/40"
              id="my-list-sort"
              onChange={(event) => setSort(event.target.value as MyListSort)}
              value={sort}
            >
              <option value="recent">Recently added</option>
              <option value="title">Title A-Z</option>
              <option value="score">Highest score</option>
            </select>
            <Button
              aria-label="Clear My List"
              onClick={() => setIsClearModalOpen(true)}
              variant="secondary"
            >
              <Trash2 aria-hidden="true" size={16} />
              Clear
            </Button>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? <EmptyMyListState /> : null}

      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sortedItems.map((item) => (
            <AnimeCard anime={mapMyListItemToAnime(item)} key={item.id} />
          ))}
        </div>
      ) : null}

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear My List?"
      >
        <p className="text-sm leading-6 text-muted">
          This removes every saved title from this browser. It does not affect
          AniList or any account because Anivue is not using accounts yet.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button onClick={() => setIsClearModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button
            aria-label="Confirm clear My List"
            onClick={() => {
              clearMyList();
              setIsClearModalOpen(false);
            }}
          >
            Clear My List
          </Button>
        </div>
      </Modal>
    </section>
  );
}
