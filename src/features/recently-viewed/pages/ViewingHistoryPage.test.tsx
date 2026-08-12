import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import {
  resetRecentlyViewedStoreForTest,
  useRecentlyViewedStore,
} from '../store/useRecentlyViewedStore';
import { ViewingHistoryPage } from './ViewingHistoryPage';

function renderViewingHistoryPage() {
  return render(
    <MemoryRouter initialEntries={['/history']}>
      <Routes>
        <Route element={<ViewingHistoryPage />} path="/history" />
        <Route element={<h1>Anime details</h1>} path="/anime/:id" />
      </Routes>
    </MemoryRouter>,
  );
}

function addHistoryItem(id = 1, title = 'Stored History Anime') {
  act(() => {
    useRecentlyViewedStore.getState().recordViewedAnime(
      createAniListMediaFixture({
        id,
        title: { english: title, romaji: null, native: null },
      }),
    );
  });
}

describe('ViewingHistoryPage', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    act(() => {
      resetRecentlyViewedStoreForTest();
    });
    window.localStorage.clear();
  });

  it('renders saved recently viewed titles without refetching them', () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    addHistoryItem();

    renderViewingHistoryPage();

    expect(screen.getByRole('heading', { name: 'Viewing History' })).toBeInTheDocument();
    expect(screen.getByText('Stored History Anime')).toBeInTheDocument();
    expect(screen.getByText(/1 recently viewed title/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('removes one history entry', async () => {
    const user = userEvent.setup();
    addHistoryItem();

    renderViewingHistoryPage();

    await user.click(
      screen.getByRole('button', {
        name: /remove stored history anime from viewing history/i,
      }),
    );

    expect(screen.getByText('No recently viewed titles.')).toBeInTheDocument();
  });

  it('clears history after confirmation', async () => {
    const user = userEvent.setup();
    addHistoryItem();

    renderViewingHistoryPage();

    await user.click(screen.getByRole('button', { name: 'Clear viewing history' }));
    await user.click(
      screen.getByRole('button', { name: 'Confirm clear viewing history' }),
    );

    expect(screen.getByText('No recently viewed titles.')).toBeInTheDocument();
  });

  it('renders the empty state', () => {
    renderViewingHistoryPage();

    expect(screen.getByText('No recently viewed titles.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse anime' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Search anime' })).toBeInTheDocument();
  });

  it('history cards navigate to anime details', async () => {
    const user = userEvent.setup();
    addHistoryItem();

    renderViewingHistoryPage();

    await user.click(screen.getByRole('link', { name: /stored history anime/i }));

    expect(
      await screen.findByRole('heading', { name: 'Anime details' }),
    ).toBeInTheDocument();
  });
});
