import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { mapAnimeToMyListItem } from '../utils/myListMapper';
import type { AniListMedia } from '../../../services/anilist/types';
import type { MyListItem, MyListPersistedState } from '../types';

export const MY_LIST_STORAGE_KEY = 'anivue-my-list';
export const MY_LIST_PERSIST_VERSION = 1;

type MyListState = MyListPersistedState & {
  addToMyList: (anime: AniListMedia) => void;
  clearMyList: () => void;
  getItems: () => MyListItem[];
  isInMyList: (id: number) => boolean;
  removeFromMyList: (id: number) => void;
  toggleMyList: (anime: AniListMedia) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidStoredItem(value: unknown): value is MyListItem {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    isRecord(value.title) &&
    typeof value.dateAdded === 'string'
  );
}

function sanitizePersistedItems(value: unknown): Record<number, MyListItem> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.values(value).reduce<Record<number, MyListItem>>((items, item) => {
    if (isValidStoredItem(item)) {
      items[item.id] = item;
    }

    return items;
  }, {});
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
      return undefined;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      return undefined;
    }
  },
};

export const useMyListStore = create<MyListState>()(
  persist<MyListState, [], [], MyListPersistedState>(
    (set, get) => ({
      items: {},
      addToMyList: (anime) =>
        set((state) => {
          const existingItem = state.items[anime.id];
          const dateAdded = existingItem?.dateAdded;

          return {
            items: {
              ...state.items,
              [anime.id]: mapAnimeToMyListItem(anime, dateAdded),
            },
          };
        }),
      clearMyList: () => set({ items: {} }),
      getItems: () =>
        Object.values(get().items).sort(
          (first, second) =>
            new Date(second.dateAdded).getTime() -
            new Date(first.dateAdded).getTime(),
        ),
      isInMyList: (id) => get().items[id] !== undefined,
      removeFromMyList: (id) =>
        set((state) => {
          const remainingItems = { ...state.items };
          delete remainingItems[id];
          return { items: remainingItems };
        }),
      toggleMyList: (anime) => {
        if (get().isInMyList(anime.id)) {
          get().removeFromMyList(anime.id);
          return;
        }

        get().addToMyList(anime);
      },
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
      name: MY_LIST_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => safeLocalStorage),
      version: MY_LIST_PERSIST_VERSION,
    },
  ),
);

export function resetMyListStoreForTest() {
  useMyListStore.setState({ items: {} });
}
