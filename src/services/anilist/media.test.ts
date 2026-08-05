import { describe, expect, it } from 'vitest';

import { getPreferredTitle } from './media';
import type { AniListMediaTitle } from './types';

function title(overrides: Partial<AniListMediaTitle>): AniListMediaTitle {
  return {
    english: null,
    romaji: null,
    native: null,
    ...overrides,
  };
}

describe('getPreferredTitle', () => {
  it('prefers the English title first', () => {
    expect(
      getPreferredTitle(
        title({
          english: 'English Title',
          romaji: 'Romaji Title',
          native: 'Native Title',
        }),
      ),
    ).toBe('English Title');
  });

  it('falls back to romaji when English is absent', () => {
    expect(
      getPreferredTitle(
        title({
          romaji: 'Romaji Title',
          native: 'Native Title',
        }),
      ),
    ).toBe('Romaji Title');
  });

  it('falls back to native when English and romaji are absent', () => {
    expect(getPreferredTitle(title({ native: 'Native Title' }))).toBe(
      'Native Title',
    );
  });

  it('returns a safe fallback when every title is absent', () => {
    expect(getPreferredTitle(title({}))).toBe('Untitled anime');
  });
});
