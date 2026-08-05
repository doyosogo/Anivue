import type { GraphQLError } from './types';

export type AniListRateLimitInfo = {
  retryAfter: number | null;
  limit: number | null;
  remaining: number | null;
  reset: number | null;
};

type AniListErrorOptions = {
  cause?: unknown;
  status?: number;
};

export class AniListError extends Error {
  readonly cause: unknown;
  readonly status: number | null;

  constructor(message: string, options: AniListErrorOptions = {}) {
    super(message);
    this.name = 'AniListError';
    this.cause = options.cause;
    this.status = options.status ?? null;
  }
}

export class AniListGraphQLError extends AniListError {
  readonly errors: GraphQLError[];

  constructor(errors: GraphQLError[], status?: number) {
    const [firstError] = errors;
    super(firstError?.message ?? 'AniList returned a GraphQL error.', {
      status,
    });
    this.name = 'AniListGraphQLError';
    this.errors = errors.slice(0, 3);
  }
}

export class AniListHttpError extends AniListError {
  constructor(status: number, statusText: string) {
    super(`AniList request failed with HTTP ${status} ${statusText}`.trim(), {
      status,
    });
    this.name = 'AniListHttpError';
  }
}

export class AniListRateLimitError extends AniListHttpError {
  readonly rateLimit: AniListRateLimitInfo;

  constructor(status: number, statusText: string, rateLimit: AniListRateLimitInfo) {
    super(status, statusText || 'Too Many Requests');
    this.name = 'AniListRateLimitError';
    this.rateLimit = rateLimit;
  }
}

export class AniListNetworkError extends AniListError {
  constructor(cause: unknown) {
    super('Unable to reach AniList. Check the network connection and retry.', {
      cause,
    });
    this.name = 'AniListNetworkError';
  }
}

export class AniListParseError extends AniListError {
  constructor(cause?: unknown) {
    super('AniList returned a malformed response.', { cause });
    this.name = 'AniListParseError';
  }
}

export function isAniListRateLimitError(
  error: unknown,
): error is AniListRateLimitError {
  return error instanceof AniListRateLimitError;
}

export function isAniListClientError(error: unknown): boolean {
  return error instanceof AniListError && error.status !== null && error.status < 500;
}
