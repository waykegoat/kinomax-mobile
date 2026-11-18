import React, { useState } from 'react';
import { MOVIES } from '../data/mockData';

interface MoviePosterProps {
  movieId: string;
  className?: string;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movieId,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const movie = MOVIES.find((m) => m.id === movieId);
  const posterSrc = movie?.posterImage;

  if (posterSrc && !imgError) {
    return (
      <div className={`overflow-hidden rounded-xl bg-neutral-900 relative ${className}`}>
        <img
          src={posterSrc}
          alt={movie?.title || 'Постер фильма'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />
      </div>
    );
  }

  const getPosterContent = () => {
    switch (movieId) {
      case 'bitva-motorov':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bm-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="40%" stopColor="#78350f" />
                <stop offset="70%" stopColor="#292524" />
                <stop offset="100%" stopColor="#0c0a09" />
              </linearGradient>
            </defs>
            <rect width="300" height="420" fill="url(#bm-grad)" />
            <circle cx="150" cy="140" r="90" fill="#f59e0b" opacity="0.25" />
            <text x="150" y="360" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" letterSpacing="2">
              БИТВА
            </text>
            <text x="150" y="390" textAnchor="middle" fill="#f59e0b" fontSize="26" fontWeight="900" letterSpacing="3">
              МОТОРОВ
            </text>
          </svg>
        );

      case 'sumerki':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="sum-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="300" height="420" fill="url(#sum-grad)" />
            <circle cx="150" cy="110" r="70" fill="#94a3b8" opacity="0.2" />
            <text x="150" y="375" textAnchor="middle" fill="#f8fafc" fontSize="28" fontFamily="serif" letterSpacing="4">
              СУМЕРКИ
            </text>
          </svg>
        );

      case 'kolobok':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="kb-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="40%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>
            <rect width="300" height="420" fill="url(#kb-grad)" />
            <text x="150" y="365" textAnchor="middle" fill="#fef08a" fontSize="30" fontWeight="900" letterSpacing="1">
              КОЛОБОК
            </text>
          </svg>
        );

      case 'dune-2':
        return (
          <svg viewBox="0 0 300 420" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="dune-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#431407" />
                <stop offset="50%" stopColor="#9a3412" />
                <stop offset="85%" stopColor="#7c2d12" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
            </defs>
            <rect width="300" height="420" fill="url(#dune-grad)" />
            <circle cx="150" cy="90" r="60" fill="#fdba74" opacity="0.4" />
            <text x="150" y="370" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="800" letterSpacing="4">
              ДЮНА: ЧАСТЬ 2
            </text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white font-bold">
            КИНОМАКС
          </div>
        );
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl bg-neutral-900 ${className}`}>
      {getPosterContent()}
    </div>
  );
};
