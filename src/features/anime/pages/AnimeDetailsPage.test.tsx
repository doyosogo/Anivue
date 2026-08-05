import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAniListDetailsFixture } from '../../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../../my-list/store/useMyListStore';
import { AnimeDetailsPage } from './AnimeDetailsPage';

function renderAnimeDetailsPage(initialPath = '/anime/1') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<AnimeDetailsPage />} path="/anime/:id" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function mockDetailsResponse(title = 'Fullmetal Alchemist: Brotherhood') {
  return Response.json({
    data: createAniListDetailsFixture({
      title: {
        english: title,
        romaji: null,
        native: null,
      },
    }),
  });
}

describe('AnimeDetailsPage', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('renders anime details from the AniList response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(mockDetailsResponse()),
    );

    renderAnimeDetailsPage();

    expect(screen.getByLabelText(/loading anime details/i)).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', {
        name: 'Fullmetal Alchemist: Brotherhood',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('TV')).toBeInTheDocument();
    expect(screen.getByText('64 Episodes')).toBeInTheDocument();
    expect(screen.getAllByText('Bones').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Characters' })).toBeInTheDocument();
  });

  it('expands and collapses the sanitised description', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(mockDetailsResponse()),
    );

    renderAnimeDetailsPage();

    await screen.findByRole('heading', {
      name: 'Fullmetal Alchemist: Brotherhood',
    });

    expect(screen.getByText('A brilliant adventure begins.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show More' }));
    expect(screen.getByRole('button', { name: 'Show Less' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show Less' }));
    expect(screen.getByRole('button', { name: 'Show More' })).toBeInTheDocument();
  });

  it('navigates when a recommendation is selected', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(mockDetailsResponse())
      .mockResolvedValueOnce(mockDetailsResponse('Recommended Anime'));
    vi.stubGlobal('fetch', fetchMock);

    renderAnimeDetailsPage();

    await screen.findByRole('heading', {
      name: 'Fullmetal Alchemist: Brotherhood',
    });

    await user.click(screen.getByRole('link', { name: /recommended anime/i }));

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Recommended Anime',
      }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('renders a friendly error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new Error('Network failed')),
    );

    renderAnimeDetailsPage();

    expect(
      await screen.findByRole('heading', {
        name: 'Anime details could not load.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('keeps the loading skeleton reserved before data resolves', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() => new Promise<Response>(() => undefined)),
    );

    renderAnimeDetailsPage();

    await waitFor(() =>
      expect(screen.getByLabelText(/loading anime details/i)).toBeInTheDocument(),
    );
  });

  it('adds loaded details to My List', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(mockDetailsResponse()),
    );

    renderAnimeDetailsPage();

    await screen.findByRole('heading', {
      name: 'Fullmetal Alchemist: Brotherhood',
    });
    await user.click(
      screen.getByRole('button', {
        name: 'Add Fullmetal Alchemist: Brotherhood to My List',
      }),
    );

    expect(
      await screen.findByRole('button', {
        name: 'Remove Fullmetal Alchemist: Brotherhood from My List',
      }),
    ).toBeInTheDocument();
    expect(useMyListStore.getState().isInMyList(1)).toBe(true);
  });
});
