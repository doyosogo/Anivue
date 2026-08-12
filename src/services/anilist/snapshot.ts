import type {
  AniListCoverImage,
  AniListMedia,
  AniListMediaFormat,
  AniListMediaStatus,
  AniListMediaTitle,
  AniListSeason,
  AniListTrailer,
} from './types';

export type AniListMediaSnapshot = {
  id: number;
  title: AniListMediaTitle;
  coverImage: AniListCoverImage;
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  status: AniListMediaStatus | string | null;
  format: AniListMediaFormat | string | null;
  season: AniListSeason | null;
  seasonYear: number | null;
  genres: string[];
  trailer: AniListTrailer | null;
};

export function mapAnimeToMediaSnapshot(anime: AniListMedia): AniListMediaSnapshot {
  return {
    id: anime.id,
    title: {
      english: anime.title.english,
      romaji: anime.title.romaji,
      native: anime.title.native,
    },
    coverImage: {
      extraLarge: anime.coverImage.extraLarge,
      large: anime.coverImage.large,
      medium: anime.coverImage.medium,
      color: anime.coverImage.color,
    },
    bannerImage: anime.bannerImage,
    averageScore: anime.averageScore,
    episodes: anime.episodes,
    status: anime.status,
    format: anime.format,
    season: anime.season,
    seasonYear: anime.seasonYear,
    genres: [...anime.genres],
    trailer:
      anime.trailer === null
        ? null
        : {
            id: anime.trailer.id,
            site: anime.trailer.site,
            thumbnail: anime.trailer.thumbnail,
          },
  };
}

export function mapMediaSnapshotToAnime(snapshot: AniListMediaSnapshot): AniListMedia {
  return {
    id: snapshot.id,
    idMal: null,
    title: snapshot.title,
    description: null,
    format: snapshot.format,
    status: snapshot.status,
    season: snapshot.season,
    seasonYear: snapshot.seasonYear,
    episodes: snapshot.episodes,
    duration: null,
    genres: snapshot.genres,
    averageScore: snapshot.averageScore,
    popularity: null,
    trending: null,
    favourites: null,
    isAdult: false,
    siteUrl: null,
    bannerImage: snapshot.bannerImage,
    coverImage: snapshot.coverImage,
    trailer: snapshot.trailer,
    studios: {
      nodes: [],
    },
    nextAiringEpisode: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function isValidSeason(value: unknown): value is AniListSeason | null {
  return (
    value === null ||
    value === 'WINTER' ||
    value === 'SPRING' ||
    value === 'SUMMER' ||
    value === 'FALL'
  );
}

function isValidTitle(value: unknown): value is AniListMediaTitle {
  return (
    isRecord(value) &&
    isNullableString(value.english) &&
    isNullableString(value.romaji) &&
    isNullableString(value.native)
  );
}

function isValidCoverImage(value: unknown): value is AniListCoverImage {
  return (
    isRecord(value) &&
    isNullableString(value.extraLarge) &&
    isNullableString(value.large) &&
    isNullableString(value.medium) &&
    isNullableString(value.color)
  );
}

function isValidTrailer(value: unknown): value is AniListTrailer | null {
  return (
    value === null ||
    (isRecord(value) &&
      isNullableString(value.id) &&
      isNullableString(value.site) &&
      isNullableString(value.thumbnail))
  );
}

export function isValidMediaSnapshot(
  value: unknown,
): value is AniListMediaSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    isValidTitle(value.title) &&
    isValidCoverImage(value.coverImage) &&
    isNullableString(value.bannerImage) &&
    isNullableNumber(value.averageScore) &&
    isNullableNumber(value.episodes) &&
    isNullableString(value.status) &&
    isNullableString(value.format) &&
    isValidSeason(value.season) &&
    isNullableNumber(value.seasonYear) &&
    Array.isArray(value.genres) &&
    value.genres.every((genre) => typeof genre === 'string') &&
    isValidTrailer(value.trailer)
  );
}
