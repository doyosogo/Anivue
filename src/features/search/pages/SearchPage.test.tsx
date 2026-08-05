import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createAniListMediaFixture,
  createAniListPageFixture,
} from '../../../services/anilist/test-fixtures';
import { SearchPage } from './SearchPage';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderSearchPage(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            element={
              <>
                <LocationDisplay />
                <SearchPage />
              </>
            }
            path="/search"
          />
          <Route element={<h1>Anime details</h1>} path="/anime/:id" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function mockSearchResponse(
  media = [
    createAniListMediaFixture({
      id: 7,
      title: { english: 'Naruto', romaji: null, native: null },
    }),
  ],
  hasNextPage = true,
) {
  const fixture = createAniListPageFixture(media);
  fixture.Page.pageInfo.hasNextPage = hasNextPage;
  fixture.Page.pageInfo.total = media.length;
  return Response.json({ data: fixture });
}

describe('SearchPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders search results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(mockSearchResponse()),
      ),
    );

    renderSearchPage('/search?q=naruto');

    expect(await screen.findByText('Naruto')).toBeInTheDocument();
    expect(screen.getByText(/Results for "naruto"/)).toBeInTheDocument();
  });

  it('renders an empty state for no results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(mockSearchResponse([], false)),
      ),
    );

    renderSearchPage('/search?q=zzzz');

    expect(await screen.findByText('No anime found.')).toBeInTheDocument();
  });

  it('renders an error state and retries', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockImplementationOnce(() => Promise.resolve(mockSearchResponse()));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderSearchPage('/search?q=naruto');

    expect(
      await screen.findByText('Search results could not load.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Naruto')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('updates pagination through URL state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(mockSearchResponse()),
      ),
    );
    const user = userEvent.setup();

    renderSearchPage('/search?q=naruto&page=2');

    await screen.findByText('Naruto');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=naruto');
    await screen.findByText('Naruto');

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/search?q=naruto&page=2',
    );
  });

  it('resets page to 1 when filters change', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(mockSearchResponse()),
      ),
    );
    const user = userEvent.setup();

    renderSearchPage('/search?q=naruto&page=3');

    await screen.findByText('Naruto');
    await user.selectOptions(screen.getByLabelText('Genre'), 'Action');

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/search?q=naruto&genre=Action',
    );
  });

  it('navigates result cards to anime details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(mockSearchResponse()),
      ),
    );
    const user = userEvent.setup();

    renderSearchPage('/search?q=naruto');

    await user.click(await screen.findByRole('link', { name: /naruto/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Anime details' })).toBeInTheDocument(),
    );
  });

  it('shows the discovery introduction without requesting a catalogue', () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    renderSearchPage('/search');

    expect(
      screen.getByText('Discover anime with focused search.'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
