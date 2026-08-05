import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAnimeSearch } from './useAnimeSearch';
import { parseSearchUrlState } from '../utils/searchUrlState';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAnimeSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not execute a text-only query below the minimum length', () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    renderHook(
      () => useAnimeSearch(parseSearchUrlState(new URLSearchParams('q=n'))),
      { wrapper },
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
