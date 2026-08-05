import { describe, expect, it } from 'vitest';

import {
  canRunSearch,
  createSearchPath,
  parseSearchUrlState,
  toAnimeSearchVariables,
  updateSearchState,
} from './searchUrlState';

describe('search URL state', () => {
  it('parses and validates supported URL parameters', () => {
    const state = parseSearchUrlState(
      new URLSearchParams(
        'q=naruto&genre=Action&format=TV&status=RELEASING&season=SPRING&year=2026&sort=POPULARITY_DESC&page=2',
      ),
    );

    expect(state).toEqual({
      q: 'naruto',
      genre: 'Action',
      format: 'TV',
      status: 'RELEASING',
      season: 'SPRING',
      year: 2026,
      sort: 'POPULARITY_DESC',
      page: 2,
    });
  });

  it('falls back safely for unsupported URL values', () => {
    const state = parseSearchUrlState(
      new URLSearchParams(
        'format=BAD&status=UNKNOWN&season=NOPE&year=1200&sort=BAD&page=-3',
      ),
    );

    expect(state.format).toBeNull();
    expect(state.status).toBeNull();
    expect(state.season).toBeNull();
    expect(state.year).toBeNull();
    expect(state.sort).toBe('DEFAULT');
    expect(state.page).toBe(1);
  });

  it('builds AniList variables with a safe default sort', () => {
    expect(
      toAnimeSearchVariables(
        parseSearchUrlState(new URLSearchParams('q=naruto&page=3')),
      ),
    ).toMatchObject({
      search: 'naruto',
      sort: 'SEARCH_MATCH',
      page: 3,
    });
  });

  it('disables a text-only search below the minimum length', () => {
    expect(canRunSearch(parseSearchUrlState(new URLSearchParams('q=n')))).toBe(
      false,
    );
  });

  it('resets page when filters change', () => {
    const state = parseSearchUrlState(
      new URLSearchParams('q=naruto&page=4&genre=Action'),
    );

    expect(createSearchPath(updateSearchState(state, { genre: 'Drama' }))).toBe(
      '/search?q=naruto&genre=Drama',
    );
  });
});
