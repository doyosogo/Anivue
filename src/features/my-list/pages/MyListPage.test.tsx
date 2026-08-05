import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../store/useMyListStore';
import { MyListPage } from './MyListPage';

function renderMyListPage() {
  return render(
    <MemoryRouter>
      <MyListPage />
    </MemoryRouter>,
  );
}

function addSavedAnime(...anime: ReturnType<typeof createAniListMediaFixture>[]) {
  act(() => {
    anime.forEach((item) => {
      useMyListStore.getState().addToMyList(item);
    });
  });
}

describe('MyListPage', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('renders saved titles', () => {
    addSavedAnime(createAniListMediaFixture());

    renderMyListPage();

    expect(screen.getByText('Fullmetal Alchemist: Brotherhood')).toBeInTheDocument();
    expect(screen.getByText(/1 saved title/i)).toBeInTheDocument();
  });

  it('renders the empty state', () => {
    renderMyListPage();

    expect(screen.getByText('Your list is empty.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse anime' })).toBeInTheDocument();
  });

  it('clears the list after confirmation', async () => {
    const user = userEvent.setup();
    addSavedAnime(createAniListMediaFixture());

    renderMyListPage();

    await user.click(screen.getByRole('button', { name: 'Clear My List' }));
    await user.click(screen.getByRole('button', { name: 'Confirm clear My List' }));

    expect(screen.getByText('Your list is empty.')).toBeInTheDocument();
  });

  it('sorts saved titles', async () => {
    const user = userEvent.setup();
    addSavedAnime(
      createAniListMediaFixture({
        id: 2,
        averageScore: 70,
        title: { english: 'Zeta', romaji: null, native: null },
      }),
      createAniListMediaFixture({
        id: 3,
        averageScore: 99,
        title: { english: 'Alpha', romaji: null, native: null },
      }),
    );

    renderMyListPage();
    await user.selectOptions(screen.getByLabelText('Sort'), 'score');

    const links = screen.getAllByRole('link', { name: /score/i });
    expect(links[0]).toHaveAccessibleName(/Alpha/);
  });
});
