import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../store/useMyListStore';
import { MyListButton } from './MyListButton';

describe('MyListButton', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('updates label and state when toggled', async () => {
    const user = userEvent.setup();
    const anime = createAniListMediaFixture();

    render(<MyListButton anime={anime} />);

    await user.click(screen.getByRole('button', { name: /add .* to my list/i }));
    expect(
      await screen.findByRole('button', { name: /remove .* from my list/i }),
    ).toBeInTheDocument();
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(true);

    await user.click(screen.getByRole('button', { name: /remove .* from my list/i }));
    expect(
      await screen.findByRole('button', { name: /add .* to my list/i }),
    ).toBeInTheDocument();
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(false);
  });
});
