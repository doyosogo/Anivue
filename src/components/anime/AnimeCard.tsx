import { motion } from 'framer-motion';
import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getPreferredTitle } from '../../services/anilist/media';
import type { AniListMedia } from '../../services/anilist/types';
import { MyListButton } from '../../features/my-list/components/MyListButton';
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
    <motion.div
      aria-busy={isLoading}
      className="group relative overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/20 transition-colors duration-200"
      transition={{ duration: 0.18, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.018 }}
    >
      <Link
        aria-label={`${title}${anime.averageScore !== null ? `, score ${anime.averageScore}` : ''}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        to={`/anime/${anime.id}`}
      >
        <article>
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
        </article>
      </Link>

      {isError ? (
        <div className="absolute inset-x-3 top-3 rounded-md bg-background/90 px-3 py-2 text-xs font-medium text-muted">
          Unable to load card data
        </div>
      ) : null}

      <div className="absolute right-3 top-3 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <MyListButton anime={anime} compact />
      </div>

      {children}
    </motion.div>
  );
});
