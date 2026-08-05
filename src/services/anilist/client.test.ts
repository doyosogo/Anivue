import { describe, expect, it, vi, afterEach } from 'vitest';

import { requestAniListPage } from './client';
import {
  AniListGraphQLError,
  AniListHttpError,
  AniListParseError,
  AniListRateLimitError,
} from './errors';
import { createAniListPageFixture } from './test-fixtures';

const TEST_QUERY = 'query Test($page: Int!) { Page(page: $page) { pageInfo { total } } }';

function mockFetchResponse(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('requestAniListPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a validated page for a successful response', async () => {
    const fixture = createAniListPageFixture();
    const fetchMock = mockFetchResponse(
      Response.json({
        data: fixture,
      }),
    );

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).resolves.toEqual(fixture);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://graphql.anilist.co',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('throws a GraphQL error from a successful HTTP response', async () => {
    mockFetchResponse(
      Response.json({
        errors: [{ message: 'Variable page is invalid.' }],
      }),
    );

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).rejects.toBeInstanceOf(AniListGraphQLError);
  });

  it('throws an HTTP error for an ordinary failed response', async () => {
    mockFetchResponse(new Response('Server error', { status: 500 }));

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).rejects.toBeInstanceOf(AniListHttpError);
  });

  it('preserves rate-limit status and headers', async () => {
    mockFetchResponse(
      new Response('Too many requests', {
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '90',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '120',
        },
        status: 429,
        statusText: 'Too Many Requests',
      }),
    );

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).rejects.toMatchObject({
      rateLimit: {
        retryAfter: 60,
        limit: 90,
        remaining: 0,
        reset: 120,
      },
      status: 429,
    });
  });

  it('throws a parse error for malformed JSON', async () => {
    mockFetchResponse(new Response('not json', { status: 200 }));

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).rejects.toBeInstanceOf(AniListParseError);
  });

  it('uses the rate-limit error class for 429 responses', async () => {
    mockFetchResponse(new Response('Too many requests', { status: 429 }));

    await expect(
      requestAniListPage({
        query: TEST_QUERY,
        variables: { page: 1 },
      }),
    ).rejects.toBeInstanceOf(AniListRateLimitError);
  });
});
