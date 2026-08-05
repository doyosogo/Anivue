import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { createAniListPageFixture } from '../services/anilist/test-fixtures';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the application shell', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(
          Response.json({
            data: createAniListPageFixture(),
          }),
        ),
      ),
    );

    render(<App />);

    expect(
      screen.getByRole('link', { name: /anivue home/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open search' }),
    ).toBeInTheDocument();
  });
});
