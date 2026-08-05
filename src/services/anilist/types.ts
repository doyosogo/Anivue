export type AniListMediaType = 'ANIME';
export type AniListMediaSort = 'TRENDING_DESC' | 'POPULARITY_DESC';
export type AniListSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export type GraphQLVariables = Record<string, unknown>;

export type GraphQLErrorLocation = {
  line: number;
  column: number;
};

export type GraphQLError = {
  message: string;
  status?: number;
  locations?: GraphQLErrorLocation[];
};

export type GraphQLResponseEnvelope<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

export type AniListMediaTitle = {
  english: string | null;
  romaji: string | null;
  native: string | null;
};

export type AniListCoverImage = {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
};

export type AniListTrailer = {
  id: string | null;
  site: string | null;
  thumbnail: string | null;
};

export type AniListStudio = {
  id: number;
  name: string;
  isAnimationStudio: boolean;
};

export type AniListStudioConnection = {
  nodes: AniListStudio[];
};

export type AniListNextAiringEpisode = {
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
};

export type AniListMedia = {
  id: number;
  idMal: number | null;
  title: AniListMediaTitle;
  description: string | null;
  format: string | null;
  status: string | null;
  season: AniListSeason | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  popularity: number | null;
  trending: number | null;
  favourites: number | null;
  isAdult: boolean;
  siteUrl: string | null;
  bannerImage: string | null;
  coverImage: AniListCoverImage;
  trailer: AniListTrailer | null;
  studios: AniListStudioConnection;
  nextAiringEpisode: AniListNextAiringEpisode | null;
};

export type AniListPageInfo = {
  total: number | null;
  currentPage: number;
  lastPage: number | null;
  hasNextPage: boolean;
  perPage: number;
};

export type PaginatedMediaResult = {
  pageInfo: AniListPageInfo;
  media: AniListMedia[];
};

export type AniListPageResponse = {
  Page: PaginatedMediaResult;
};

export type AnimeCatalogueVariables = {
  page: number;
  perPage: number;
};

export type CurrentSeasonAnimeVariables = AnimeCatalogueVariables & {
  season: AniListSeason;
  seasonYear: number;
};
