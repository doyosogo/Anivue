import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { AnimeImage } from '../../../components/anime/AnimeImage';
import {
  formatAnimeStatus,
  formatMetadataValue,
  getHeroImage,
  getPrimaryStudio,
  getSanitizedDescriptionParagraphs,
} from '../../../components/anime/featuredHeroUtils';
import { EmptyState } from '../../../components/common/EmptyState';
import { ErrorState } from '../../../components/common/ErrorState';
import { HorizontalCarousel } from '../../../components/common/HorizontalCarousel';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { MyListButton } from '../../my-list/components/MyListButton';
import { useRecentlyViewedStore } from '../../recently-viewed/store/useRecentlyViewedStore';
import { AnimeWatchActions } from '../../watch/components/AnimeWatchActions';
import { getPreferredTitle } from '../../../services/anilist/media';
import type {
  AniListAnimeDetails,
  AniListCharacterEdge,
  AniListStaffEdge,
} from '../../../services/anilist/types';
import { useAnimeDetails } from '../hooks/useAnimeDetails';

type MetadataChipProps = {
  label: string;
};

function MetadataChip({ label }: MetadataChipProps) {
  return (
    <span className="rounded-full border border-white/15 bg-background/40 px-3 py-1 text-sm font-medium text-foreground backdrop-blur">
      {label}
    </span>
  );
}

