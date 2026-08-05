import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { getPreferredTitle } from '../../../services/anilist/media';
import type { AniListMedia } from '../../../services/anilist/types';
import { useTrendingAnime } from '../hooks/useAnimeCatalogues';

function AnimeCoverCard({ anime }: { anime: AniListMedia }) {
  const [hasImageError, setHasImageError] = useState(false);
  const title = getPreferredTitle(anime.title);
  const coverImage =
    anime.coverImage.extraLarge ?? anime.coverImage.large ?? anime.coverImage.medium;

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface/80">
      <div className="aspect-[2/3] bg-elevated">
        {coverImage !== null && !hasImageError ? (
          <img
            alt={`${title} cover art`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setHasImageError(true)}
            src={coverImage}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
            Cover unavailable
          </div>
        )}
      </div>
      <div className="min-h-16 px-3 py-3">
        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
          {title}
        </h2>
      </div>
    </article>
  );
}

function AnimeGridSkeleton() {
  return (
    <div
      aria-label="Loading trending anime"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          className="overflow-hidden rounded-lg border border-border bg-surface/70"
          key={index}
        >
          <div className="aspect-[2/3] animate-pulse bg-elevated" />
          <div className="space-y-2 px-3 py-3">
            <div className="h-3 w-4/5 animate-pulse rounded bg-elevated" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePage() {
  const trendingAnimeQuery = useTrendingAnime({ perPage: 12 });
  const anime = trendingAnimeQuery.data?.Page.media ?? [];

  return (
    <section className="w-full" aria-labelledby="home-heading">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase text-accent">
          Development catalogue
        </p>
        <h1
          className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
          id="home-heading"
        >
          AniList integration is active.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          This temporary view verifies the public GraphQL catalogue pipeline
          before final homepage sections are designed.
        </p>
      </div>

      {trendingAnimeQuery.isPending ? <AnimeGridSkeleton /> : null}

      {trendingAnimeQuery.isError ? (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Trending anime could not load.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            The request to AniList failed. Retry the catalogue request when the
            connection is available.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
            onClick={() => void trendingAnimeQuery.refetch()}
            type="button"
          >
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      {trendingAnimeQuery.isSuccess && anime.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            No trending anime found.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            AniList returned an empty catalogue for this request.
          </p>
        </div>
      ) : null}

      {anime.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {anime.map((item) => (
            <AnimeCoverCard anime={item} key={item.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
