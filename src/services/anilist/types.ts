export type AniListMediaType = 'ANIME';
export type AniListMediaSort =
  | 'SEARCH_MATCH'
  | 'TRENDING_DESC'
  | 'POPULARITY_DESC'
  | 'SCORE_DESC'
  | 'START_DATE_DESC'
  | 'TITLE_ROMAJI';
export type AniListSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
export type AniListMediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC';
export type AniListMediaStatus =
  | 'FINISHED'
  | 'RELEASING'
  | 'NOT_YET_RELEASED'
  | 'CANCELLED'
  | 'HIATUS';

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

export type AniListMediaTag = {
  id: number;
  name: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
};

export type AniListCharacterName = {
  full: string | null;
};

export type AniListCharacterImage = {
  large: string | null;
  medium: string | null;
};

export type AniListCharacter = {
  id: number;
  name: AniListCharacterName;
  image: AniListCharacterImage;
};

export type AniListCharacterEdge = {
  role: string | null;
  node: AniListCharacter;
};

export type AniListCharacterConnection = {
  edges: AniListCharacterEdge[];
};

export type AniListStaffName = {
  full: string | null;
};

export type AniListStaffImage = {
  large: string | null;
  medium: string | null;
};

export type AniListStaff = {
  id: number;
  name: AniListStaffName;
  image: AniListStaffImage;
};

export type AniListStaffEdge = {
  role: string | null;
  node: AniListStaff;
};

export type AniListStaffConnection = {
  edges: AniListStaffEdge[];
};

export type AniListRelationEdge = {
  relationType: string | null;
  node: AniListMedia;
};

export type AniListRelationConnection = {
  edges: AniListRelationEdge[];
};

export type AniListRecommendation = {
  id: number;
  rating: number;
  mediaRecommendation: AniListMedia | null;
};

export type AniListRecommendationConnection = {
  nodes: AniListRecommendation[];
};

export type AniListAnimeDetails = AniListMedia & {
  source: string | null;
  tags: AniListMediaTag[];
  characters: AniListCharacterConnection;
  staff: AniListStaffConnection;
  relations: AniListRelationConnection;
  recommendations: AniListRecommendationConnection;
};

export type AniListAnimeDetailsResponse = {
  Media: AniListAnimeDetails | null;
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

export type AnimeDetailsVariables = {
  id: number;
};

export type AnimeSearchVariables = {
  search?: string;
  page: number;
  perPage: number;
  genre?: string;
  format?: AniListMediaFormat;
  status?: AniListMediaStatus;
  season?: AniListSeason;
  seasonYear?: number;
  sort: AniListMediaSort;
};
