import type {
  AnimeSearchVariables,
  AniListMediaFormat,
  AniListMediaSort,
  AniListMediaStatus,
  AniListSeason,
} from '../../../services/anilist/types';
import {
  ANIME_FORMATS,
  ANIME_GENRES,
  ANIME_SEASONS,
  ANIME_SORTS,
  ANIME_STATUSES,
  MAX_SEARCH_YEAR,
  MIN_SEARCH_YEAR,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_PAGE_SIZE,
} from '../config/searchFilters';

export type SearchSortParam = AniListMediaSort | 'DEFAULT';

export type SearchUrlState = {
  q: string;
  genre: string | null;
  format: AniListMediaFormat | null;
  status: AniListMediaStatus | null;
  season: AniListSeason | null;
  year: number | null;
  sort: SearchSortParam;
  page: number;
};

export const DEFAULT_SEARCH_STATE: SearchUrlState = {
  q: '',
  genre: null,
  format: null,
  status: null,
  season: null,
  year: null,
  sort: 'DEFAULT',
  page: 1,
};

function getSupportedValue<TValue extends string>(
  value: string | null,
  supportedValues: readonly TValue[],
): TValue | null {
  if (value === null) {
    return null;
  }

  return supportedValues.includes(value as TValue) ? (value as TValue) : null;
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseYear(value: string | null): number | null {
  const parsed = Number(value);
  if (
    Number.isInteger(parsed) &&
    parsed >= MIN_SEARCH_YEAR &&
    parsed <= MAX_SEARCH_YEAR
  ) {
    return parsed;
  }

  return null;
}

export function parseSearchUrlState(params: URLSearchParams): SearchUrlState {
  const q = params.get('q')?.trim() ?? '';
  const genre = getSupportedValue(params.get('genre'), ANIME_GENRES);

  return {
    q,
    genre,
    format: getSupportedValue(params.get('format'), ANIME_FORMATS),
    status: getSupportedValue(params.get('status'), ANIME_STATUSES),
    season: getSupportedValue(params.get('season'), ANIME_SEASONS),
    year: parseYear(params.get('year')),
    sort:
      getSupportedValue(params.get('sort'), ANIME_SORTS) ??
      DEFAULT_SEARCH_STATE.sort,
    page: parsePage(params.get('page')),
  };
}

export function hasActiveSearchFilters(state: SearchUrlState): boolean {
  return (
    state.genre !== null ||
    state.format !== null ||
    state.status !== null ||
    state.season !== null ||
    state.year !== null ||
    state.sort !== 'DEFAULT'
  );
}

export function canRunSearch(state: SearchUrlState): boolean {
  const hasValidText = state.q.trim().length >= SEARCH_MIN_QUERY_LENGTH;
  return hasValidText || hasActiveSearchFilters(state);
}

export function isQueryTooShort(state: SearchUrlState): boolean {
  return (
    state.q.trim().length > 0 &&
    state.q.trim().length < SEARCH_MIN_QUERY_LENGTH &&
    !hasActiveSearchFilters(state)
  );
}

export function toAnimeSearchVariables(
  state: SearchUrlState,
): AnimeSearchVariables {
  const trimmedQuery = state.q.trim();
  const hasText = trimmedQuery.length >= SEARCH_MIN_QUERY_LENGTH;

  return {
    ...(hasText ? { search: trimmedQuery } : {}),
    page: state.page,
    perPage: SEARCH_PAGE_SIZE,
    ...(state.genre !== null ? { genre: state.genre } : {}),
    ...(state.format !== null ? { format: state.format } : {}),
    ...(state.status !== null ? { status: state.status } : {}),
    ...(state.season !== null ? { season: state.season } : {}),
    ...(state.year !== null ? { seasonYear: state.year } : {}),
    sort: state.sort === 'DEFAULT'
      ? hasText
        ? 'SEARCH_MATCH'
        : 'POPULARITY_DESC'
      : state.sort,
  };
}

export function createSearchParamsFromState(state: SearchUrlState): URLSearchParams {
  const params = new URLSearchParams();
  const trimmedQuery = state.q.trim();

  if (trimmedQuery.length > 0) {
    params.set('q', trimmedQuery);
  }
  if (state.genre !== null) {
    params.set('genre', state.genre);
  }
  if (state.format !== null) {
    params.set('format', state.format);
  }
  if (state.status !== null) {
    params.set('status', state.status);
  }
  if (state.season !== null) {
    params.set('season', state.season);
  }
  if (state.year !== null) {
    params.set('year', String(state.year));
  }
  if (state.sort !== 'DEFAULT') {
    params.set('sort', state.sort);
  }
  if (state.page > 1) {
    params.set('page', String(state.page));
  }

  return params;
}

export function createSearchPath(state: SearchUrlState): string {
  const params = createSearchParamsFromState(state);
  const queryString = params.toString();
  return queryString.length > 0 ? `/search?${queryString}` : '/search';
}

export function updateSearchState(
  state: SearchUrlState,
  updates: Partial<SearchUrlState>,
): SearchUrlState {
  return {
    ...state,
    ...updates,
    page: updates.page ?? 1,
  };
}
