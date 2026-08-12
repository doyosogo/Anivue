import {
  requestAniListAnimeDetails,
  requestAniListAnimeRecommendations,
  requestAniListPage,
} from './client';
import {
  ANIME_DETAILS_QUERY,
  ANIME_RECOMMENDATIONS_QUERY,
  CURRENT_SEASON_ANIME_QUERY,
  POPULAR_ANIME_QUERY,
  SEARCH_ANIME_QUERY,
  TRENDING_ANIME_QUERY,
} from './queries';
import type {
  AnimeDetailsVariables,
  AnimeRecommendationsVariables,
  AnimeCatalogueVariables,
  AnimeSearchVariables,
  AniListAnimeDetailsResponse,
  AniListAnimeRecommendationsResponse,
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

export function fetchAnimeSearch(
  variables: AnimeSearchVariables,
  options: RequestOptions = {},
): Promise<AniListPageResponse> {
  return requestAniListPage({
    query: SEARCH_ANIME_QUERY,
    variables,
    signal: options.signal,
  });
}

export function fetchAnimeRecommendations(
  variables: AnimeRecommendationsVariables,
  options: RequestOptions = {},
): Promise<AniListAnimeRecommendationsResponse> {
  return requestAniListAnimeRecommendations({
    query: ANIME_RECOMMENDATIONS_QUERY,
    variables,
    signal: options.signal,
  });
}
