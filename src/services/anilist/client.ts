import {
  AniListGraphQLError,
  AniListHttpError,
  AniListNetworkError,
  AniListParseError,
  AniListRateLimitError,
  type AniListRateLimitInfo,
} from './errors';
import type {
  AniListCoverImage,
  AniListAnimeDetails,
  AniListAnimeDetailsResponse,
  AniListAnimeRecommendationsResponse,
  AniListCharacter,
  AniListCharacterConnection,
  AniListCharacterEdge,
  AniListCharacterImage,
  AniListCharacterName,
  AniListMedia,
  AniListMediaTitle,
  AniListMediaTag,
  AniListNextAiringEpisode,
  AniListPageInfo,
  AniListPageResponse,
  AniListRecommendation,
  AniListRecommendationConnection,
  AniListRelationConnection,
  AniListRelationEdge,
  AniListSeason,
  AniListStaff,
  AniListStaffConnection,
  AniListStaffEdge,
  AniListStaffImage,
  AniListStaffName,
  AniListStudio,
  AniListStudioConnection,
  AniListTrailer,
  GraphQLError,
  GraphQLResponseEnvelope,
  GraphQLVariables,
  PaginatedMediaResult,
} from './types';

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

type AniListRequestOptions<TVariables extends GraphQLVariables> = {
  query: string;
  variables: TVariables;
  signal?: AbortSignal;
};

type AniListRequestParser<TData> = (data: unknown) => TData;

function readNumericHeader(headers: Headers, name: string): number | null {
  const value = headers.get(name);
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRateLimitInfo(headers: Headers): AniListRateLimitInfo {
  return {
    retryAfter: readNumericHeader(headers, 'Retry-After'),
    limit: readNumericHeader(headers, 'X-RateLimit-Limit'),
    remaining: readNumericHeader(headers, 'X-RateLimit-Remaining'),
    reset: readNumericHeader(headers, 'X-RateLimit-Reset'),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isNumber(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function parseGraphQLErrors(value: unknown): GraphQLError[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const errors: GraphQLError[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isString(item.message)) {
      return null;
    }

    errors.push({
      message: item.message,
      status: isNumber(item.status) ? item.status : undefined,
    });
  }

  return errors;
}

function parseResponseEnvelope(
  value: unknown,
): GraphQLResponseEnvelope<unknown> {
  if (!isRecord(value)) {
    throw new AniListParseError();
  }

  const errors =
    'errors' in value && value.errors !== undefined
      ? parseGraphQLErrors(value.errors)
      : undefined;

  if (errors === null) {
    throw new AniListParseError();
  }

  return {
    data: value.data,
    errors,
  };
}

function parseMediaTitle(value: unknown): AniListMediaTitle {
  if (!isRecord(value)) {
    throw new AniListParseError();
  }

  if (
    !isNullableString(value.english) ||
    !isNullableString(value.romaji) ||
    !isNullableString(value.native)
  ) {
    throw new AniListParseError();
  }

  return {
    english: value.english,
    romaji: value.romaji,
    native: value.native,
  };
}

function parseCoverImage(value: unknown): AniListCoverImage {
  if (!isRecord(value)) {
    throw new AniListParseError();
  }

  if (
    !isNullableString(value.extraLarge) ||
    !isNullableString(value.large) ||
    !isNullableString(value.medium) ||
    !isNullableString(value.color)
  ) {
    throw new AniListParseError();
  }

  return {
    extraLarge: value.extraLarge,
    large: value.large,
    medium: value.medium,
    color: value.color,
  };
}

function parseTrailer(value: unknown): AniListTrailer | null {
  if (value === null) {
    return null;
  }

  if (!isRecord(value)) {
    throw new AniListParseError();
  }

  if (
    !isNullableString(value.id) ||
    !isNullableString(value.site) ||
    !isNullableString(value.thumbnail)
  ) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    site: value.site,
    thumbnail: value.thumbnail,
  };
}

function parseStudio(value: unknown): AniListStudio {
  if (
    !isRecord(value) ||
    !isNumber(value.id) ||
    !isString(value.name) ||
    !isBoolean(value.isAnimationStudio)
  ) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    name: value.name,
    isAnimationStudio: value.isAnimationStudio,
  };
}

function parseStudioConnection(value: unknown): AniListStudioConnection {
  if (!isRecord(value) || !Array.isArray(value.nodes)) {
    throw new AniListParseError();
  }

  return {
    nodes: value.nodes.map(parseStudio),
  };
}

function parseNextAiringEpisode(value: unknown): AniListNextAiringEpisode | null {
  if (value === null) {
    return null;
  }

  if (
    !isRecord(value) ||
    !isNumber(value.episode) ||
    !isNumber(value.airingAt) ||
    !isNumber(value.timeUntilAiring)
  ) {
    throw new AniListParseError();
  }

  return {
    episode: value.episode,
    airingAt: value.airingAt,
    timeUntilAiring: value.timeUntilAiring,
  };
}

function parseSeason(value: unknown): AniListSeason | null {
  if (value === null) {
    return null;
  }

  if (
    value === 'WINTER' ||
    value === 'SPRING' ||
    value === 'SUMMER' ||
    value === 'FALL'
  ) {
    return value;
  }

  throw new AniListParseError();
}

function parseMedia(value: unknown): AniListMedia {
  if (!isRecord(value)) {
    throw new AniListParseError();
  }

  if (
    !isNumber(value.id) ||
    !isNullableNumber(value.idMal) ||
    !isNullableString(value.description) ||
    !isNullableString(value.format) ||
    !isNullableString(value.status) ||
    !isNullableNumber(value.seasonYear) ||
    !isNullableNumber(value.episodes) ||
    !isNullableNumber(value.duration) ||
    !Array.isArray(value.genres) ||
    !value.genres.every(isString) ||
    !isNullableNumber(value.averageScore) ||
    !isNullableNumber(value.popularity) ||
    !isNullableNumber(value.trending) ||
    !isNullableNumber(value.favourites) ||
    !isBoolean(value.isAdult) ||
    !isNullableString(value.siteUrl) ||
    !isNullableString(value.bannerImage)
  ) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    idMal: value.idMal,
    title: parseMediaTitle(value.title),
    description: value.description,
    format: value.format,
    status: value.status,
    season: parseSeason(value.season),
    seasonYear: value.seasonYear,
    episodes: value.episodes,
    duration: value.duration,
    genres: value.genres,
    averageScore: value.averageScore,
    popularity: value.popularity,
    trending: value.trending,
    favourites: value.favourites,
    isAdult: value.isAdult,
    siteUrl: value.siteUrl,
    bannerImage: value.bannerImage,
    coverImage: parseCoverImage(value.coverImage),
    trailer: parseTrailer(value.trailer),
    studios: parseStudioConnection(value.studios),
    nextAiringEpisode: parseNextAiringEpisode(value.nextAiringEpisode),
  };
}

