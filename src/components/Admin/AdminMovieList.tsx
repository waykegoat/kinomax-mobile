import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Movie, Hall } from '../../data/mockData';
import { MoviePoster } from '../MoviePoster';

interface AdminMovieListProps {
  movies: Movie[];
  halls: Hall[];
  onAddMovieClick: () => void;
  onDeleteMovie: (id: string) => void;
}

export const AdminMovieList: React.FC<AdminMovieListProps> = ({
  movies,
  halls,
  onAddMovieClick,
  onDeleteMovie,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 text-white pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-black text-white">Репертуар кинотеатра</h2>
          <p className="text-[11px] text-neutral-400">
            {movies.length} фильмов сейчас в активном прокате
          </p>
        </div>
        <button
          onClick={onAddMovieClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005C53] hover:bg-[#046C62] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-900/40 cursor-pointer"
        >
          <Plus size={14} />
          <span>Добавить</span>
        </button>
      </div>

      {/* Movies Grid */}
      <div className="space-y-3">
        {movies.map((movie) => {
          const hall = halls.find((h) => h.id === movie.hallId);
          return (
            <div
              key={movie.id}
              className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-3.5 space-y-3 shadow-lg"
            >
              <div className="flex gap-3">
                <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-md">
                  <MoviePoster
                    movieId={movie.id}
                    posterImage={movie.posterImage}
                    title={movie.title}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-black text-white leading-tight">
                        {movie.title}
                      </h3>
                      {movies.length > 1 && (
                        <button
                          onClick={() => onDeleteMovie(movie.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Снять фильм с проката"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {movie.age} • {movie.duration}
                    </div>
                    <div className="text-[10px] text-neutral-500">{movie.genre}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2 pt-1 border-t border-neutral-800/80">
                    <span className="font-bold text-[#005C53]">от {movie.priceFrom} ₽</span>
                    {hall && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                        {hall.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Showtimes pills */}
              <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-neutral-500 font-bold self-center mr-1">
                  Сеансы:
                </span>
                {movie.showtimes.map((st, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300"
                  >
                    {st.time} ({st.format})
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
