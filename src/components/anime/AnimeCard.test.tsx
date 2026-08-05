import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../services/anilist/test-fixtures';
import { AnimeCard } from './AnimeCard';

describe('AnimeCard', () => {
  it('renders the preferred title fallback', () => {
    const anime = createAniListMediaFixture({
      title: {
        english: null,
        romaji: 'Romaji Fallback',
        native: 'Native Fallback',
      },
    });

    render(<AnimeCard anime={anime} />);

    expect(screen.getByText('Romaji Fallback')).toBeInTheDocument();
    expect(
      screen.getByRole('article', { name: /romaji fallback/i }),
    ).toBeInTheDocument();
  });
});
