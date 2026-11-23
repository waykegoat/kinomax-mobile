import React, { useState } from 'react';
import { ArrowLeft, Play, X, Heart, Share2 } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState(movie.dates[0] || 'Сегодня');
  const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState(1); // default to second showtime (12:40)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const selectedShowtime = movie.showtimes[selectedShowtimeIndex] || movie.showtimes[0];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] overflow-hidden animate-fade-in relative">
      {/* Top Action Bar matching Figma Screen 13 */}
      <div className="p-4 flex items-center justify-between shrink-0 z-20 border-b border-[#EAE7DF] bg-[#FAF9F5]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-8 h-8 rounded-full bg-white border border-[#EAE7DF] flex items-center justify-center transition-colors cursor-pointer ${
              isLiked ? 'text-[#005C53]' : 'text-[#7A7A7A] hover:text-[#1A1A1A]'
            }`}
          >
            <Heart size={16} fill={isLiked ? '#005C53' : 'none'} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: movie.title, url: window.location.href }).catch(() => {});
              } else {
                alert('Ссылка на фильм скопирована');
              }
            }}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable details content matching Figma Screen 13 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Poster Banner */}
        <div className="p-5 flex gap-4 bg-white border-b border-[#EAE7DF]">
          <div className="w-28 h-40 shrink-0 shadow-md rounded-2xl overflow-hidden border border-[#EAE7DF]">
            <MoviePoster
              movieId={movie.id}
              posterImage={movie.posterImage}
              title={movie.title}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-xl font-black text-[#1A1A1A] leading-tight mb-1.5 tracking-tight">
              {movie.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="px-2 py-0.5 bg-[#FAF9F5] text-[#1A1A1A] text-[10px] font-bold rounded-md border border-[#EAE7DF]">
                {movie.age}
              </span>
              <span className="px-2 py-0.5 bg-[#FAF9F5] text-[#7A7A7A] text-[10px] font-medium rounded-md border border-[#EAE7DF]">
                {movie.duration}
              </span>
            </div>

            <div className="text-xs text-[#7A7A7A] font-medium leading-snug">
              {movie.genre}
            </div>

            <div className="mt-2 text-sm font-bold text-[#005C53]">
              от {movie.priceFrom} ₽
            </div>
          </div>
        </div>

        {/* Synopsis matching Screen 13 */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider">
            О фильме
          </div>
          <p className="text-xs text-[#4A4A4A] leading-relaxed bg-white p-4 rounded-2xl border border-[#EAE7DF] shadow-2xs">
            {movie.description}
          </p>

          {/* Button: Смотреть трейлер matching Figma Screen 13 */}
          <button
            onClick={() => setIsTrailerOpen(true)}
            className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-[#005C53] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Play size={10} fill="currentColor" className="ml-0.5" />
            </div>
            <span>Смотреть трейлер</span>
          </button>
        </div>

        {/* Date Selector */}
        <div className="px-5 mb-4">
          <div className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-2.5">
            Выберите дату
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {movie.dates.map((date) => {
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#005C53] text-white shadow-sm'
                      : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </div>

        {/* Showtimes Selector matching Figma Screen 13 */}
        <div className="px-5">
          <div className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-2.5">
            Сеансы на {selectedDate}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {movie.showtimes.map((st, idx) => {
              const isSelected = selectedShowtimeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedShowtimeIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF3F2] border-[#005C53] shadow-xs'
                      : 'bg-white border-[#EAE7DF] hover:border-[#A09D94]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-[#1A1A1A]">{st.time}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#EAE7DF] font-bold text-[#005C53]">
                      {st.format}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7A7A7A]">{st.hall}</div>
                  <div className="text-xs font-bold text-[#005C53] mt-1.5">{st.price} ₽</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between shrink-0 shadow-sm z-10">
        <div>
          <div className="text-[11px] text-[#7A7A7A]">
            {selectedDate}, {selectedShowtime.time} • {selectedShowtime.hall}
          </div>
          <div className="text-base font-black text-[#005C53]">
            {selectedShowtime.price} ₽ / билет
          </div>
        </div>

        <button
          onClick={() => onSelectSeats(selectedDate, selectedShowtime)}
          className="px-7 py-3 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-sm cursor-pointer"
        >
          Выбрать сеанс
        </button>
      </div>

      {/* Screen 14 · Трейлер Modal */}
      {isTrailerOpen && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col justify-between p-5 animate-fade-in text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">Трейлер · {movie.title}</span>
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Simulated Video Player */}
          <div className="w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-neutral-800">
            <MoviePoster
              movieId={movie.id}
              posterImage={movie.posterImage}
              title={movie.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
            />
            <div className="relative z-10 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#005C53] flex items-center justify-center text-white mx-auto shadow-xl">
                <Play size={24} fill="white" className="ml-1" />
              </div>
              <div className="text-xs font-bold text-white">Трейлер • 2 мин 12 сек</div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTrailerOpen(false);
              onSelectSeats(selectedDate, selectedShowtime);
            }}
            className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Перейти к сеансам
          </button>
        </div>
      )}
    </div>
  );
};
