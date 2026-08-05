import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ANIVUE_PROTOTYPE_DISCLOSURE } from '../content/prototypeDisclosure';
import { MembershipRequiredModal } from './MembershipRequiredModal';

function MembershipModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button">
        Watch Now
      </button>
      <MembershipRequiredModal
        animeTitle="Fullmetal Alchemist: Brotherhood"
        artwork={{
          alt: 'Fullmetal Alchemist: Brotherhood artwork',
          src: 'https://example.com/banner.jpg',
        }}
        hasTrailer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onWatchTrailer={vi.fn()}
      />
    </>
  );
}

describe('MembershipRequiredModal', () => {
  it('opens with clear prototype disclosure', async () => {
    const user = userEvent.setup();
    render(<MembershipModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Watch Now' }));

    expect(
      screen.getByRole('dialog', { name: /membership required/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(ANIVUE_PROTOTYPE_DISCLOSURE)).toBeInTheDocument();
    expect(
      screen.getByText(/does not host copyrighted anime episodes/i),
    ).toBeInTheDocument();
  });

  it('closes by button', async () => {
    const user = userEvent.setup();
    render(<MembershipModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Watch Now' }));
    await user.click(screen.getByRole('button', { name: 'Close membership dialog' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: /membership required/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it('closes by Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<MembershipModalHarness />);

    const trigger = screen.getByRole('button', { name: 'Watch Now' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: /membership required/i }),
      ).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
});
