import { memo, useState } from 'react';

type AnimeImageProps = {
  alt: string;
  src: string | null;
  aspectRatio?: string;
  className?: string;
};

export const AnimeImage = memo(function AnimeImage({
  alt,
  aspectRatio = '2 / 3',
  className = '',
  src,
}: AnimeImageProps) {
  const [status, setStatus] = useState<'idle' | 'loaded' | 'error'>('idle');
  const canShowImage = src !== null && status !== 'error';

  return (
    <div
      className={`relative overflow-hidden bg-elevated ${className}`}
      style={{ aspectRatio }}
    >
      {canShowImage ? (
        <img
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onError={() => setStatus('error')}
          onLoad={() => setStatus('loaded')}
          src={src}
        />
      ) : null}

      {status !== 'loaded' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-elevated px-4 text-center text-sm text-muted">
          {status === 'error' || src === null ? 'Image unavailable' : 'Loading'}
        </div>
      ) : null}
    </div>
  );
});
