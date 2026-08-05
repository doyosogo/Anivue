import { requestAniListAnimeDetails, requestAniListPage } from './client';
import {
  ANIME_DETAILS_QUERY,
  CURRENT_SEASON_ANIME_QUERY,
  POPULAR_ANIME_QUERY,
  TRENDING_ANIME_QUERY,
} from './queries';
import type {
  AnimeDetailsVariables,
  AnimeCatalogueVariables,
  AniListAnimeDetailsResponse,
  AniListPageResponse,
  CurrentSeasonAnimeVariables,
} from './types';

type RequestOptions = {
  signal?: AbortSignal;
};

export function fetchTrendingAnime(
  variables: AnimeCatalogueVariables,
  options: RequestOptions = {},
): Promise<AniListPageResponse> {
  return requestAniListPage({
    query: TRENDING_ANIME_QUERY,
    variables,
    signal: options.signal,
  });
}

export function fetchPopularAnime(
  variables: AnimeCatalogueVariables,
  options: RequestOptions = {},
): Promise<AniListPageResponse> {
  return requestAniListPage({
    query: POPULAR_ANIME_QUERY,
    variables,
    signal: options.signal,
  });
}

export function fetchCurrentSeasonAnime(
  variables: CurrentSeasonAnimeVariables,
  options: RequestOptions = {},
): Promise<AniListPageResponse> {
  return requestAniListPage({
    query: CURRENT_SEASON_ANIME_QUERY,
    variables,
    signal: options.signal,
  });
}

export function fetchAnimeDetails(
  variables: AnimeDetailsVariables,
  options: RequestOptions = {},
): Promise<AniListAnimeDetailsResponse> {
  return requestAniListAnimeDetails({
    query: ANIME_DETAILS_QUERY,
    variables,
    signal: options.signal,
  });
}
