import type { AniListMedia } from '../../../services/anilist/types';
import type { MyListItem } from '../types';

export function mapAnimeToMyListItem(
  anime: AniListMedia,
  dateAdded = new Date().toISOString(),
): MyListItem {
  return {
    id: anime.id,
    title: {
      english: anime.title.english,
      romaji: anime.title.romaji,
      native: anime.title.native,
    },
    coverImage: {
      extraLarge: anime.coverImage.extraLarge,
      large: anime.coverImage.large,
      medium: anime.coverImage.medium,
      color: anime.coverImage.color,
    },
    bannerImage: anime.bannerImage,
    averageScore: anime.averageScore,
    episodes: anime.episodes,
    status: anime.status,
    format: anime.format,
    season: anime.season,
    seasonYear: anime.seasonYear,
    genres: [...anime.genres],
    trailer:
      anime.trailer === null
        ? null
        : {
            id: anime.trailer.id,
            site: anime.trailer.site,
            thumbnail: anime.trailer.thumbnail,
          },
    dateAdded,
  };
}
