import { describe, expect, it } from 'vitest';

import {
  createAniListDetailsFixture,
  createAniListMediaFixture,
} from '../../../services/anilist/test-fixtures';
import { mapAnimeToMyListItem } from './myListMapper';

describe('mapAnimeToMyListItem', () => {
  it('maps catalogue media into a compact saved snapshot', () => {
    const item = mapAnimeToMyListItem(
      createAniListMediaFixture(),
      '2026-08-05T00:00:00.000Z',
    );

    expect(item).toMatchObject({
      id: 1,
      averageScore: 91,
      dateAdded: '2026-08-05T00:00:00.000Z',
      episodes: 64,
      title: {
        english: 'Fullmetal Alchemist: Brotherhood',
      },
    });
  });

  it('maps details media through the same mapper', () => {
    const details = createAniListDetailsFixture().Media;

    if (details === null) {
      throw new Error('Expected details fixture media.');
    }

    expect(mapAnimeToMyListItem(details).genres).toContain('Action');
  });
});
