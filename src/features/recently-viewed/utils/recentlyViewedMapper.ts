import { mapAnimeToMediaSnapshot } from '../../../services/anilist/snapshot';
import type { AniListMedia } from '../../../services/anilist/types';
import type { RecentlyViewedItem } from '../types';

export function mapAnimeToRecentlyViewedItem(
  anime: AniListMedia,
  viewedAt = new Date().toISOString(),
): RecentlyViewedItem {
  return {
    ...mapAnimeToMediaSnapshot(anime),
    viewedAt,
  };
}
