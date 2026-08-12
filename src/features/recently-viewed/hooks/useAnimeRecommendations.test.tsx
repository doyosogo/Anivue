import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createAniListMediaFixture,
} from '../../../services/anilist/test-fixtures';
import { getValidRecommendationMedia, useAnimeRecommendations } from './useAnimeRecommendations';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function mockRecommendationsResponse() {
  return Response.json({
    data: {
      Media: {
        id: 1,
        recommendations: {
          nodes: [
            {
              id: 1,
              rating: 90,
              mediaRecommendation: createAniListMediaFixture({
                id: 2,
                title: { english: 'Recommended One', romaji: null, native: null },
              }),
            },
          ],
        },
      },
    },
  });
}

describe('useAnimeRecommendations', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is disabled when history is empty', () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    renderHook(() => useAnimeRecommendations(null, { enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the most recent anime ID in the recommendation request', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(mockRecommendationsResponse());
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useAnimeRecommendations(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('"id":1');
    expect(result.current.recommendations[0]?.id).toBe(2);
  });

  it('filters seed, adult, duplicate, and null recommendation results', () => {
    const filtered = getValidRecommendationMedia(1, [
      createAniListMediaFixture({ id: 1 }),
      createAniListMediaFixture({ id: 2, isAdult: true }),
      createAniListMediaFixture({ id: 3 }),
      createAniListMediaFixture({ id: 3 }),
    ]);

    expect(filtered.map((item) => item.id)).toEqual([3]);
  });
});
