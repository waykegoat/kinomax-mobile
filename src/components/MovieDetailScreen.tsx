import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';

interface MovieDetailScreenProps {
  movie: Movie;
  onBack: () => void;
  onSelectSeats: (date: string, showtime: Movie['showtimes'][0]) => void;
}

export const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({
  movie,
  onBack,
  onSelectSeats,
}) => {
  const [selectedDate, setSelectedDate] = useState(movie.dates[0] || '22 окт');
  const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState(1); // Default 12:40 matching Figma
  const [isLiked, setIsLiked] = useState(false);

  const selectedShowtime = movie.showtimes[selectedShowtimeIndex] || movie.showtimes[0];

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white overflow-hidden animate-fade-in relative">
      {/* Top action bar */}
      <div className="p-4 flex items-center justify-between shrink-0 z-20 border-b border-neutral-800/60">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-8 h-8 rounded-full bg-[#222226] flex items-center justify-center transition-colors ${
              isLiked ? 'text-[#E52E84]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart size={16} fill={isLiked ? '#E52E84' : 'none'} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: movie.title, url: window.location.href }).catch(() => {});
              } else {
                alert('Ссылка на фильм скопирована');
              }
            }}
            className="w-8 h-8 rounded-full bg-[#222226] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable details content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Hero Poster Banner */}
        <div className="p-5 flex gap-4">
          <div className="w-28 h-40 shrink-0 shadow-xl rounded-2xl overflow-hidden border border-neutral-700/40">
            <MoviePoster movieId={movie.id} className="w-full h-full" />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-xl font-black text-white leading-tight mb-2 tracking-wide">
              {movie.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <span className="px-2 py-0.5 bg-[#26262A] text-neutral-300 text-[10px] font-bold rounded-md border border-neutral-700">
                {movie.age}
              </span>
              <span className="px-2 py-0.5 bg-[#26262A] text-neutral-300 text-[10px] font-medium rounded-md border border-neutral-700">
                {movie.duration}
              </span>
            </div>

            <div className="text-xs text-neutral-400 font-medium leading-snug">
              {movie.genre}
            </div>

            <div className="mt-2 text-xs font-bold text-[#E52E84]">
              от {movie.priceFrom} ₽
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="px-5 mb-6">
          <p className="text-xs text-neutral-300 leading-relaxed bg-[#19191C] p-3.5 rounded-2xl border border-neutral-800/80">
            {movie.description}
          </p>
        </div>

        {/* Date Selector */}
        <div className="px-5 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Выберите дату
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {movie.dates.map((d) => {
              const active = selectedDate === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium shrink-0 transition-all ${
                    active
                      ? 'bg-[#281522] border border-[#E52E84] text-white font-bold shadow-md'
                      : 'bg-[#1E1E22] border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Showtime Selector matching Figma Screen 6 */}
        <div className="px-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Выберите время
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {movie.showtimes.map((st, idx) => {
              const active = selectedShowtimeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedShowtimeIndex(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all ${
                    active
                      ? 'bg-[#221822] border-2 border-[#E52E84] shadow-md shadow-pink-950/40'
                      : 'bg-[#1C1C20] border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-[11px] text-neutral-400 mb-0.5">
                    от {st.price} ₽
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    {st.time}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-[#E52E84] font-semibold">{st.format}</span>
                    <span className="text-neutral-500">{st.hall}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA matching Figma: "Выбрать места" */}
      <div className="p-4 bg-[#18181B] border-t border-neutral-800 shrink-0">
        <button
          onClick={() => onSelectSeats(selectedDate, selectedShowtime)}
          className="w-full py-4 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
        >
          Выбрать места
        </button>
      </div>
    </div>
  );
};
