import type {
  AniListMediaFormat,
  AniListMediaSort,
  AniListMediaStatus,
  AniListSeason,
} from '../../../services/anilist/types';

export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_PAGE_SIZE = 20;
export const SEARCH_DEBOUNCE_MS = 350;
export const MIN_SEARCH_YEAR = 1940;
export const MAX_SEARCH_YEAR = new Date().getFullYear() + 2;

export const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
] as const;

export const ANIME_FORMATS: AniListMediaFormat[] = [
  'TV',
  'TV_SHORT',
  'MOVIE',
  'SPECIAL',
  'OVA',
  'ONA',
  'MUSIC',
];

export const ANIME_STATUSES: AniListMediaStatus[] = [
  'FINISHED',
  'RELEASING',
  'NOT_YET_RELEASED',
  'CANCELLED',
  'HIATUS',
];

export const ANIME_SEASONS: AniListSeason[] = [
  'WINTER',
  'SPRING',
  'SUMMER',
  'FALL',
];

export const ANIME_SORTS: AniListMediaSort[] = [
  'POPULARITY_DESC',
  'TRENDING_DESC',
  'SCORE_DESC',
  'START_DATE_DESC',
  'TITLE_ROMAJI',
];

export function formatFilterLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
