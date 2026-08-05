import { Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { getPreferredTitle } from '../../services/anilist/media';
import type { AniListMedia } from '../../services/anilist/types';
import { MyListButton } from '../../features/my-list/components/MyListButton';
import { AnimeWatchActions } from '../../features/watch/components/AnimeWatchActions';
import { Button } from '../common/Button';
import {
  formatMetadataValue,
  formatAnimeStatus,
  getHeroImage,
  getPrimaryStudio,
  stripAniListHtml,
} from './featuredHeroUtils';

type FeaturedHeroProps = {
  anime: AniListMedia | null;
};

export function FeaturedHero({ anime }: FeaturedHeroProps) {
  const navigate = useNavigate();

  const heroData = useMemo(() => {
    if (anime === null) {
      return null;
    }

    return {
      description: stripAniListHtml(anime.description),
      heroImage: getHeroImage(anime),
      studio: getPrimaryStudio(anime),
      title: getPreferredTitle(anime.title),
    };
  }, [anime]);

  if (anime === null || heroData === null) {
    return (
      <section
        aria-labelledby="featured-hero-title"
        className="relative min-h-[48vh] overflow-hidden rounded-lg border border-border bg-surface px-5 py-10 shadow-glow sm:px-8 lg:min-h-[62vh]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="relative flex min-h-[40vh] items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase text-accent">
              Featured
            </p>
            <h1
              className="text-4xl font-semibold text-foreground sm:text-5xl"
              id="featured-hero-title"
            >
              Featured Anime Coming Soon
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">
              The featured area will populate as soon as trending catalogue data
              is available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const genres = anime.genres.slice(0, 3);

  return (
    <motion.section
      animate={{ opacity: 1 }}
      aria-labelledby="featured-hero-title"
      className="relative min-h-[58vh] overflow-hidden rounded-lg border border-border bg-surface shadow-glow sm:min-h-[64vh] lg:min-h-[70vh]"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        data-testid="featured-hero-background"
        initial={{ opacity: 0 }}
        style={
          heroData.heroImage === ''
            ? undefined
            : { backgroundImage: `url(${heroData.heroImage})` }
        }
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-background/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
      <div className="absolute left-8 top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative flex min-h-[58vh] items-end px-5 pb-8 pt-24 sm:min-h-[64vh] sm:px-8 sm:pb-10 lg:min-h-[70vh] lg:px-10">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.26, ease: 'easeOut' }}
        >
          <p className="mb-3 text-sm font-medium uppercase text-accent">
            Featured Anime
          </p>
          <h1
            className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            id="featured-hero-title"
          >
            {heroData.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 font-semibold">
              <Star aria-hidden="true" size={15} />
              {anime.averageScore ?? 'NR'}
            </span>
            <span>{anime.episodes === null ? 'Episodes TBA' : `${anime.episodes} episodes`}</span>
            <span>{formatMetadataValue(anime.season)}</span>
            <span>{formatMetadataValue(anime.seasonYear)}</span>
            <span>{formatAnimeStatus(anime.status)}</span>
            {heroData.studio !== null ? <span>{heroData.studio.name}</span> : null}
          </div>

          {genres.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  className="rounded-full border border-white/15 bg-background/35 px-3 py-1 text-xs font-medium text-foreground backdrop-blur"
                  key={genre}
                >
                  {genre}
                </span>
              ))}
            </div>
          ) : null}

          <div className="relative mt-5 max-w-2xl">
            <p className="line-clamp-3 text-base leading-7 text-muted">
              {heroData.description}
            </p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/95 to-transparent" />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <AnimeWatchActions anime={anime} />
            <Button
              aria-label={`More information about ${heroData.title}`}
              onClick={() => navigate(`/anime/${anime.id}`)}
              variant="secondary"
            >
              <Info aria-hidden="true" size={17} />
              More Info
            </Button>
            <MyListButton anime={anime} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
