import type {
  AniListCoverImage,
  AniListMediaFormat,
  AniListMediaStatus,
  AniListMediaTitle,
  AniListSeason,
  AniListTrailer,
} from '../../services/anilist/types';

export type MyListItem = {
  id: number;
  title: AniListMediaTitle;
  coverImage: AniListCoverImage;
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  status: AniListMediaStatus | string | null;
  format: AniListMediaFormat | string | null;
  season: AniListSeason | null;
  seasonYear: number | null;
  genres: string[];
  trailer: AniListTrailer | null;
  dateAdded: string;
};

export type MyListPersistedState = {
  items: Record<number, MyListItem>;
};
