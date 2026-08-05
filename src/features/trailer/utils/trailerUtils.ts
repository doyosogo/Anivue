import type { SupportedTrailer, TrailerSource } from '../types';

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function getSupportedTrailer(trailer: TrailerSource): SupportedTrailer | null {
  if (
    trailer?.id === null ||
    trailer?.id === undefined ||
    trailer.site?.toLowerCase() !== 'youtube' ||
    !YOUTUBE_ID_PATTERN.test(trailer.id)
  ) {
    return null;
  }

  return {
    id: trailer.id,
    provider: 'youtube',
    thumbnail: trailer.thumbnail,
  };
}

export function isTrailerSupported(trailer: TrailerSource): boolean {
  return getSupportedTrailer(trailer) !== null;
}

export function getTrailerEmbedUrl(trailer: SupportedTrailer): string {
  const params = new URLSearchParams({
    modestbranding: '1',
    rel: '0',
  });

  return `https://www.youtube-nocookie.com/embed/${trailer.id}?${params.toString()}`;
}

export function getTrailerThumbnail(trailer: TrailerSource): string | null {
  return getSupportedTrailer(trailer)?.thumbnail ?? null;
}
