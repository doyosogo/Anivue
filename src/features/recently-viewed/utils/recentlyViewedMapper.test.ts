import { describe, expect, it } from 'vitest';

import { createAniListDetailsFixture } from '../../../services/anilist/test-fixtures';
import { mapAnimeToRecentlyViewedItem } from './recentlyViewedMapper';

describe('mapAnimeToRecentlyViewedItem', () => {
  it('maps details data to a compact history snapshot', () => {
    const details = createAniListDetailsFixture().Media;

    expect(details).not.toBeNull();
    if (details === null) {
      return;
    }

    expect(
      mapAnimeToRecentlyViewedItem(details, '2026-08-05T00:00:00.000Z'),
    ).toMatchObject({
      id: details.id,
      title: details.title,
      coverImage: details.coverImage,
      bannerImage: details.bannerImage,
      averageScore: details.averageScore,
      episodes: details.episodes,
      status: details.status,
      format: details.format,
      viewedAt: '2026-08-05T00:00:00.000Z',
    });
  });
});
