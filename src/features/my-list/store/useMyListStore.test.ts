import { afterEach, describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import {
  MY_LIST_PERSIST_VERSION,
  MY_LIST_STORAGE_KEY,
  resetMyListStoreForTest,
  useMyListStore,
} from './useMyListStore';

describe('useMyListStore', () => {
  afterEach(() => {
    resetMyListStoreForTest();
    window.localStorage.clear();
  });

  it('adds, removes, and toggles anime', () => {
    const anime = createAniListMediaFixture();

    useMyListStore.getState().addToMyList(anime);
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(true);

    useMyListStore.getState().toggleMyList(anime);
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(false);

    useMyListStore.getState().toggleMyList(anime);
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(true);

    useMyListStore.getState().removeFromMyList(anime.id);
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(false);
  });

  it('prevents duplicates and preserves dateAdded', () => {
    const anime = createAniListMediaFixture();

    useMyListStore.getState().addToMyList(anime);
    const [firstItem] = useMyListStore.getState().getItems();

    useMyListStore.getState().addToMyList({
      ...anime,
      averageScore: 80,
    });

    const items = useMyListStore.getState().getItems();
    expect(items).toHaveLength(1);
    expect(items[0].dateAdded).toBe(firstItem.dateAdded);
    expect(items[0].averageScore).toBe(80);
  });

  it('persists with a namespaced key and version', () => {
    useMyListStore.getState().addToMyList(createAniListMediaFixture());

    const persisted = window.localStorage.getItem(MY_LIST_STORAGE_KEY);
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted ?? '{}')).toMatchObject({
      version: MY_LIST_PERSIST_VERSION,
    });
  });

  it('handles malformed persisted data without crashing', async () => {
    window.localStorage.setItem(MY_LIST_STORAGE_KEY, 'not json');

    await expect(useMyListStore.persist.rehydrate()).resolves.toBeUndefined();
    expect(useMyListStore.getState().getItems()).toEqual([]);
  });
});
