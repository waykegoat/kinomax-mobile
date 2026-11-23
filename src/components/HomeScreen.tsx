import React, { useState } from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { CINEMA_INFO, MOVIES } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface HomeScreenProps {
  movies?: Movie[];
  onOpenDrawer: () => void;
  onSelectMovie: (movie: Movie) => void;
  onQuickShowtime: (movie: Movie, showtime: Movie['showtimes'][0]) => void;
  onGoAfisha?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  movies = MOVIES,
  onOpenDrawer,
  onSelectMovie,
  onQuickShowtime,
  onGoAfisha,
}) => {
  const [selectedDate, setSelectedDate] = useState('Сегодня');
  const dateChips = ['Сегодня', '27 окт.', '28 окт.', '29 окт.'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5] text-[#1A1A1A]">
      {/* Top Bar Header matching Figma Screen 01 */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between bg-[#FAF9F5] shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight leading-none">
            Главная
          </h1>
          <div className="text-[10px] font-bold tracking-widest text-[#7A7A7A] uppercase mt-1">
            {CINEMA_INFO.title}
          </div>
        </div>

        <button
          onClick={onOpenDrawer}
          className="w-10 h-10 rounded-2xl bg-white border border-[#EAE7DF] text-[#005C53] hover:bg-[#F2EFE7] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title="Открыть меню"
        >
          <Menu size={20} strokeWidth={2.4} />
        </button>
      </div>

      <div className="px-5 space-y-4 pb-12">
        {/* Hero Cinema Banner matching Figma Screen 01 */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#0B353A] via-[#0E4349] to-[#06262A] text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#005C53]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <span className="text-[9px] font-extrabold tracking-widest text-[#78C5BC] uppercase">
              {CINEMA_INFO.tagline}
            </span>
            <h2 className="text-xl font-black text-white leading-tight">
              Большое кино.<br />Рядом с вами.
            </h2>
            <p className="text-xs text-[#B5DFDA] pt-0.5">
              {CINEMA_INFO.address}
            </p>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {dateChips.map((d) => {
            const active = selectedDate === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#005C53] text-white shadow-md shadow-teal-950/20'
                    : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Section Title: Сегодня в кино */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-base font-black text-[#1A1A1A] tracking-tight">
            Сегодня в кино
          </h3>
          <button
            onClick={onGoAfisha}
            className="text-xs font-bold text-[#005C53] hover:text-[#046C62] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Вся афиша</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Movies List matching Figma Screen 01 */}
        <div className="space-y-3.5">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white border border-[#EAE7DF] rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              {/* Movie Card Top */}
              <div
                onClick={() => onSelectMovie(movie)}
                className="flex gap-3.5 cursor-pointer"
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
                  <h4 className="text-base font-black text-[#1A1A1A] leading-tight hover:text-[#005C53] transition-colors">
                    {movie.title}
                  </h4>
                  <div className="text-[11px] text-[#7A7A7A] mt-1">
                    {movie.age} · {movie.genre} · {movie.duration}
                  </div>
                  <div className="text-xs font-bold text-[#005C53] mt-2">
                    от {movie.priceFrom} ₽
                  </div>
                </div>
              </div>

              {/* Showtimes Pills */}
              <div className="pt-2 border-t border-[#F2EFE7] flex flex-wrap gap-2">
                {movie.showtimes.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuickShowtime(movie, st)}
                    className="flex flex-col items-center justify-center min-w-[72px] px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#EAE7DF] hover:border-[#005C53] hover:bg-[#EBF3F2] transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-[#7A7A7A] group-hover:text-[#005C53]">
                      от {st.price} ₽
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#005C53] transition-colors">
                      {st.time}
                    </span>
                    <span className="text-[9px] font-bold text-[#7A7A7A] group-hover:text-[#005C53]">
                      {st.format}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
