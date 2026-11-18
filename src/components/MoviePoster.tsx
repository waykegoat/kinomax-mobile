import React, { useState } from 'react';
import bitvaPoster from '../assets/bitva_motorov_poster.jpg';
import sumerkiPoster from '../assets/sumerki_poster.jpg';
import kolobokPoster from '../assets/kolobok_poster.jpg';
import dunePoster from '../assets/dune2_poster.jpg';

interface MoviePosterProps {
  movieId: string;
  className?: string;
}

const POSTER_IMAGES: Record<string, string> = {
  'bitva-motorov': bitvaPoster,
  'sumerki': sumerkiPoster,
  'kolobok': kolobokPoster,
  'dune-2': dunePoster,
};

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movieId,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const posterSrc = POSTER_IMAGES[movieId];

  if (posterSrc && !hasError) {
    return (
      <div className={`overflow-hidden rounded-xl bg-neutral-900 relative ${className}`}>
        <img
          src={posterSrc}
          alt="Постер"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover select-none block"
          loading="eager"
        />
      </div>
    );
  }

  // Fallback to stylized SVG
  return (
    <div className={`overflow-hidden rounded-xl bg-neutral-900 flex items-center justify-center text-xs font-bold text-white/50 ${className}`}>
      КИНОМАКС
    </div>
  );
};
