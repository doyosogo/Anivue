import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createAniListMediaFixture,
  createAniListPageFixture,
} from '../../../services/anilist/test-fixtures';
import {
  resetRecentlyViewedStoreForTest,
  useRecentlyViewedStore,
} from '../../recently-viewed/store/useRecentlyViewedStore';
import { HomePage } from './HomePage';

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<h1>Anime details</h1>} path="/anime/:id" />
          <Route element={<h1>Viewing History</h1>} path="/history" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function mockHomeFetch() {
  return vi.fn<typeof fetch>().mockImplementation((_, init) => {
    const body = String(init?.body ?? '');

    if (body.includes('AnimeRecommendations')) {
      return Promise.resolve(
        Response.json({
          data: {
            Media: {
              id: 77,
              recommendations: {
                nodes: [
                  {
                    id: 1,
                    rating: 90,
                    mediaRecommendation: createAniListMediaFixture({
                      id: 88,
                      title: {
                        english: 'History Recommendation',
                        romaji: null,
                        native: null,
                      },
                    }),
                  },
                ],
              },
            },
          },
        }),
      );
    }

    return Promise.resolve(
      Response.json({
        data: createAniListPageFixture([
          createAniListMediaFixture({
            id: 5,
            title: { english: 'Catalogue Anime', romaji: null, native: null },
          }),
        ]),
      }),
    );
  });
}

function seedRecentlyViewedHistory() {
  act(() => {
    useRecentlyViewedStore.getState().recordViewedAnime(
      createAniListMediaFixture({
        id: 77,
        title: { english: 'Stored History Anime', romaji: null, native: null },
      }),
    );
  });
}

describe('HomePage recently viewed sections', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    act(() => {
      resetRecentlyViewedStoreForTest();
    });
    window.localStorage.clear();
  });

  it('hides the Recently Viewed section when history is empty', async () => {
    vi.stubGlobal('fetch', mockHomeFetch());

    renderHomePage();

    await screen.findAllByText('Catalogue Anime');

    expect(screen.queryByText('Recently Viewed')).not.toBeInTheDocument();
    expect(screen.queryByText(/Because You Viewed/)).not.toBeInTheDocument();
  });

  it('renders stored history without per-title refetching', async () => {
    const fetchMock = mockHomeFetch();
    vi.stubGlobal('fetch', fetchMock);
    seedRecentlyViewedHistory();

    renderHomePage();

    expect(await screen.findByText('Recently Viewed')).toBeInTheDocument();
    expect(screen.getByText('Stored History Anime')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', {
        name: 'Because You Viewed Stored History Anime',
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText('History Recommendation')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('history cards navigate to anime details', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', mockHomeFetch());
    seedRecentlyViewedHistory();

    renderHomePage();

    await user.click(await screen.findByRole('link', { name: /stored history anime/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Anime details' }),
      ).toBeInTheDocument(),
    );
  });

  it('shows a loading state for personalised recommendations', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation((_, init) => {
        const body = String(init?.body ?? '');
        if (body.includes('AnimeRecommendations')) {
          return new Promise<Response>(() => undefined);
        }

        return Promise.resolve(
          Response.json({
            data: createAniListPageFixture(),
          }),
        );
      }),
    );
    seedRecentlyViewedHistory();

    renderHomePage();

    expect(
      await screen.findByRole('heading', {
        name: 'Because You Viewed Stored History Anime',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Loading Because You Viewed Stored History Anime'),
    ).toBeInTheDocument();
  });

  it('shows an error state and retries personalised recommendations', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_, init) => {
      const body = String(init?.body ?? '');
      if (body.includes('AnimeRecommendations')) {
        const recommendationCalls = fetchMock.mock.calls.filter((call) =>
          String(call[1]?.body ?? '').includes('AnimeRecommendations'),
        );

        if (recommendationCalls.length === 1) {
          return Promise.reject(new Error('Network failed'));
        }

        return Promise.resolve(
          Response.json({
            data: {
              Media: {
                id: 77,
                recommendations: {
                  nodes: [
                    {
                      id: 1,
                      rating: 90,
                      mediaRecommendation: createAniListMediaFixture({
                        id: 88,
                        title: {
                          english: 'Retry Recommendation',
                          romaji: null,
                          native: null,
                        },
                      }),
                    },
                  ],
                },
              },
            },
          }),
        );
      }

      return Promise.resolve(
        Response.json({
          data: createAniListPageFixture(),
        }),
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    seedRecentlyViewedHistory();

    renderHomePage();

    expect(
      await screen.findByText('Recommendations could not load.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Retry Recommendation')).toBeInTheDocument();
  });

  it('shows an empty state for unusable personalised recommendations', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation((_, init) => {
        const body = String(init?.body ?? '');
        if (body.includes('AnimeRecommendations')) {
          return Promise.resolve(
            Response.json({
              data: {
                Media: {
                  id: 77,
                  recommendations: {
                    nodes: [
                      {
                        id: 1,
                        rating: 90,
                        mediaRecommendation: createAniListMediaFixture({
                          id: 77,
                        }),
                      },
                    ],
                  },
                },
              },
            }),
          );
        }

        return Promise.resolve(
          Response.json({
            data: createAniListPageFixture(),
          }),
        );
      }),
    );
    seedRecentlyViewedHistory();

    renderHomePage();

    expect(await screen.findByText('No recommendations found.')).toBeInTheDocument();
  });
});
