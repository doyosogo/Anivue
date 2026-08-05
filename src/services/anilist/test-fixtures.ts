import type {
  AniListAnimeDetails,
  AniListAnimeDetailsResponse,
  AniListMedia,
  AniListPageResponse,
} from './types';

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

export function createAniListDetailsFixture(
  overrides: Partial<AniListAnimeDetails> = {},
): AniListAnimeDetailsResponse {
  const baseMedia = createAniListMediaFixture();

  return {
    Media: {
      ...baseMedia,
      description:
        'A <strong>brilliant</strong> adventure begins.<br>Its world expands across many mysteries.<br>Every choice has a cost.',
      source: 'MANGA',
      tags: [
        {
          id: 10,
          name: 'Alchemy',
          rank: 92,
          isGeneralSpoiler: false,
          isMediaSpoiler: false,
        },
      ],
      characters: {
        edges: [
          {
            role: 'MAIN',
            node: {
              id: 100,
              name: { full: 'Edward Elric' },
              image: {
                large: 'https://example.com/edward-large.jpg',
                medium: 'https://example.com/edward-medium.jpg',
              },
            },
          },
        ],
      },
      staff: {
        edges: [
          {
            role: 'Director',
            node: {
              id: 200,
              name: { full: 'Yasuhiro Irie' },
              image: {
                large: 'https://example.com/staff-large.jpg',
                medium: 'https://example.com/staff-medium.jpg',
              },
            },
          },
        ],
      },
      relations: {
        edges: [
          {
            relationType: 'SEQUEL',
            node: createAniListMediaFixture({
              id: 2,
              title: {
                english: 'Related Anime',
                romaji: null,
                native: null,
              },
            }),
          },
        ],
      },
      recommendations: {
        nodes: [
          {
            id: 300,
            rating: 98,
            mediaRecommendation: createAniListMediaFixture({
              id: 3,
              title: {
                english: 'Recommended Anime',
                romaji: null,
                native: null,
              },
            }),
          },
        ],
      },
      ...overrides,
    },
  };
}
