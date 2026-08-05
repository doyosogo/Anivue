import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

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
});
