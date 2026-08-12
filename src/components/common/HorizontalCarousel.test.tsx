import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HorizontalCarousel } from './HorizontalCarousel';

describe('HorizontalCarousel', () => {
  it('renders a labelled scroll region and navigation controls', () => {
    render(
      <HorizontalCarousel ariaLabel="Trending anime">
        <article>First anime</article>
        <article>Second anime</article>
      </HorizontalCarousel>,
    );

    const region = screen.getByRole('region', { name: 'Trending anime' });
    const leftButton = screen.getByRole('button', {
      name: /scroll trending anime left/i,
    });
    expect(region).toBeInTheDocument();
    expect(leftButton).toHaveAttribute('aria-controls', region.id);
    expect(
      screen.getByRole('button', { name: /scroll trending anime right/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('First anime')).toBeInTheDocument();
    expect(screen.getByText('Second anime')).toBeInTheDocument();
  });
});
