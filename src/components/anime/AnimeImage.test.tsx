import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AnimeImage } from './AnimeImage';

describe('AnimeImage', () => {
  it('shows a placeholder when the image src is missing', () => {
    render(<AnimeImage alt="Missing cover" src={null} />);

    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a graceful placeholder when the image fails', () => {
    render(<AnimeImage alt="Anime cover" src="https://example.com/cover.jpg" />);

    fireEvent.error(screen.getByRole('img', { name: 'Anime cover' }));

    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });

  it('fades the image in after load', () => {
    render(<AnimeImage alt="Anime cover" src="https://example.com/cover.jpg" />);

    const image = screen.getByRole('img', { name: 'Anime cover' });
    expect(image).toHaveClass('opacity-0');

    fireEvent.load(image);

    expect(image).toHaveClass('opacity-100');
  });
});
