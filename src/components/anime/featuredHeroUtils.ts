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