function parseMediaTag(value: unknown): AniListMediaTag {
  if (
    !isRecord(value) ||
    !isNumber(value.id) ||
    !isString(value.name) ||
    !isNumber(value.rank) ||
    !isBoolean(value.isGeneralSpoiler) ||
    !isBoolean(value.isMediaSpoiler)
  ) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    name: value.name,
    rank: value.rank,
    isGeneralSpoiler: value.isGeneralSpoiler,
    isMediaSpoiler: value.isMediaSpoiler,
  };
}

function parseCharacterName(value: unknown): AniListCharacterName {
  if (!isRecord(value) || !isNullableString(value.full)) {
    throw new AniListParseError();
  }

  return { full: value.full };
}

function parseCharacterImage(value: unknown): AniListCharacterImage {
  if (
    !isRecord(value) ||
    !isNullableString(value.large) ||
    !isNullableString(value.medium)
  ) {
    throw new AniListParseError();
  }

  return { large: value.large, medium: value.medium };
}

function parseCharacter(value: unknown): AniListCharacter {
  if (!isRecord(value) || !isNumber(value.id)) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    name: parseCharacterName(value.name),
    image: parseCharacterImage(value.image),
  };
}

function parseCharacterEdge(value: unknown): AniListCharacterEdge {
  if (!isRecord(value) || !isNullableString(value.role)) {
    throw new AniListParseError();
  }

  return {
    role: value.role,
    node: parseCharacter(value.node),
  };
}

function parseCharacterConnection(value: unknown): AniListCharacterConnection {
  if (!isRecord(value) || !Array.isArray(value.edges)) {
    throw new AniListParseError();
  }

  return { edges: value.edges.map(parseCharacterEdge) };
}

function parseStaffName(value: unknown): AniListStaffName {
  if (!isRecord(value) || !isNullableString(value.full)) {
    throw new AniListParseError();
  }

  return { full: value.full };
}

function parseStaffImage(value: unknown): AniListStaffImage {
  if (
    !isRecord(value) ||
    !isNullableString(value.large) ||
    !isNullableString(value.medium)
  ) {
    throw new AniListParseError();
  }

  return { large: value.large, medium: value.medium };
}

function parseStaff(value: unknown): AniListStaff {
  if (!isRecord(value) || !isNumber(value.id)) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    name: parseStaffName(value.name),
    image: parseStaffImage(value.image),
  };
}

function parseStaffEdge(value: unknown): AniListStaffEdge {
  if (!isRecord(value) || !isNullableString(value.role)) {
    throw new AniListParseError();
  }

  return {
    role: value.role,
    node: parseStaff(value.node),
  };
}

function parseStaffConnection(value: unknown): AniListStaffConnection {
  if (!isRecord(value) || !Array.isArray(value.edges)) {
    throw new AniListParseError();
  }

  return { edges: value.edges.map(parseStaffEdge) };
}

function parseRelationEdge(value: unknown): AniListRelationEdge {
  if (!isRecord(value) || !isNullableString(value.relationType)) {
    throw new AniListParseError();
  }

  return {
    relationType: value.relationType,
    node: parseMedia(value.node),
  };
}

function parseRelationConnection(value: unknown): AniListRelationConnection {
  if (!isRecord(value) || !Array.isArray(value.edges)) {
    throw new AniListParseError();
  }

  return { edges: value.edges.map(parseRelationEdge) };
}

