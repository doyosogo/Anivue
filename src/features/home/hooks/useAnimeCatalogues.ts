import { useQuery } from '@tanstack/react-query';

import {
  fetchCurrentSeasonAnime,
  fetchPopularAnime,
  fetchTrendingAnime,
} from '../../../services/anilist/api';
import { anilistQueryKeys } from '../../../services/anilist/queryKeys';
import { getAniListSeasonYear } from '../../../services/anilist/season';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

type CataloguePagination = {
  page?: number;
  perPage?: number;
};

export function useTrendingAnime({
  page = DEFAULT_PAGE,
  perPage = DEFAULT_PER_PAGE,
}: CataloguePagination = {}) {
  return useQuery({
    queryKey: anilistQueryKeys.trending(page, perPage),
    queryFn: ({ signal }) => fetchTrendingAnime({ page, perPage }, { signal }),
  });
}

export function usePopularAnime({
  page = DEFAULT_PAGE,
  perPage = DEFAULT_PER_PAGE,
}: CataloguePagination = {}) {
  return useQuery({
    queryKey: anilistQueryKeys.popular(page, perPage),
    queryFn: ({ signal }) => fetchPopularAnime({ page, perPage }, { signal }),
  });
}

export function useCurrentSeasonAnime({
  page = DEFAULT_PAGE,
  perPage = DEFAULT_PER_PAGE,
}: CataloguePagination = {}) {
  const { season, seasonYear } = getAniListSeasonYear();

  return useQuery({
    queryKey: anilistQueryKeys.currentSeason(
      page,
      perPage,
      season,
      seasonYear,
    ),
    queryFn: ({ signal }) =>
      fetchCurrentSeasonAnime(
        { page, perPage, season, seasonYear },
        { signal },
      ),
  });
}
