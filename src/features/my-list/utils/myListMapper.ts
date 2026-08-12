import type { AniListMedia } from '../../../services/anilist/types';
import { mapAnimeToMediaSnapshot } from '../../../services/anilist/snapshot';
import type { MyListItem } from '../types';

export function mapAnimeToMyListItem(
  anime: AniListMedia,
  dateAdded = new Date().toISOString(),
): MyListItem {
  return {
    ...mapAnimeToMediaSnapshot(anime),
    dateAdded,
  };
}
