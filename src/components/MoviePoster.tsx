import React, { useState } from 'react';
import bitvaPoster from '../assets/bitva_motorov_poster.jpg';
import sumerkiPoster from '../assets/sumerki_poster.jpg';
import kolobokPoster from '../assets/kolobok_poster.jpg';
import dunePoster from '../assets/dune2_poster.jpg';
import { Film } from 'lucide-react';

interface MoviePosterProps {
  movieId?: string;
  posterImage?: string;
  title?: string;
  className?: string;
}

export const POSTER_PRESETS: Record<string, string> = {
  'bitva-motorov': bitvaPoster,
  'sumerki': sumerkiPoster,
  'kolobok': kolobokPoster,
  'dune-2': dunePoster,
};

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movieId,
  posterImage,
  title,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Priority: 1. explicit posterImage prop, 2. preset from movieId
  const posterSrc = posterImage || (movieId ? POSTER_PRESETS[movieId] : undefined);

  if (posterSrc && !hasError) {
    return (
      <div className={`overflow-hidden rounded-xl bg-neutral-900 relative ${className}`}>
        <img
          src={posterSrc}
          alt={title || 'Постер'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover select-none block"
          loading="eager"
        />
      </div>
    );
  }

  // Fallback to stylized cinema poster with movie title
  return (
    <div
      className={`overflow-hidden rounded-xl bg-gradient-to-br from-[#2a1727] via-[#1c1a24] to-[#121216] border border-pink-500/20 flex flex-col items-center justify-center p-2 text-center relative ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-[#E52E84]/20 flex items-center justify-center text-[#E52E84] mb-1.5 shrink-0">
        <Film size={16} />
      </div>
      <span className="text-[10px] font-black tracking-wide text-white/90 line-clamp-2 uppercase">
        {title || 'КИНОМАКС'}
      </span>
      <span className="text-[8px] font-bold text-[#E52E84] mt-0.5 tracking-widest">
        ПРЕМЬЕРА
      </span>
    </div>
  );
};
