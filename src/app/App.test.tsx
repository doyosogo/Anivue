import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('renders the application shell', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /anivue home/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});
