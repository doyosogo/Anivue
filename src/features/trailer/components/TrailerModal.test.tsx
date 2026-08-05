import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import type { SupportedTrailer } from '../types';
import { TrailerModal } from './TrailerModal';

const supportedTrailer: SupportedTrailer = {
  id: 'abc123_DEF4',
  provider: 'youtube',
  thumbnail: null,
};

function TrailerModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button">
        Open trailer
      </button>
      <TrailerModal
        animeTitle="Fullmetal Alchemist: Brotherhood"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trailer={supportedTrailer}
      />
    </>
  );
}

describe('TrailerModal', () => {
  it('renders a supported official trailer iframe', async () => {
    const user = userEvent.setup();
    render(<TrailerModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open trailer' }));

    const iframe = screen.getByTitle(
      'Fullmetal Alchemist: Brotherhood official promotional trailer',
    );
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/abc123_DEF4?modestbranding=1&rel=0',
    );
  });

  it('removes the trailer iframe when closed', async () => {
    const user = userEvent.setup();
    render(<TrailerModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open trailer' }));
    expect(
      screen.getByTitle('Fullmetal Alchemist: Brotherhood official promotional trailer'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close modal/i }));

    await waitFor(() =>
      expect(
        screen.queryByTitle(
          'Fullmetal Alchemist: Brotherhood official promotional trailer',
        ),
      ).not.toBeInTheDocument(),
    );
  });
});
