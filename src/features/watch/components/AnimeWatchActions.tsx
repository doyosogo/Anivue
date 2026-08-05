import { Play, Video } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '../../../components/common/Button';
import { MembershipRequiredModal } from '../../membership/components/MembershipRequiredModal';
import { TrailerModal } from '../../trailer/components/TrailerModal';
import { getSupportedTrailer } from '../../trailer/utils/trailerUtils';
import type { AniListMedia } from '../../../services/anilist/types';

type WatchActionModal = 'membership' | 'trailer' | null;

type WatchNowButtonProps = {
  animeTitle: string;
  onClick: () => void;
};

type WatchTrailerButtonProps = {
  animeTitle: string;
  isSupported: boolean;
  onClick: () => void;
};

type AnimeWatchActionsProps = {
  anime: AniListMedia;
  className?: string;
};

function getWatchArtwork(anime: AniListMedia) {
  const src =
    anime.bannerImage ??
    anime.coverImage.extraLarge ??
    anime.coverImage.large ??
    anime.coverImage.medium;

  return {
    alt: `${anime.title.english ?? anime.title.romaji ?? anime.title.native ?? 'Anime'} artwork`,
    src,
  };
}

export function WatchNowButton({ animeTitle, onClick }: WatchNowButtonProps) {
  return (
    <Button aria-label={`Watch ${animeTitle} now`} onClick={onClick}>
      <Play aria-hidden="true" size={17} />
      Watch Now
    </Button>
  );
}

export function WatchTrailerButton({
  animeTitle,
  isSupported,
  onClick,
}: WatchTrailerButtonProps) {
  return (
    <Button
      aria-label={
        isSupported
          ? `Watch trailer for ${animeTitle}`
          : `Trailer unavailable for ${animeTitle}`
      }
      disabled={!isSupported}
      onClick={onClick}
      variant="secondary"
    >
      <Video aria-hidden="true" size={17} />
      Watch Trailer
    </Button>
  );
}

export function AnimeWatchActions({ anime, className = '' }: AnimeWatchActionsProps) {
  const [activeModal, setActiveModal] = useState<WatchActionModal>(null);
  const animeTitle =
    anime.title.english ?? anime.title.romaji ?? anime.title.native ?? 'this anime';
  const supportedTrailer = useMemo(
    () => getSupportedTrailer(anime.trailer),
    [anime.trailer],
  );
  const artwork = useMemo(() => getWatchArtwork(anime), [anime]);

  function openTrailerFromMembership() {
    setActiveModal('trailer');
  }

  return (
    <>
      <div className={`flex flex-wrap gap-3 ${className}`}>
        <WatchNowButton
          animeTitle={animeTitle}
          onClick={() => setActiveModal('membership')}
        />
        <WatchTrailerButton
          animeTitle={animeTitle}
          isSupported={supportedTrailer !== null}
          onClick={() => setActiveModal('trailer')}
        />
      </div>

      <MembershipRequiredModal
        animeTitle={animeTitle}
        artwork={artwork}
        hasTrailer={supportedTrailer !== null}
        isOpen={activeModal === 'membership'}
        onClose={() => setActiveModal(null)}
        onWatchTrailer={openTrailerFromMembership}
      />
      <TrailerModal
        animeTitle={animeTitle}
        isOpen={activeModal === 'trailer'}
        onClose={() => setActiveModal(null)}
        trailer={supportedTrailer}
      />
    </>
  );
}
