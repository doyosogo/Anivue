import type { AniListMedia, AniListPageResponse } from './types';

export function createAniListMediaFixture(
  overrides: Partial<AniListMedia> = {},
): AniListMedia {
  return {
    id: 1,
    idMal: 5114,
    title: {
      english: 'Fullmetal Alchemist: Brotherhood',
      romaji: 'Hagane no Renkinjutsushi: Fullmetal Alchemist',
      native: '鋼の錬金術師 FULLMETAL ALCHEMIST',
    },
    description: 'Two brothers search for the Philosopher Stone.',
    format: 'TV',
    status: 'FINISHED',
    season: 'SPRING',
    seasonYear: 2009,
    episodes: 64,
    duration: 24,
    genres: ['Action', 'Adventure', 'Drama'],
    averageScore: 91,
    popularity: 800000,
    trending: 20,
    favourites: 30000,
    isAdult: false,
    siteUrl: 'https://anilist.co/anime/5114',
    bannerImage: 'https://example.com/banner.jpg',
    coverImage: {
      extraLarge: 'https://example.com/cover-extra-large.jpg',
      large: 'https://example.com/cover-large.jpg',
      medium: 'https://example.com/cover-medium.jpg',
      color: '#f5f5f5',
    },
    trailer: {
      id: 'abc123',
      site: 'youtube',
      thumbnail: 'https://example.com/trailer.jpg',
    },
    studios: {
      nodes: [
        {
          id: 4,
          name: 'Bones',
          isAnimationStudio: true,
        },
      ],
    },
    nextAiringEpisode: null,
    ...overrides,
  };
}

export function createAniListPageFixture(
  media: AniListMedia[] = [createAniListMediaFixture()],
): AniListPageResponse {
  return {
    Page: {
      pageInfo: {
        total: media.length,
        currentPage: 1,
        lastPage: 1,
        hasNextPage: false,
        perPage: 20,
      },
      media,
    },
  };
}
