import { mapMediaSnapshotToAnime } from '../../../services/anilist/snapshot';
import type { AniListMedia } from '../../../services/anilist/types';
import type { RecentlyViewedItem } from '../types';

export function mapRecentlyViewedItemToAnime(
  item: RecentlyViewedItem,
): AniListMedia {
  return mapMediaSnapshotToAnime(item);
}
