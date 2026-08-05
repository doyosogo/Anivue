import type { AniListMediaTitle } from './types';

export function getPreferredTitle(title: AniListMediaTitle): string {
  return (
    title.english?.trim() ||
    title.romaji?.trim() ||
    title.native?.trim() ||
    'Untitled anime'
  );
}
