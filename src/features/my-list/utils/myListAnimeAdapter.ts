import {
  mapMediaSnapshotToAnime,
} from '../../../services/anilist/snapshot';
import type { AniListMedia } from '../../../services/anilist/types';
import type { MyListItem } from '../types';

export function mapMyListItemToAnime(item: MyListItem): AniListMedia {
  return mapMediaSnapshotToAnime(item);
}
