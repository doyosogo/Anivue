import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AnimeCard } from '../../../components/anime/AnimeCard';
import { SkeletonAnimeCard } from '../../../components/anime/SkeletonAnimeCard';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { ErrorState } from '../../../components/common/ErrorState';
import { isAniListRateLimitError } from '../../../services/anilist/errors';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import {
  ANIME_FORMATS,
  ANIME_GENRES,
  ANIME_SEASONS,
  ANIME_SORTS,
  ANIME_STATUSES,
  formatFilterLabel,
  MAX_SEARCH_YEAR,
  MIN_SEARCH_YEAR,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_PAGE_SIZE,
} from '../config/searchFilters';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import {
  canRunSearch,
  createSearchPath,
  hasActiveSearchFilters,
  isQueryTooShort,
  parseSearchUrlState,
  updateSearchState,
  type SearchUrlState,
} from '../utils/searchUrlState';

function SearchSkeletonGrid() {
  return (
    <div
      aria-label="Loading search results"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {Array.from({ length: SEARCH_PAGE_SIZE }, (_, index) => (
        <SkeletonAnimeCard key={index} />
      ))}
    </div>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  const id = `search-filter-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase text-muted" htmlFor={id}>
        {label}
      </label>
      <select
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/40"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatFilterLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchFilters({
  onChange,
  onClear,
  state,
}: {
  onChange: (updates: Partial<SearchUrlState>) => void;
  onClear: () => void;
  state: SearchUrlState;
}) {
  return (
    <section
      aria-label="Search filters"
      className="rounded-lg border border-border bg-surface/75 p-4"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal aria-hidden="true" size={16} />
          Filters
        </div>
        {hasActiveSearchFilters(state) || state.q.length > 0 ? (
          <button
            className="inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onClear}
            type="button"
          >
            <X aria-hidden="true" size={15} />
            Clear all
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <FilterSelect
          label="Genre"
          onChange={(value) => onChange({ genre: value || null })}
          options={ANIME_GENRES}
          value={state.genre ?? ''}
        />
        <FilterSelect
          label="Format"
          onChange={(value) =>
            onChange({ format: value === '' ? null : state.format === value ? state.format : value as SearchUrlState['format'] })
          }
          options={ANIME_FORMATS}
          value={state.format ?? ''}
        />
        <FilterSelect
          label="Status"
          onChange={(value) =>
            onChange({ status: value === '' ? null : value as SearchUrlState['status'] })
          }
          options={ANIME_STATUSES}
          value={state.status ?? ''}
        />
        <FilterSelect
          label="Season"
          onChange={(value) =>
            onChange({ season: value === '' ? null : value as SearchUrlState['season'] })
          }
          options={ANIME_SEASONS}
          value={state.season ?? ''}
        />
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-muted" htmlFor="search-year">
            Year
          </label>
          <input
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/40"
            id="search-year"
            max={MAX_SEARCH_YEAR}
            min={MIN_SEARCH_YEAR}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              onChange({
                year: Number.isInteger(parsed) ? parsed : null,
              });
            }}
            placeholder="Any"
            type="number"
            value={state.year ?? ''}
          />
        </div>
        <FilterSelect
          label="Sort"
          onChange={(value) =>
            onChange({ sort: value === '' ? 'DEFAULT' : value as SearchUrlState['sort'] })
          }
          options={ANIME_SORTS}
          value={state.sort === 'DEFAULT' ? '' : state.sort}
        />
      </div>
    </section>
  );
}

function DiscoveryIntro() {
  const shortcuts = [
    { label: 'Trending anime', to: '/search?sort=TRENDING_DESC' },
    { label: 'Popular anime', to: '/search?sort=POPULARITY_DESC' },
    { label: 'Movies', to: '/search?format=MOVIE&sort=POPULARITY_DESC' },
    { label: 'Current season', to: '/search?sort=START_DATE_DESC' },
  ];

  return (
    <EmptyState
      action={
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((shortcut) => (
            <Link
              className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              key={shortcut.to}
              to={shortcut.to}
            >
              {shortcut.label}
            </Link>
          ))}
        </div>
      }
      description="Search by title or use filters to explore AniList catalogue metadata without requesting the full catalogue by default."
      title="Discover anime with focused search."
    />
  );
}

function ResultSummary({
  resultCount,
  state,
  total,
}: {
  resultCount: number;
  state: SearchUrlState;
  total: number | null;
}) {
  const parts = [];
  if (state.q.trim().length >= SEARCH_MIN_QUERY_LENGTH) {
    parts.push(`Results for "${state.q.trim()}"`);
  }
  if (state.genre !== null) {
    parts.push(`${state.genre} anime`);
  }
  if (parts.length === 0) {
    parts.push('Filtered anime');
  }

  return (
    <p className="text-sm text-muted" role="status">
      {parts.join(' · ')} · Page {state.page}
      {total !== null ? ` · ${total.toLocaleString()} total` : ''}
      {total === null ? ` · ${resultCount} shown` : ''}
    </p>
  );
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const searchState = parseSearchUrlState(searchParams);
  const [inputValue, setInputValue] = useState(searchState.q);
  const debouncedInputValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const searchQuery = useAnimeSearch(searchState);
  const canSearch = canRunSearch(searchState);
  const tooShort = isQueryTooShort(searchState);
  const results = searchQuery.data?.Page.media ?? [];
  const pageInfo = searchQuery.data?.Page.pageInfo;

  useEffect(() => {
    setInputValue(searchState.q);
  }, [searchState.q]);

  useEffect(() => {
    const trimmedValue = debouncedInputValue.trim();
    if (trimmedValue === searchState.q) {
      return;
    }

    navigate(createSearchPath(updateSearchState(searchState, { q: trimmedValue })), {
      replace: true,
    });
  }, [debouncedInputValue, navigate, searchState]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  function navigateToState(nextState: SearchUrlState) {
    navigate(createSearchPath(nextState));
  }

  function updateFilters(updates: Partial<SearchUrlState>) {
    navigateToState(updateSearchState(searchState, updates));
  }

  function updatePage(page: number) {
    navigateToState(updateSearchState(searchState, { page }));
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      if (typeof resultsRef.current?.scrollIntoView === 'function') {
        resultsRef.current.scrollIntoView({
          behavior:
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
          block: 'start',
        });
      }
    }, 0);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateToState(updateSearchState(searchState, { q: inputValue.trim() }));
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <section aria-labelledby="search-title" className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-medium uppercase text-accent">
            Discover
          </p>
          <h1 className="text-4xl font-semibold text-foreground" id="search-title">
            Search anime
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Find catalogue metadata by title, genre, format, season, year, and
            sort order.
          </p>
        </div>

        <form aria-label="Anime search" className="flex gap-3" onSubmit={handleSubmit} role="search">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="search-page-query">
              Search by anime title
            </label>
            <input
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40"
              id="search-page-query"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Search titles, e.g. Naruto"
              value={inputValue}
            />
          </div>
          <Button aria-label="Search anime" type="submit">
            Search
          </Button>
        </form>

        <SearchFilters
          onChange={updateFilters}
          onClear={() => navigate('/search')}
          state={searchState}
        />
      </section>

      <div ref={resultsRef} />

      {!canSearch ? <DiscoveryIntro /> : null}

      {tooShort ? (
        <EmptyState
          description={`Enter at least ${SEARCH_MIN_QUERY_LENGTH} characters, or choose a filter to browse the catalogue.`}
          title="Search term is too short."
        />
      ) : null}

      {canSearch && searchQuery.isPending ? <SearchSkeletonGrid /> : null}

      {canSearch && searchQuery.isError ? (
        <ErrorState
          description={
            isAniListRateLimitError(searchQuery.error)
              ? 'AniList is rate limiting requests. Wait briefly and retry.'
              : 'The search request did not complete. Retry when the connection is available.'
          }
          onRetry={() => void searchQuery.refetch()}
          title="Search results could not load."
        />
      ) : null}

      {canSearch && searchQuery.isSuccess && results.length === 0 ? (
        <EmptyState
          description="Try a different title, remove a filter, or choose another sort order."
          title="No anime found."
        />
      ) : null}

      {results.length > 0 ? (
        <section aria-labelledby="search-results-title" className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground" id="search-results-title">
                Results
              </h2>
              <ResultSummary
                resultCount={results.length}
                state={searchState}
                total={pageInfo?.total ?? null}
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <button
                className="rounded-md border border-border px-3 py-2 font-semibold text-foreground transition-colors hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={searchState.page <= 1}
                onClick={() => updatePage(searchState.page - 1)}
                type="button"
              >
                Previous
              </button>
              <span>Page {searchState.page}</span>
              <button
                className="rounded-md border border-border px-3 py-2 font-semibold text-foreground transition-colors hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={pageInfo?.hasNextPage === false}
                onClick={() => updatePage(searchState.page + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {results.map((anime) => (
              <AnimeCard anime={anime} key={anime.id} />
            ))}
          </motion.div>
        </section>
      ) : null}
    </motion.div>
  );
}
