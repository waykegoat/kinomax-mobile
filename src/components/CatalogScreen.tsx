import React, { useState } from 'react';
import { MOVIES } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface CatalogScreenProps {
  movies?: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  movies = MOVIES,
  onSelectMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const genres = ['Все', 'Концерты', 'Театр', 'Кино'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-neutral-800/80 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight">Афиша</h1>

        {/* Filter chips matching Figma Screen 3 */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {genres.map((g) => {
            const active = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#E52E84] text-white font-bold shadow-md shadow-pink-900/40'
                    : 'bg-[#222226] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movies List */}
      <div className="p-5 space-y-4 pb-12">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="flex gap-4 p-3 bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
          >
            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-lg">
              <MoviePoster
                movieId={movie.id}
                posterImage={movie.posterImage}
                title={movie.title}
                className="w-full h-full"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {movie.genre}
              </span>
              <h3 className="text-base font-black text-white group-hover:text-[#E52E84] transition-colors leading-tight mt-1">
                {movie.title}
              </h3>
              <div className="text-xs text-neutral-400 mt-1">
                {movie.age} | {movie.duration}
              </div>
              <div className="text-xs font-bold text-[#E52E84] mt-2.5">
                от {movie.priceFrom} ₽
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
