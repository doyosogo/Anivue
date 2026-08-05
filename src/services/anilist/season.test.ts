import { describe, expect, it } from 'vitest';

import { getAniListSeasonYear } from './season';

describe('getAniListSeasonYear', () => {
  it('returns winter for January', () => {
    expect(getAniListSeasonYear(new Date(2026, 0, 15))).toEqual({
      season: 'WINTER',
      seasonYear: 2026,
    });
  });

  it('returns spring for March', () => {
    expect(getAniListSeasonYear(new Date(2026, 2, 1))).toEqual({
      season: 'SPRING',
      seasonYear: 2026,
    });
  });

  it('returns summer for June', () => {
    expect(getAniListSeasonYear(new Date(2026, 5, 1))).toEqual({
      season: 'SUMMER',
      seasonYear: 2026,
    });
  });

  it('returns fall for September', () => {
    expect(getAniListSeasonYear(new Date(2026, 8, 1))).toEqual({
      season: 'FALL',
      seasonYear: 2026,
    });
  });

  it('returns next-year winter for December', () => {
    expect(getAniListSeasonYear(new Date(2026, 11, 1))).toEqual({
      season: 'WINTER',
      seasonYear: 2027,
    });
  });
});
