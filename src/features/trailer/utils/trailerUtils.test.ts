import { describe, expect, it } from 'vitest';

import {
  getSupportedTrailer,
  getTrailerEmbedUrl,
  getTrailerThumbnail,
  isTrailerSupported,
} from './trailerUtils';

describe('trailerUtils', () => {
  it('produces a privacy-conscious embed URL for supported YouTube trailers', () => {
    const trailer = getSupportedTrailer({
      id: 'abc123_DEF4',
      site: 'youtube',
      thumbnail: 'https://example.com/trailer.jpg',
    });

    expect(trailer).toEqual({
      id: 'abc123_DEF4',
      provider: 'youtube',
      thumbnail: 'https://example.com/trailer.jpg',
    });
    expect(trailer === null ? null : getTrailerEmbedUrl(trailer)).toBe(
      'https://www.youtube-nocookie.com/embed/abc123_DEF4?modestbranding=1&rel=0',
    );
  });

  it('rejects unsupported trailer providers', () => {
    expect(
      isTrailerSupported({
        id: 'abc123_DEF4',
        site: 'vimeo',
        thumbnail: null,
      }),
    ).toBe(false);
  });

  it('rejects missing, malformed, or URL-like IDs', () => {
    expect(
      isTrailerSupported({ id: null, site: 'youtube', thumbnail: null }),
    ).toBe(false);
    expect(
      isTrailerSupported({ id: 'short', site: 'youtube', thumbnail: null }),
    ).toBe(false);
    expect(
      isTrailerSupported({
        id: 'https://youtube.com/watch?v=abc123_DEF4',
        site: 'youtube',
        thumbnail: null,
      }),
    ).toBe(false);
  });

  it('returns a thumbnail only for supported trailers', () => {
    expect(
      getTrailerThumbnail({
        id: 'abc123_DEF4',
        site: 'youtube',
        thumbnail: 'https://example.com/thumb.jpg',
      }),
    ).toBe('https://example.com/thumb.jpg');
    expect(
      getTrailerThumbnail({
        id: 'invalid',
        site: 'youtube',
        thumbnail: 'https://example.com/thumb.jpg',
      }),
    ).toBeNull();
  });
});
