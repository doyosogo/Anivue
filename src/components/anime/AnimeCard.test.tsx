import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../../features/my-list/store/useMyListStore';
import { AnimeCard } from './AnimeCard';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

describe('AnimeCard', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('renders the preferred title fallback', () => {
    const anime = createAniListMediaFixture({
      title: {
        english: null,
        romaji: 'Romaji Fallback',
        native: 'Native Fallback',
      },
    });

    render(
      <MemoryRouter>
        <AnimeCard anime={anime} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Romaji Fallback')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /romaji fallback/i }),
    ).toBeInTheDocument();
  });

  it('does not navigate when the My List control is clicked', async () => {
    const user = userEvent.setup();
    const anime = createAniListMediaFixture();

    render(
      <MemoryRouter initialEntries={['/search?q=test']}>
        <AnimeCard anime={anime} />
        <Routes>
          <Route element={<LocationDisplay />} path="*" />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /add .* to my list/i }));

    expect(
      await screen.findByRole('button', { name: /remove .* from my list/i }),
    ).toBeInTheDocument();
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(true);
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=test');
  });
});
