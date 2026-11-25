import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { MOVIES } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface CatalogScreenProps {
  movies?: Movie[];
  favorites?: string[];
  onSelectMovie: (movie: Movie) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  movies = MOVIES,
  favorites = [],
  onSelectMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const genres = ['Все', 'Избранное', 'Фантастика', 'Драма', 'Приключения', 'Мультфильм'];

  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'Все') return true;
    if (selectedGenre === 'Избранное') return favorites.includes(m.id);
    return m.genre.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-neutral-800/80 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight">Афиша</h1>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {genres.map((g) => {
            const active = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                  active
                    ? 'bg-[#E52E84] text-white font-bold shadow-md shadow-pink-900/40'
                    : 'bg-[#222226] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {g === 'Избранное' && (
                  <Heart size={12} fill={active ? 'white' : 'none'} />
                )}
                <span>{g}</span>
                {g === 'Избранное' && favorites.length > 0 && (
                  <span className="ml-0.5 text-[10px] opacity-80">({favorites.length})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movies List */}
      <div className="p-5 space-y-4 pb-12">
        {filteredMovies.length === 0 ? (
          <div className="p-8 text-center bg-[#1A1A1E] border border-neutral-800 rounded-2xl text-xs text-neutral-400">
            {selectedGenre === 'Избранное'
              ? 'Список избранных фильмов пуст. Нажмите ❤️ на карточке фильма, чтобы сохранить его.'
              : `Фильмов в категории «${selectedGenre}» пока нет`}
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="flex gap-4 p-3 bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
            >
              <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-lg relative">
                <MoviePoster
                  movieId={movie.id}
                  posterImage={movie.posterImage}
                  title={movie.title}
                  className="w-full h-full"
                />
                {favorites.includes(movie.id) && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-[#E52E84]">
                    <Heart size={11} fill="#E52E84" />
                  </div>
                )}
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
          ))
        )}
      </div>
    </div>
  );
};
