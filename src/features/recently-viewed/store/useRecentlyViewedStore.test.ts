import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import {
  RECENTLY_VIEWED_MAX_ITEMS,
  RECENTLY_VIEWED_PERSIST_VERSION,
  RECENTLY_VIEWED_STORAGE_KEY,
  resetRecentlyViewedStoreForTest,
  useRecentlyViewedStore,
} from './useRecentlyViewedStore';

describe('useRecentlyViewedStore', () => {
  afterEach(() => {
    vi.useRealTimers();
    resetRecentlyViewedStoreForTest();
    window.localStorage.clear();
  });

  it('records, removes, and clears recently viewed anime', () => {
    const anime = createAniListMediaFixture();

    useRecentlyViewedStore.getState().recordViewedAnime(anime);
    expect(useRecentlyViewedStore.getState().hasRecentlyViewed()).toBe(true);
    expect(useRecentlyViewedStore.getState().getRecentlyViewed()[0].id).toBe(
      anime.id,
    );

    useRecentlyViewedStore.getState().removeViewedAnime(anime.id);
    expect(useRecentlyViewedStore.getState().hasRecentlyViewed()).toBe(false);

    useRecentlyViewedStore.getState().recordViewedAnime(anime);
    useRecentlyViewedStore.getState().clearRecentlyViewed();
    expect(useRecentlyViewedStore.getState().getRecentlyViewed()).toEqual([]);
  });

  it('prevents duplicates and re-viewing later moves the item to the front', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const firstAnime = createAniListMediaFixture({ id: 1 });
    const secondAnime = createAniListMediaFixture({
      id: 2,
      title: { english: 'Second Anime', romaji: null, native: null },
    });

    useRecentlyViewedStore.getState().recordViewedAnime(firstAnime);
    vi.setSystemTime(new Date('2026-01-01T00:00:02.000Z'));
    useRecentlyViewedStore.getState().recordViewedAnime(secondAnime);
    vi.setSystemTime(new Date('2026-01-01T00:00:04.000Z'));
    useRecentlyViewedStore.getState().recordViewedAnime(firstAnime);

    const items = useRecentlyViewedStore.getState().getRecentlyViewed();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe(firstAnime.id);
    expect(items[0].viewedAt).toBe('2026-01-01T00:00:04.000Z');
  });

  it('enforces the maximum history size', () => {
    vi.useFakeTimers();

    for (let index = 0; index < RECENTLY_VIEWED_MAX_ITEMS + 5; index += 1) {
      vi.setSystemTime(new Date(`2026-01-01T00:00:${String(index).padStart(2, '0')}.000Z`));
      useRecentlyViewedStore.getState().recordViewedAnime(
        createAniListMediaFixture({
          id: index + 1,
          title: { english: `Anime ${index + 1}`, romaji: null, native: null },
        }),
      );
    }

    const items = useRecentlyViewedStore.getState().getRecentlyViewed();
    expect(items).toHaveLength(RECENTLY_VIEWED_MAX_ITEMS);
    expect(items.at(-1)?.id).toBe(6);
  });

  it('persists with a namespaced key and version', () => {
    useRecentlyViewedStore
      .getState()
      .recordViewedAnime(createAniListMediaFixture());

    const persisted = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted ?? '{}')).toMatchObject({
      version: RECENTLY_VIEWED_PERSIST_VERSION,
    });
  });

  it('handles malformed persisted history without crashing', async () => {
    window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, 'not json');

    await expect(
      useRecentlyViewedStore.persist.rehydrate(),
    ).resolves.toBeUndefined();
    expect(useRecentlyViewedStore.getState().getRecentlyViewed()).toEqual([]);
  });
});
