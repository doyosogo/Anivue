import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { isValidMediaSnapshot } from '../../../services/anilist/snapshot';
import type { AniListMedia } from '../../../services/anilist/types';
import { mapAnimeToRecentlyViewedItem } from '../utils/recentlyViewedMapper';
import type {
  RecentlyViewedItem,
  RecentlyViewedPersistedState,
} from '../types';

export const RECENTLY_VIEWED_STORAGE_KEY = 'anivue-recently-viewed';
export const RECENTLY_VIEWED_PERSIST_VERSION = 1;
export const RECENTLY_VIEWED_MAX_ITEMS = 30;

type RecentlyViewedState = RecentlyViewedPersistedState & {
  clearRecentlyViewed: () => void;
  getRecentlyViewed: () => RecentlyViewedItem[];
  hasHydrated: boolean;
  hasRecentlyViewed: () => boolean;
  recordViewedAnime: (anime: AniListMedia) => void;
  removeViewedAnime: (id: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidRecentlyViewedItem(value: unknown): value is RecentlyViewedItem {
  if (!isRecord(value)) {
    return false;
  }

  const record = value;
  const viewedAt = record.viewedAt;

  if (!isValidMediaSnapshot(record)) {
    return false;
  }

  return (
    typeof viewedAt === 'string' &&
    !Number.isNaN(Date.parse(viewedAt))
  );
}

function sanitizePersistedItems(value: unknown): Record<number, RecentlyViewedItem> {
  if (!isRecord(value)) {
    return {};
  }

  const items = Object.values(value)
    .filter(isValidRecentlyViewedItem)
    .sort(
      (first, second) =>
        new Date(second.viewedAt).getTime() - new Date(first.viewedAt).getTime(),
    )
    .slice(0, RECENTLY_VIEWED_MAX_ITEMS);

  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function limitItems(
  items: Record<number, RecentlyViewedItem>,
): Record<number, RecentlyViewedItem> {
  const sortedItems = Object.values(items)
    .sort(
      (first, second) =>
        new Date(second.viewedAt).getTime() - new Date(first.viewedAt).getTime(),
    )
    .slice(0, RECENTLY_VIEWED_MAX_ITEMS);

  return Object.fromEntries(sortedItems.map((item) => [item.id, item]));
}

const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      const value = window.localStorage.getItem(name);
      if (value === null) {
        return null;
      }

      JSON.parse(value);
      return value;
    } catch {
      return null;
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Browser storage may be blocked. The in-memory store still works.
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Browser storage may be blocked. The in-memory store still works.
    }
  },
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist<RecentlyViewedState, [], [], RecentlyViewedPersistedState>(
    (set, get) => ({
      hasHydrated: false,
      items: {},
      clearRecentlyViewed: () => set({ items: {} }),
      getRecentlyViewed: () =>
        Object.values(get().items).sort(
          (first, second) =>
            new Date(second.viewedAt).getTime() -
            new Date(first.viewedAt).getTime(),
        ),
      hasRecentlyViewed: () => Object.keys(get().items).length > 0,
      recordViewedAnime: (anime) =>
        set((state) => {
          const viewedAt = new Date().toISOString();
          const existingItem = state.items[anime.id];

          if (
            existingItem !== undefined &&
            new Date(viewedAt).getTime() -
              new Date(existingItem.viewedAt).getTime() <
              1000
          ) {
            return state;
          }

          const viewedItem = mapAnimeToRecentlyViewedItem(anime, viewedAt);
          return {
            items: limitItems({
              ...state.items,
              [anime.id]: viewedItem,
            }),
          };
        }),
      removeViewedAnime: (id) =>
        set((state) => {
          const remainingItems = { ...state.items };
          delete remainingItems[id];
          return { items: remainingItems };
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      migrate: (persistedState) => {
        if (!isRecord(persistedState)) {
          return { items: {} };
        }

        return {
          items: sanitizePersistedItems(persistedState.items),
        };
      },
      name: RECENTLY_VIEWED_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => safeLocalStorage),
      version: RECENTLY_VIEWED_PERSIST_VERSION,
    },
  ),
);

export function resetRecentlyViewedStoreForTest() {
  useRecentlyViewedStore.setState({ hasHydrated: true, items: {} });
}
