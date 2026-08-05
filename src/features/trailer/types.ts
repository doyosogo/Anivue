import type { AniListTrailer } from '../../services/anilist/types';

export type SupportedTrailerProvider = 'youtube';

export type SupportedTrailer = {
  id: string;
  provider: SupportedTrailerProvider;
  thumbnail: string | null;
};

export type TrailerSource = AniListTrailer | null | undefined;
