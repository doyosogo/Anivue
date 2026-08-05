import { Modal } from '../../../components/common/Modal';
import { getTrailerEmbedUrl } from '../utils/trailerUtils';
import type { SupportedTrailer } from '../types';

type TrailerModalProps = {
  animeTitle: string;
  isOpen: boolean;
  onClose: () => void;
  trailer: SupportedTrailer | null;
};

export function TrailerModal({
  animeTitle,
  isOpen,
  onClose,
  trailer,
}: TrailerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${animeTitle} Trailer`}>
      {trailer === null ? (
        <p className="text-sm leading-6 text-muted">
          An official trailer is not available from a supported provider for this
          title.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-lg border border-border bg-background">
            <iframe
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={getTrailerEmbedUrl(trailer)}
              title={`${animeTitle} official promotional trailer`}
            />
          </div>
          <p className="text-xs leading-5 text-muted">
            Trailer playback uses the official provider embed when AniList
            supplies supported promotional metadata.
          </p>
        </div>
      )}
    </Modal>
  );
}
