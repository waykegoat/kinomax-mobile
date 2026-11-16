import React from 'react';

interface MoviePosterProps {
  movieId: string;
  className?: string;
  aspectRatio?: 'tall' | 'square' | 'banner';
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movieId,
  className = '',
}) => {
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
              <linearGradient id="bm-flame" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#E52E84" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <rect width="300" height="420" fill="url(#bm-grad)" />
            {/* Speed tracks & dust */}
            <path d="M 0 320 Q 150 260 300 320 L 300 420 L 0 420 Z" fill="#1c1917" />
            <path d="M 0 380 Q 150 330 300 380" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12 10" opacity="0.6" />
            {/* Sun flare */}
            <circle cx="150" cy="140" r="90" fill="#f59e0b" opacity="0.25" />
            <circle cx="150" cy="140" r="50" fill="#fde047" opacity="0.4" />
            {/* Silhouette Racers */}
            <g transform="translate(60, 90)">
              {/* Pilot 1 */}
              <circle cx="50" cy="60" r="32" fill="#292524" />
              <path d="M 32 55 Q 50 48 68 55 Q 50 68 32 55" fill="#f59e0b" />
              <path d="M 20 90 L 80 90 L 70 160 L 30 160 Z" fill="#1c1917" />
              {/* Pilot 2 */}
              <circle cx="130" cy="70" r="30" fill="#1c1917" />
              <path d="M 115 65 Q 130 58 145 65" fill="#E52E84" />
              <path d="M 100 100 L 160 100 L 150 160 L 110 160 Z" fill="#0f0e0e" />
            </g>
            {/* Motion streaks */}
            <line x1="30" y1="210" x2="270" y2="210" stroke="url(#bm-flame)" strokeWidth="3" opacity="0.8" />
            <line x1="10" y1="230" x2="290" y2="230" stroke="url(#bm-flame)" strokeWidth="1.5" opacity="0.5" />
            {/* Movie Title Header */}
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
            {/* Fog / Moon */}
            <circle cx="150" cy="110" r="70" fill="#94a3b8" opacity="0.2" />
            {/* Dark Forest Pines */}
            <g fill="#090d16">
              <polygon points="50,260 20,380 80,380" />
              <polygon points="90,230 50,380 130,380" />
              <polygon points="210,220 170,380 250,380" />
              <polygon points="250,250 220,380 280,380" />
            </g>
            {/* Mysterious glowing Apple / hands silhouette */}
            <circle cx="150" cy="240" r="28" fill="#e11d48" opacity="0.85" filter="drop-shadow(0 0 16px #e11d48)" />
            <path d="M 148 212 Q 155 205 160 215" stroke="#4ade80" strokeWidth="3" fill="none" />
            {/* Title */}
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
              <radialGradient id="kb-glow" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            <rect width="300" height="420" fill="url(#kb-grad)" />
            {/* Forest hill */}
            <path d="M 0 280 Q 150 220 300 280 L 300 420 L 0 420 Z" fill="#022c22" />
            {/* Kolobok character */}
            <circle cx="150" cy="200" r="75" fill="url(#kb-glow)" />
            {/* Eyes */}
            <circle cx="130" cy="185" r="10" fill="#451a03" />
            <circle cx="170" cy="185" r="10" fill="#451a03" />
            <circle cx="132" cy="183" r="3.5" fill="#ffffff" />
            <circle cx="172" cy="183" r="3.5" fill="#ffffff" />
            {/* Rosy cheeks */}
            <circle cx="118" cy="205" r="9" fill="#f43f5e" opacity="0.6" />
            <circle cx="182" cy="205" r="9" fill="#f43f5e" opacity="0.6" />
            {/* Big friendly Smile */}
            <path d="M 130 215 Q 150 235 170 215" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Title */}
            <text x="150" y="365" textAnchor="middle" fill="#fef08a" fontSize="30" fontWeight="900" letterSpacing="1">
              КОЛОБОК
            </text>
            <text x="150" y="390" textAnchor="middle" fill="#a7f3d0" fontSize="14" fontWeight="600">
              В КИНО С 20 ДЕКАБРЯ
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
            {/* Double suns of Arrakis */}
            <circle cx="150" cy="90" r="60" fill="#fdba74" opacity="0.4" />
            <circle cx="190" cy="70" r="30" fill="#ffedd5" opacity="0.6" />
            {/* Desert dunes curves */}
            <path d="M 0 200 Q 100 170 220 230 Q 270 250 300 240 L 300 420 L 0 420 Z" fill="#7c2d12" />
            <path d="M 0 270 Q 120 230 300 300 L 300 420 L 0 420 Z" fill="#431407" />
            {/* Silhouetted Fremen Wanderer */}
            <g transform="translate(140, 230) scale(0.6)">
              <circle cx="20" cy="15" r="10" fill="#1c1917" />
              <path d="M 10 25 L 30 25 L 38 75 L 2 75 Z" fill="#1c1917" />
              <path d="M 30 30 L 50 65 L 45 68 L 28 35 Z" fill="#1c1917" />
            </g>
            {/* Title */}
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