function AnimeDetailsSkeleton() {
  return (
    <div aria-label="Loading anime details" className="w-full space-y-10">
      <div className="min-h-[58vh] overflow-hidden rounded-lg border border-border bg-surface">
        <div className="h-52 animate-pulse bg-elevated sm:h-72" />
        <div className="grid gap-6 px-5 pb-8 sm:grid-cols-[12rem_1fr] sm:px-8">
          <div className="-mt-20 aspect-[2/3] animate-pulse rounded-lg bg-elevated" />
          <div className="space-y-4 pt-6">
            <div className="h-9 w-2/3 animate-pulse rounded bg-elevated" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-elevated" />
            <div className="h-4 w-5/6 max-w-xl animate-pulse rounded bg-elevated" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  className="h-8 w-24 animate-pulse rounded-full bg-elevated"
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPersonCard({
  image,
  name,
  role,
}: {
  image: string | null;
  name: string;
  role: string | null;
}) {
  return (
    <article className="w-36 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/10">
      <AnimeImage alt={`${name} portrait`} aspectRatio="1 / 1.25" src={image} />
      <div className="min-h-20 px-3 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {name}
        </h3>
        {role !== null ? (
          <p className="mt-1 line-clamp-1 text-xs text-muted">{role}</p>
        ) : null}
      </div>
    </article>
  );
}

function Description({ paragraphs }: { paragraphs: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);
  const canToggle = paragraphs.length > 2 || paragraphs.join(' ').length > 320;

  return (
    <div>
      <div className={`space-y-4 ${isExpanded ? '' : 'line-clamp-6'}`}>
        {visibleParagraphs.map((paragraph) => (
          <p className="text-base leading-7 text-muted" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      {canToggle ? (
        <button
          className="mt-4 rounded-md text-sm font-semibold text-accent transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setIsExpanded((value) => !value)}
          type="button"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      ) : null}
    </div>
  );
}

function DetailsHero({ anime }: { anime: AniListAnimeDetails }) {
  const title = getPreferredTitle(anime.title);
  const heroImage = getHeroImage(anime);
  const coverImage =
    anime.coverImage.extraLarge ?? anime.coverImage.large ?? anime.coverImage.medium;
  const studio = getPrimaryStudio(anime);
  const metadata = [
    anime.format,
    anime.episodes === null ? null : `${anime.episodes} Episodes`,
    anime.seasonYear,
    anime.duration === null ? null : `${anime.duration} min`,
    formatAnimeStatus(anime.status),
    studio?.name ?? null,
  ].filter((item): item is string | number => item !== null);

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="anime-details-title"
      className="relative overflow-hidden rounded-lg border border-border bg-surface shadow-glow"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-80 bg-cover bg-center"
        style={heroImage === '' ? undefined : { backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-r from-background via-background/55 to-background/10" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

      <div className="relative grid gap-6 px-5 pb-8 pt-40 sm:grid-cols-[12rem_1fr] sm:px-8 sm:pt-56 lg:grid-cols-[14rem_1fr]">
        <div className="max-w-48">
          <AnimeImage
            alt={`${title} poster`}
            className="rounded-lg border border-border shadow-2xl shadow-black/30"
            src={coverImage}
          />
        </div>

        <div className="self-end">
          <p className="mb-3 text-sm font-medium uppercase text-accent">
            Anime Details
          </p>
          <h1
            className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl"
            id="anime-details-title"
          >
            {title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            <MetadataChip label={`Score ${anime.averageScore ?? 'NR'}`} />
            <MetadataChip label={`${formatMetadataValue(anime.popularity)} popularity`} />
            {metadata.map((item) => (
              <MetadataChip key={item} label={String(item)} />
            ))}
            {anime.genres.slice(0, 4).map((genre) => (
              <MetadataChip key={genre} label={genre} />
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <AnimeWatchActions anime={anime} />
            <MyListButton anime={anime} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function PeopleSection({
  edges,
  title,
}: {
  edges: Array<AniListCharacterEdge | AniListStaffEdge>;
  title: string;
}) {
  if (edges.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`${title.toLowerCase()}-title`}>
      <SectionHeader id={`${title.toLowerCase()}-title`} title={title} />
      <HorizontalCarousel ariaLabel={title}>
        {edges.map((edge) => (
          <DetailPersonCard
            image={edge.node.image.large ?? edge.node.image.medium}
            key={`${title}-${edge.node.id}-${edge.role ?? 'role'}`}
            name={edge.node.name.full ?? 'Unknown'}
            role={edge.role}
          />
        ))}
      </HorizontalCarousel>
    </section>
  );
}

function AnimeDetailsContent({ anime }: { anime: AniListAnimeDetails }) {
  const descriptionParagraphs = useMemo(
    () => getSanitizedDescriptionParagraphs(anime.description),
    [anime.description],
  );
  const recommendations = anime.recommendations.nodes
    .map((recommendation) => recommendation.mediaRecommendation)
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const relations = anime.relations.edges.filter(
    (edge) =>
      edge.relationType?.toLowerCase().includes('prequel') ||
      edge.relationType?.toLowerCase().includes('sequel'),
  );

  return (
    <div className="w-full space-y-12">
      <DetailsHero anime={anime} />

      <section aria-labelledby="anime-description-title">
        <SectionHeader
          id="anime-description-title"
          subtitle="Sanitised from AniList metadata."
          title="Overview"
        />
        <Description paragraphs={descriptionParagraphs} />
      </section>

      <PeopleSection edges={anime.characters.edges} title="Characters" />

      {recommendations.length > 0 ? (
        <section aria-labelledby="recommendations-title">
          <SectionHeader id="recommendations-title" title="Recommendations" />
          <HorizontalCarousel ariaLabel="Recommendations">
            {recommendations.map((item) => (
              <div className="w-40 shrink-0 snap-start sm:w-44 lg:w-48" key={item.id}>
                <AnimeCard anime={item} />
              </div>
            ))}
          </HorizontalCarousel>
        </section>
      ) : null}

      {relations.length > 0 ? (
        <section aria-labelledby="relations-title">
          <SectionHeader id="relations-title" title="Relations" />
          <HorizontalCarousel ariaLabel="Relations">
            {relations.map((edge) => (
              <div
                className="w-40 shrink-0 snap-start sm:w-44 lg:w-48"
                key={`${edge.relationType}-${edge.node.id}`}
              >
                <AnimeCard anime={edge.node}>
                  <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur">
                    {edge.relationType}
                  </span>
                </AnimeCard>
              </div>
            ))}
          </HorizontalCarousel>
        </section>
      ) : null}

      <PeopleSection edges={anime.staff.edges} title="Staff" />

      {anime.studios.nodes.length > 0 ? (
        <section aria-labelledby="studios-title">
          <SectionHeader id="studios-title" title="Studios" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {anime.studios.nodes.map((studio) => (
              <article
                className="rounded-lg border border-border bg-surface p-4"
                key={studio.id}
              >
                <h3 className="font-semibold text-foreground">{studio.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  {studio.isAnimationStudio ? 'Animation studio' : 'Production studio'}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function AnimeDetailsPage() {
  const params = useParams();
  const animeId = params.id === undefined ? null : Number(params.id);
  const hasValidId = animeId !== null && Number.isInteger(animeId) && animeId > 0;
  const animeDetailsQuery = useAnimeDetails(hasValidId ? animeId : null);
  const recordViewedAnime = useRecentlyViewedStore(
    (state) => state.recordViewedAnime,
  );

  useEffect(() => {
    if (animeDetailsQuery.isSuccess && animeDetailsQuery.data.Media !== null) {
      recordViewedAnime(animeDetailsQuery.data.Media);
    }
  }, [animeDetailsQuery.data, animeDetailsQuery.isSuccess, recordViewedAnime]);

  if (!hasValidId) {
    return (
      <EmptyState
        description="The requested anime URL does not contain a valid AniList id."
        title="Anime not found."
      />
    );
  }

  if (animeDetailsQuery.isPending) {
    return <AnimeDetailsSkeleton />;
  }

  if (animeDetailsQuery.isError) {
    return (
      <ErrorState
        description="The anime details request did not complete. Retry when the connection is available."
        onRetry={() => void animeDetailsQuery.refetch()}
        title="Anime details could not load."
      />
    );
  }

  if (animeDetailsQuery.data.Media === null) {
    return (
      <EmptyState
        description="AniList did not return details for this anime."
        title="Anime details unavailable."
      />
    );
  }

  return <AnimeDetailsContent anime={animeDetailsQuery.data.Media} />;
}
