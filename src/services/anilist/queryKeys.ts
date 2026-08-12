import type { AnimeSearchVariables, AniListSeason } from './types';

export const anilistQueryKeys = {
  all: ['anilist'] as const,
  catalogues: () => [...anilistQueryKeys.all, 'catalogues'] as const,
  trending: (page: number, perPage: number) =>
    [...anilistQueryKeys.catalogues(), 'trending', { page, perPage }] as const,
  popular: (page: number, perPage: number) =>
    [...anilistQueryKeys.catalogues(), 'popular', { page, perPage }] as const,
  currentSeason: (
    page: number,
    perPage: number,
    season: AniListSeason,
    seasonYear: number,
  ) =>
    [
      ...anilistQueryKeys.catalogues(),
      'current-season',
      { page, perPage, season, seasonYear },
    ] as const,
  details: (id: number) => [...anilistQueryKeys.all, 'details', id] as const,
  recommendations: (id: number, perPage: number) =>
    [...anilistQueryKeys.all, 'recommendations', { id, perPage }] as const,
  search: (variables: AnimeSearchVariables) =>
    [...anilistQueryKeys.all, 'search', variables] as const,
};
