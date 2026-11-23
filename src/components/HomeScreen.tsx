import React, { useState } from 'react';
import { Menu, MapPin } from 'lucide-react';
import { CINEMA_INFO, MOVIES } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface HomeScreenProps {
  movies?: Movie[];
  onOpenDrawer: () => void;
  onSelectMovie: (movie: Movie) => void;
  onQuickShowtime: (movie: Movie, showtime: Movie['showtimes'][0]) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  movies = MOVIES,
  onOpenDrawer,
  onSelectMovie,
  onQuickShowtime,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'cert'>('schedule');
  const [selectedDate, setSelectedDate] = useState('Сегодня');
  const [selectedFormat, setSelectedFormat] = useState('Все');

  const dateChips = ['Сегодня', 'Завтра', '23 окт.'];
  const formatChips = ['Все', '2D', 'Пушкинская карта'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Cinema Header matching Figma Screen 1 */}
      <div className="p-5 pb-4 border-b border-neutral-800/60 bg-gradient-to-b from-[#1C1C22] to-[#121214]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#E52E84] uppercase">
              {CINEMA_INFO.brand}
            </div>
            <h1 className="text-xl font-black text-white leading-tight mt-1 max-w-[260px] tracking-wide">
              КИНОМАКС-БУРЕВЕСТНИК ВЛАДИМИР
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
              <MapPin size={13} className="text-[#E52E84] shrink-0" />
              <span>{CINEMA_INFO.address}</span>
            </div>
          </div>

          <button
            onClick={onOpenDrawer}
            className="w-10 h-10 rounded-2xl bg-[#26262B] text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/40 cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {CINEMA_INFO.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider bg-[#26262C] text-neutral-300 border border-neutral-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Schedule / Gift Certificate Tabs */}
      <div className="flex border-b border-neutral-800 px-5 pt-2">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
            activeTab === 'schedule' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          РАСПИСАНИЕ
          {activeTab === 'schedule' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E52E84] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cert')}
          className={`ml-6 pb-3 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
            activeTab === 'cert' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          ПОДАРОЧНЫЙ СЕРТИФИКАТ
          {activeTab === 'cert' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E52E84] rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'cert' ? (
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-pink-950/40 border border-pink-500/30 flex items-center justify-center mx-auto mb-4 text-[#E52E84]">
            🎁
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Подарите эмоции от кино
          </h3>
          <p className="text-xs text-neutral-400 mb-6 max-w-xs mx-auto">
            Электронный подарочный сертификат на любой фильм в сети «Киномакс» во Владимире.
          </p>
          <button
            onClick={() => alert('Оформление подарочного сертификата')}
            className="px-6 py-3 bg-[#E52E84] hover:bg-[#F03A92] text-white font-bold rounded-2xl text-xs cursor-pointer shadow-lg shadow-pink-900/40"
          >
            Купить сертификат
          </button>
        </div>
      ) : (
        <>
          {/* Date Selector Pills */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {dateChips.map((d) => {
                const active = selectedDate === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#291724] border border-[#E52E84] text-white shadow-sm'
                        : 'bg-[#1C1C20] border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Filters */}
          <div className="px-5 py-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {formatChips.map((f) => {
                const active = selectedFormat === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E52E84] text-white font-bold shadow-md shadow-pink-900/40'
                        : 'bg-[#222226] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Movies Showtime Cards matching Figma Screen 1 */}
          <div className="p-5 space-y-4 pb-12">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl p-4 shadow-lg hover:border-neutral-700 transition-all"
              >
                {/* Movie card top */}
                <div
                  onClick={() => onSelectMovie(movie)}
                  className="flex gap-3.5 cursor-pointer"
                >
                  <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <MoviePoster
                      movieId={movie.id}
                      posterImage={movie.posterImage}
                      title={movie.title}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-base font-black text-white hover:text-[#E52E84] transition-colors leading-tight">
                      {movie.title}
                    </h3>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {movie.age} | {movie.duration}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {movie.genre}
                    </div>
                    <div className="text-xs font-bold text-[#E52E84] mt-2">
                      от {movie.priceFrom} ₽
                    </div>
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex flex-wrap gap-2">
                  {movie.showtimes.map((st, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickShowtime(movie, st)}
                      className="flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-xl bg-[#222226] border border-neutral-700/60 hover:border-[#E52E84] hover:bg-[#2A1D27] transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] text-neutral-400 group-hover:text-neutral-300">
                        от {st.price} ₽
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-[#E52E84] transition-colors mt-0.5">
                        {st.time}
                      </span>
                      <span className="text-[9px] font-bold text-neutral-500 group-hover:text-pink-400">
                        {st.format}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
