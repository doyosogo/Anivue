import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { createAniListMediaFixture } from '../../services/anilist/test-fixtures';
import { resetMyListStoreForTest, useMyListStore } from '../../features/my-list/store/useMyListStore';
import { Navbar } from './Navbar';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar />
      <Routes>
        <Route element={<LocationDisplay />} path="*" />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Navbar search', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    act(() => {
      resetMyListStoreForTest();
    });
    window.localStorage.clear();
  });

  it('navigates after debounced search input', async () => {
    const user = userEvent.setup();

    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    await user.type(screen.getByLabelText('Search anime'), 'naruto');

    expect(screen.getByTestId('location')).toHaveTextContent('/');
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/search?q=naruto',
      ),
    );
  });

  it('navigates immediately when Enter is pressed', async () => {
    const user = userEvent.setup();

    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    await user.type(screen.getByLabelText('Search anime'), 'bleach{Enter}');

    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=bleach');
  });

  it('shows the saved My List count', () => {
    act(() => {
      useMyListStore.getState().addToMyList(createAniListMediaFixture());
    });

    renderNavbar();

    expect(screen.getByRole('link', { name: /my list, 1 saved/i })).toBeInTheDocument();
  });

  it('closes desktop search with Escape and restores trigger focus', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === '(min-width: 768px)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
    const user = userEvent.setup();

    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open search' })).toHaveFocus(),
    );
  });
});
