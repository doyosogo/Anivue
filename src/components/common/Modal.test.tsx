import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  it('closes when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /close modal/i })).toHaveFocus(),
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('restores focus to the trigger when closed', async () => {
    const user = userEvent.setup();

    function ModalHarness() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)} type="button">
            Open modal
          </button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Focus Modal"
          >
            <p>Modal content</p>
          </Modal>
        </>
      );
    }

    render(<ModalHarness />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /close modal/i }));

    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
