import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MOVIES } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface CatalogScreenProps {
  movies?: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onGoSearch?: () => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  movies = MOVIES,
  onSelectMovie,
  onGoSearch,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Все');
  const [selectedDate, setSelectedDate] = useState('Сегодня');

  const filterTabs = ['Все', 'Сейчас', 'Скоро'];
  const dateChips = ['Сегодня', '27 окт.', '28 окт.', '29 окт.'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5] text-[#1A1A1A]">
      {/* Header matching Figma Screen 12 */}
      <div className="p-5 pb-3 border-b border-[#EAE7DF] shrink-0 bg-[#FAF9F5]">
        <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Афиша</h1>

        {/* Filter chips: Все, Сейчас, Скоро */}
        <div className="flex items-center gap-2 mt-3">
          {filterTabs.map((tab) => {
            const active = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#005C53] text-white shadow-sm'
                    : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-3">
          {dateChips.map((d) => {
            const active = selectedDate === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#EBF3F2] border border-[#005C53] text-[#005C53] font-bold'
                    : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movies List matching Figma Screen 12 */}
      <div className="p-5 space-y-3.5 pb-20">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="flex gap-4 p-3.5 bg-white border border-[#EAE7DF] rounded-2xl hover:border-[#005C53] transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#EAE7DF]">
              <MoviePoster
                movieId={movie.id}
                posterImage={movie.posterImage}
                title={movie.title}
                className="w-full h-full"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider">
                {movie.genre}
              </span>
              <h3 className="text-base font-black text-[#1A1A1A] group-hover:text-[#005C53] transition-colors leading-tight mt-1">
                {movie.title}
              </h3>
              <div className="text-xs text-[#7A7A7A] mt-1">
                {movie.age} · {movie.duration}
              </div>
              <div className="text-xs font-bold text-[#005C53] mt-2.5">
                от {movie.priceFrom} ₽
              </div>
            </div>
          </div>
        ))}

        {onGoSearch && (
          <button
            onClick={onGoSearch}
            className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <Search size={15} className="text-[#005C53]" />
            <span>Найти фильм</span>
          </button>
        )}
      </div>
    </div>
  );
};
