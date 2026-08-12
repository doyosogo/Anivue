import type { AniListMediaSnapshot } from '../../services/anilist/snapshot';

export type MyListItem = AniListMediaSnapshot & {
  dateAdded: string;
};

export type MyListPersistedState = {
  items: Record<number, MyListItem>;
};
