import type { AniListMediaSnapshot } from '../../../services/anilist/snapshot';

export type RecentlyViewedItem = AniListMediaSnapshot & {
  viewedAt: string;
};

export type RecentlyViewedPersistedState = {
  items: Record<number, RecentlyViewedItem>;
};
