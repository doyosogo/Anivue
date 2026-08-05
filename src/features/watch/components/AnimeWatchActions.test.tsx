import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { createAniListMediaFixture } from '../../../services/anilist/test-fixtures';
import { AnimeWatchActions } from './AnimeWatchActions';

describe('AnimeWatchActions', () => {
  it('opens the shared membership modal from Watch Now', async () => {
    const user = userEvent.setup();
    render(<AnimeWatchActions anime={createAniListMediaFixture()} />);

    await user.click(screen.getByRole('button', { name: /watch .* now/i }));

    expect(
      screen.getByRole('dialog', { name: /membership required/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/membership registration and episode playback/i),
    ).toBeInTheDocument();
  });

  it('opens the shared trailer modal for supported trailers', async () => {
    const user = userEvent.setup();
    render(<AnimeWatchActions anime={createAniListMediaFixture()} />);

    await user.click(screen.getByRole('button', { name: /watch trailer/i }));

    expect(
      screen.getByTitle(
        'Fullmetal Alchemist: Brotherhood official promotional trailer',
      ),
    ).toBeInTheDocument();
  });

  it('disables trailer controls when unavailable', () => {
    render(
      <AnimeWatchActions
        anime={createAniListMediaFixture({
          trailer: {
            id: 'invalid',
            site: 'youtube',
            thumbnail: null,
          },
        })}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: /trailer unavailable for fullmetal alchemist/i,
      }),
    ).toBeDisabled();
  });

  it('switches from membership modal to trailer modal without nesting dialogs', async () => {
    const user = userEvent.setup();
    render(<AnimeWatchActions anime={createAniListMediaFixture()} />);

    await user.click(screen.getByRole('button', { name: /watch .* now/i }));
    await user.click(
      screen.getByRole('button', {
        name: /watch official trailer for fullmetal alchemist/i,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /membership required/i })).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('dialog', {
        name: /fullmetal alchemist: brotherhood trailer/i,
      }),
    ).toBeInTheDocument();
  });
});
