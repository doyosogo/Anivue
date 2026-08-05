import type { AniListMedia } from '../../../services/anilist/types';
import type { MyListItem } from '../types';

export function mapMyListItemToAnime(item: MyListItem): AniListMedia {
  return {
    id: item.id,
    idMal: null,
    title: item.title,
    description: null,
    format: item.format,
    status: item.status,
    season: item.season,
    seasonYear: item.seasonYear,
    episodes: item.episodes,
    duration: null,
    genres: item.genres,
    averageScore: item.averageScore,
    popularity: null,
    trending: null,
    favourites: null,
    isAdult: false,
    siteUrl: null,
    bannerImage: item.bannerImage,
    coverImage: item.coverImage,
    trailer: item.trailer,
    studios: {
      nodes: [],
    },
    nextAiringEpisode: null,
  };
}
