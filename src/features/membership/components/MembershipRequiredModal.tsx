import { useState } from 'react';
import { Check, Lock, Video } from 'lucide-react';

import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import {
  MEMBERSHIP_FEATURE_PREVIEW,
  ANIVUE_PROTOTYPE_DISCLOSURE,
} from '../content/prototypeDisclosure';
import type { MembershipModalArtwork } from '../types';

type MembershipRequiredModalProps = {
  animeTitle: string;
  artwork?: MembershipModalArtwork;
  hasTrailer?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onWatchTrailer?: () => void;
};

export function MembershipRequiredModal({
  animeTitle,
  artwork,
  hasTrailer = false,
  isOpen,
  onClose,
  onWatchTrailer,
}: MembershipRequiredModalProps) {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Membership required">
      <div className="overflow-hidden rounded-lg border border-border bg-background/55">
        {artwork?.src !== null && artwork?.src !== undefined ? (
          <div className="relative h-36 overflow-hidden">
            <img
              alt={artwork.alt}
              className="h-full w-full object-cover opacity-45 blur-sm scale-105"
              src={artwork.src}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : null}

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/15 text-accent">
              <Lock aria-hidden="true" size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                Anivue prototype
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-foreground">
                {animeTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                This title is reserved for Anivue members. Membership
                registration and episode playback are intentionally unavailable
                in this portfolio prototype.
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted">
            Anivue does not host copyrighted anime episodes. This interface
            demonstrates a possible premium streaming flow, while official
            trailers may still be available separately.
          </p>

          <div aria-label="Conceptual membership feature preview" className="grid gap-2 sm:grid-cols-2">
            {MEMBERSHIP_FEATURE_PREVIEW.map((feature) => (
              <div
                className="flex items-center gap-2 rounded-md border border-white/10 bg-surface/70 px-3 py-2 text-sm text-foreground"
                key={feature}
              >
                <Check aria-hidden="true" className="text-accent" size={15} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {isInfoVisible ? (
            <div className="rounded-md border border-accent/25 bg-accent/10 p-3 text-sm leading-6 text-muted">
              Membership registration, payment, and activation are not
              implemented. The locked state is included to communicate product
              direction without creating a real subscription flow.
            </div>
          ) : null}

          <p className="text-xs leading-5 text-muted">
            {ANIVUE_PROTOTYPE_DISCLOSURE}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              aria-label="Explain why membership is unavailable"
              onClick={() => setIsInfoVisible((value) => !value)}
            >
              <Lock aria-hidden="true" size={16} />
              Membership Unavailable
            </Button>
            {hasTrailer && onWatchTrailer !== undefined ? (
              <Button
                aria-label={`Watch official trailer for ${animeTitle}`}
                onClick={onWatchTrailer}
                variant="secondary"
              >
                <Video aria-hidden="true" size={16} />
                Watch Trailer
              </Button>
            ) : null}
            <Button aria-label="Close membership dialog" onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