function parseRecommendation(value: unknown): AniListRecommendation {
  if (
    !isRecord(value) ||
    !isNumber(value.id) ||
    !isNumber(value.rating) ||
    !(value.mediaRecommendation === null || isRecord(value.mediaRecommendation))
  ) {
    throw new AniListParseError();
  }

  return {
    id: value.id,
    rating: value.rating,
    mediaRecommendation:
      value.mediaRecommendation === null
        ? null
        : parseMedia(value.mediaRecommendation),
  };
}

function parseRecommendationConnection(
  value: unknown,
): AniListRecommendationConnection {
  if (!isRecord(value) || !Array.isArray(value.nodes)) {
    throw new AniListParseError();
  }

  return { nodes: value.nodes.map(parseRecommendation) };
}

function parseAnimeDetails(value: unknown): AniListAnimeDetails {
  const media = parseMedia(value);

  if (
    !isRecord(value) ||
    !isNullableString(value.source) ||
    !Array.isArray(value.tags)
  ) {
    throw new AniListParseError();
  }

  return {
    ...media,
    source: value.source,
    tags: value.tags.map(parseMediaTag),
    characters: parseCharacterConnection(value.characters),
    staff: parseStaffConnection(value.staff),
    relations: parseRelationConnection(value.relations),
    recommendations: parseRecommendationConnection(value.recommendations),
  };
}

function parsePageInfo(value: unknown): AniListPageInfo {
  if (
    !isRecord(value) ||
    !isNullableNumber(value.total) ||
    !isNumber(value.currentPage) ||
    !isNullableNumber(value.lastPage) ||
    !isBoolean(value.hasNextPage) ||
    !isNumber(value.perPage)
  ) {
    throw new AniListParseError();
  }

  return {
    total: value.total,
    currentPage: value.currentPage,
    lastPage: value.lastPage,
    hasNextPage: value.hasNextPage,
    perPage: value.perPage,
  };
}

export function parsePaginatedMediaResult(value: unknown): PaginatedMediaResult {
  if (!isRecord(value) || !isRecord(value.Page) || !Array.isArray(value.Page.media)) {
    throw new AniListParseError();
  }

  return {
    pageInfo: parsePageInfo(value.Page.pageInfo),
    media: value.Page.media.map(parseMedia),
  };
}

export function parseAnimeDetailsResponse(
  value: unknown,
): AniListAnimeDetailsResponse {
  if (!isRecord(value) || !(value.Media === null || isRecord(value.Media))) {
    throw new AniListParseError();
  }

  return {
    Media: value.Media === null ? null : parseAnimeDetails(value.Media),
  };
}

export function parseAnimeRecommendationsResponse(
  value: unknown,
): AniListAnimeRecommendationsResponse {
  if (!isRecord(value) || !(value.Media === null || isRecord(value.Media))) {
    throw new AniListParseError();
  }

  if (value.Media === null) {
    return { Media: null };
  }

  if (!isNumber(value.Media.id)) {
    throw new AniListParseError();
  }

  return {
    Media: {
      id: value.Media.id,
      recommendations: parseRecommendationConnection(value.Media.recommendations),
    },
  };
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new AniListParseError(error);
  }
}

export async function requestAniListData<
  TData,
  TVariables extends GraphQLVariables,
>({
  query,
  variables,
  signal,
  parseData,
}: AniListRequestOptions<TVariables> & {
  parseData: AniListRequestParser<TData>;
}): Promise<TData> {
  let response: Response;

  try {
    response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      body: JSON.stringify({ query, variables }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal,
    });
  } catch (error) {
    throw new AniListNetworkError(error);
  }

  if (response.status === 429) {
    throw new AniListRateLimitError(
      response.status,
      response.statusText,
      getRateLimitInfo(response.headers),
    );
  }

  if (!response.ok) {
    throw new AniListHttpError(response.status, response.statusText);
  }

  const json = await parseJsonResponse(response);
  const envelope = parseResponseEnvelope(json);

  if (envelope.errors !== undefined && envelope.errors.length > 0) {
    throw new AniListGraphQLError(envelope.errors, response.status);
  }

  return parseData(envelope.data);
}

export function requestAniListPage<TVariables extends GraphQLVariables>(
  options: AniListRequestOptions<TVariables>,
): Promise<AniListPageResponse> {
  return requestAniListData({
    ...options,
    parseData: (data) => ({ Page: parsePaginatedMediaResult(data) }),
  });
}

export function requestAniListAnimeDetails<TVariables extends GraphQLVariables>(
  options: AniListRequestOptions<TVariables>,
): Promise<AniListAnimeDetailsResponse> {
  return requestAniListData({
    ...options,
    parseData: parseAnimeDetailsResponse,
  });
}

export function requestAniListAnimeRecommendations<
  TVariables extends GraphQLVariables,
>(
  options: AniListRequestOptions<TVariables>,
): Promise<AniListAnimeRecommendationsResponse> {
  return requestAniListData({
    ...options,
    parseData: parseAnimeRecommendationsResponse,
  });
}
