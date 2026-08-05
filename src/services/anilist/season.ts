import type { AniListSeason } from './types';

export type AniListSeasonYear = {
  season: AniListSeason;
  seasonYear: number;
};

export function getAniListSeasonYear(date = new Date()): AniListSeasonYear {
  const month = date.getMonth();
  const calendarYear = date.getFullYear();

  if (month === 11) {
    return { season: 'WINTER', seasonYear: calendarYear + 1 };
  }

  if (month <= 1) {
    return { season: 'WINTER', seasonYear: calendarYear };
  }

  if (month <= 4) {
    return { season: 'SPRING', seasonYear: calendarYear };
  }

  if (month <= 7) {
    return { season: 'SUMMER', seasonYear: calendarYear };
  }

  return { season: 'FALL', seasonYear: calendarYear };
}
