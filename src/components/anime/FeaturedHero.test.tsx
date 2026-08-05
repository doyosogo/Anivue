import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../services/anilist/test-fixtures';
import { FeaturedHero } from './FeaturedHero';
import { stripAniListHtml } from './featuredHeroUtils';

describe('FeaturedHero', () => {
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

    render(<FeaturedHero anime={anime} />);

    expect(screen.getByTestId('featured-hero-background')).toHaveStyle({
      backgroundImage: 'url(https://example.com/fallback-cover.jpg)',
    });
  });

  it('opens the membership modal from Watch Now', async () => {
    const user = userEvent.setup();
    render(<FeaturedHero anime={createAniListMediaFixture()} />);

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

    render(<FeaturedHero anime={anime} />);

    expect(
      screen.getByRole('button', { name: /trailer unavailable/i }),
    ).toBeDisabled();
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
