import { motion } from 'framer-motion';
import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { FeaturedHero } from '../../../components/anime/FeaturedHero';
import { SkeletonAnimeCard } from '../../../components/anime/SkeletonAnimeCard';
import { EmptyState } from '../../../components/common/EmptyState';
import { ErrorState } from '../../../components/common/ErrorState';
import { HorizontalCarousel } from '../../../components/common/HorizontalCarousel';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { getFeaturedAnime } from '../../../components/anime/featuredHeroUtils';
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
    <section aria-labelledby={titleId} className="scroll-mt-24">
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
  const featuredAnime = useMemo(
    () => getFeaturedAnime(trendingAnimeQuery.data?.Page.media ?? []),
    [trendingAnimeQuery.data?.Page.media],
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-14 sm:space-y-16"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <FeaturedHero anime={featuredAnime} />

      <AnimeCatalogueSection
        description="High-momentum titles rising across the AniList catalogue."
        emptyDescription="AniList returned no trending anime for this request."
        emptyTitle="No trending anime found."
        query={trendingAnimeQuery}
        title="Trending Now"
      />

      <AnimeCatalogueSection
        description="Audience favourites with strong catalogue demand."
        emptyDescription="AniList returned no popular anime for this request."
        emptyTitle="No popular anime found."
        query={popularAnimeQuery}
        title="Popular Anime"
      />

      <AnimeCatalogueSection
        description="This season's standout anime, calculated from the current date."
        emptyDescription="AniList returned no current-season anime for this request."
        emptyTitle="No current-season anime found."
        query={currentSeasonAnimeQuery}
        title="Current Season"
      />
    </motion.div>
  );
}
