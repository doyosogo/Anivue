import type { AniListMedia, AniListStudio } from '../../services/anilist/types';

export function stripAniListHtml(description: string | null): string {
  if (description === null) {
    return 'No description is available for this title yet.';
  }

  const withoutBreaks = description.replace(/<br\s*\/?>/gi, ' ');

  if (typeof DOMParser !== 'undefined') {
    const document = new DOMParser().parseFromString(withoutBreaks, 'text/html');
    return (
      document.body.textContent?.replace(/\s+/g, ' ').trim() ||
      'No description is available for this title yet.'
    );
  }

  return (
    withoutBreaks.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ||
    'No description is available for this title yet.'
  );
}

export function getSanitizedDescriptionParagraphs(
  description: string | null,
): string[] {
  if (description === null) {
    return ['No description is available for this title yet.'];
  }

  const withLineBreaks = description.replace(/<br\s*\/?>/gi, '\n');
  const sanitized =
    typeof DOMParser !== 'undefined'
      ? new DOMParser().parseFromString(withLineBreaks, 'text/html').body
          .textContent
      : withLineBreaks.replace(/<[^>]*>/g, '');

  const paragraphs = (sanitized ?? '')
    .split(/\n{1,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs.length > 0
    ? paragraphs
    : ['No description is available for this title yet.'];
}

export function getFeaturedAnime(media: AniListMedia[]): AniListMedia | null {
  if (media.length === 0) {
    return null;
  }

  return media.reduce((best, current) => {
    const bestScore = best.averageScore ?? -1;
    const currentScore = current.averageScore ?? -1;

    if (currentScore !== bestScore) {
      return currentScore > bestScore ? current : best;
    }

    return (current.popularity ?? -1) > (best.popularity ?? -1) ? current : best;
  });
}

export function getHeroImage(anime: AniListMedia): string {
  return (
    anime.bannerImage ??
    anime.coverImage.extraLarge ??
    anime.coverImage.large ??
    anime.coverImage.medium ??
    ''
  );
}

export function getPrimaryStudio(anime: AniListMedia): AniListStudio | null {
  return (
    anime.studios.nodes.find((studio) => studio.isAnimationStudio) ??
    anime.studios.nodes[0] ??
    null
  );
}

export function formatMetadataValue(value: string | number | null): string {
  return value === null ? 'Unknown' : String(value);
}

export function formatAnimeStatus(status: string | null): string {
  if (status === null) {
    return 'Unknown';
  }

  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
