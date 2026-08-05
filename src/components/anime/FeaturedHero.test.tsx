import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../../features/my-list/store/useMyListStore';
import { FeaturedHero } from './FeaturedHero';
import { stripAniListHtml } from './featuredHeroUtils';

function renderFeaturedHero(anime: ReturnType<typeof createAniListMediaFixture>) {
  return render(
    <MemoryRouter>
      <FeaturedHero anime={anime} />
    </MemoryRouter>,
  );
}

describe('FeaturedHero', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('falls back to cover art when the banner image is unavailable', () => {
    const anime = createAniListMediaFixture({
      bannerImage: null,
      coverImage: {
        extraLarge: 'https://example.com/fallback-cover.jpg',
        large: null,
        medium: null,
        color: null,
      },
    });

    renderFeaturedHero(anime);

    expect(screen.getByTestId('featured-hero-background')).toHaveStyle({
      backgroundImage: 'url(https://example.com/fallback-cover.jpg)',
    });
  });

  it('opens the membership modal from Watch Now', async () => {
    const user = userEvent.setup();
    renderFeaturedHero(createAniListMediaFixture());

    await user.click(screen.getByRole('button', { name: /watch .* now/i }));

    expect(
      screen.getByRole('dialog', { name: 'Membership Required' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/intentionally unavailable in this portfolio prototype/i),
    ).toBeInTheDocument();
  });

  it('disables the trailer button when no trailer is available', () => {
    const anime = createAniListMediaFixture({ trailer: null });

    renderFeaturedHero(anime);

    expect(
      screen.getByRole('button', { name: /trailer unavailable/i }),
    ).toBeDisabled();
  });

  it('adds the featured anime to My List', async () => {
    const user = userEvent.setup();
    const anime = createAniListMediaFixture();

    renderFeaturedHero(anime);

    await user.click(screen.getByRole('button', { name: /add .* to my list/i }));

    expect(
      await screen.findByRole('button', { name: /remove .* from my list/i }),
    ).toBeInTheDocument();
    expect(useMyListStore.getState().isInMyList(anime.id)).toBe(true);
  });
});

describe('stripAniListHtml', () => {
  it('removes HTML from AniList descriptions', () => {
    expect(
      stripAniListHtml(
        'A <strong>bold</strong> story.<br>Second&nbsp;line with <i>style</i>.',
      ),
    ).toBe('A bold story. Second line with style.');
  });
});
