import { motion } from 'framer-motion';
import { memo, type ReactNode } from 'react';

import { getPreferredTitle } from '../../services/anilist/media';
import type { AniListMedia } from '../../services/anilist/types';
import { AnimeImage } from './AnimeImage';

type AnimeCardProps = {
  anime: AniListMedia;
  children?: ReactNode;
  isError?: boolean;
  isLoading?: boolean;
};

function formatStatus(status: string | null): string {
  if (status === null) {
    return 'Unknown';
  }

  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatEpisodeCount(episodes: number | null): string | null {
  if (episodes === null) {
    return null;
  }

  return episodes === 1 ? '1 episode' : `${episodes} episodes`;
}

export const AnimeCard = memo(function AnimeCard({
  anime,
  children,
  isError = false,
  isLoading = false,
}: AnimeCardProps) {
  const title = getPreferredTitle(anime.title);
  const coverImage =
    anime.coverImage.extraLarge ?? anime.coverImage.large ?? anime.coverImage.medium;
  const episodeCount = formatEpisodeCount(anime.episodes);

  return (
    <motion.article
      aria-busy={isLoading}
      aria-label={`${title}${anime.averageScore !== null ? `, score ${anime.averageScore}` : ''}`}
      className="group relative overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/20 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      tabIndex={0}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      whileFocus={{ y: -3, scale: 1.015 }}
      whileHover={{ y: -4, scale: 1.018 }}
    >
      <AnimeImage alt={`${title} cover art`} src={coverImage} />

      <div className="space-y-3 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground">
            {title}
          </h3>
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-foreground">
            {anime.averageScore ?? 'NR'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {episodeCount !== null ? <span>{episodeCount}</span> : null}
          <span className="rounded-full border border-border px-2 py-1">
            {formatStatus(anime.status)}
          </span>
        </div>
      </div>

      {isError ? (
        <div className="absolute inset-x-3 top-3 rounded-md bg-background/90 px-3 py-2 text-xs font-medium text-muted">
          Unable to load card data
        </div>
      ) : null}

      {children}
    </motion.article>
  );
});
