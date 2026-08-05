import { motion } from 'framer-motion';
import type { UseQueryResult } from '@tanstack/react-query';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { SkeletonAnimeCard } from '../../../components/anime/SkeletonAnimeCard';
import { EmptyState } from '../../../components/common/EmptyState';
import { ErrorState } from '../../../components/common/ErrorState';
import { HorizontalCarousel } from '../../../components/common/HorizontalCarousel';
import { SectionHeader } from '../../../components/common/SectionHeader';
import type { AniListPageResponse } from '../../../services/anilist/types';
import {
  useCurrentSeasonAnime,
  usePopularAnime,
  useTrendingAnime,
} from '../hooks/useAnimeCatalogues';

const HOME_SECTION_PAGE_SIZE = 12;

type AnimeCatalogueSectionProps = {
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  query: UseQueryResult<AniListPageResponse, Error>;
  title: string;
};

function AnimeCatalogueSection({
  description,
  emptyDescription,
  emptyTitle,
  query,
  title,
}: AnimeCatalogueSectionProps) {
  const anime = query.data?.Page.media ?? [];
  const titleId = `${title.replace(/\s+/g, '-').toLowerCase()}-title`;

  return (
    <section aria-labelledby={titleId}>
      <SectionHeader id={titleId} subtitle={description} title={title} />

      {query.isPending ? (
        <HorizontalCarousel ariaLabel={`Loading ${title}`}>
          {Array.from({ length: HOME_SECTION_PAGE_SIZE }, (_, index) => (
            <div
              className="w-40 shrink-0 snap-start sm:w-44 lg:w-48"
              key={index}
            >
              <SkeletonAnimeCard />
            </div>
          ))}
        </HorizontalCarousel>
      ) : null}

      {query.isError ? (
        <ErrorState
          description="The catalogue request did not complete. Retry when the connection is available."
          onRetry={() => void query.refetch()}
          title={`${title} could not load.`}
        />
      ) : null}

      {query.isSuccess && anime.length === 0 ? (
        <EmptyState description={emptyDescription} title={emptyTitle} />
      ) : null}

      {anime.length > 0 ? (
        <HorizontalCarousel ariaLabel={title}>
          {anime.map((item) => (
            <div className="w-40 shrink-0 snap-start sm:w-44 lg:w-48" key={item.id}>
              <AnimeCard anime={item} />
            </div>
          ))}
        </HorizontalCarousel>
      ) : null}
    </section>
  );
}

export function HomePage() {
  const trendingAnimeQuery = useTrendingAnime({ perPage: HOME_SECTION_PAGE_SIZE });
  const popularAnimeQuery = usePopularAnime({ perPage: HOME_SECTION_PAGE_SIZE });
  const currentSeasonAnimeQuery = useCurrentSeasonAnime({
    perPage: HOME_SECTION_PAGE_SIZE,
  });

  return (
    <div className="w-full space-y-12">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="home-heading"
        className="rounded-lg border border-border bg-surface/70 px-5 py-8 shadow-glow sm:px-8"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <p className="mb-3 text-sm font-medium uppercase text-accent">
          Home foundation
        </p>
        <h1
          className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
          id="home-heading"
        >
          Featured Anime Coming Soon
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          This placeholder reserves the future featured area while the reusable
          streaming interface components are built out.
        </p>
      </motion.section>

      <AnimeCatalogueSection
        description="A reusable carousel powered by the trending AniList catalogue."
        emptyDescription="AniList returned no trending anime for this request."
        emptyTitle="No trending anime found."
        query={trendingAnimeQuery}
        title="Trending Now"
      />

      <AnimeCatalogueSection
        description="Popular titles from the public AniList anime catalogue."
        emptyDescription="AniList returned no popular anime for this request."
        emptyTitle="No popular anime found."
        query={popularAnimeQuery}
        title="Popular Anime"
      />

      <AnimeCatalogueSection
        description="Current-season anime calculated from the current date."
        emptyDescription="AniList returned no current-season anime for this request."
        emptyTitle="No current-season anime found."
        query={currentSeasonAnimeQuery}
        title="Current Season"
      />
    </div>
  );
}
