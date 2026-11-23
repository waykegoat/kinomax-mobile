import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  genre: string;
  date: string;
  price: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  if (!isOpen) return null;

  const genres = ['Все', 'Концерты', 'Театр', 'Кино', 'Стендап'];
  const dates = ['Сегодня', 'Эта неделя', 'Этот месяц'];
  const prices = ['Любая', 'До 500 ₽', '500 - 1 000 ₽', '1 000+ ₽'];

  const handleReset = () => {
    setFilters({
      genre: 'Все',
      date: 'Сегодня',
      price: 'Любая',
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-fade-in overflow-hidden">
      <div 
        className="w-full bg-[#1a1a1e] border-t border-neutral-800 rounded-t-3xl p-5 flex flex-col shadow-2xl animate-slide-up max-h-[88%] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-white">Фильтры</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Сбросить
          </button>
        </div>

        {/* Genres */}
        <div className="mt-4">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
            Жанр
          </label>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => {
              const active = filters.genre === g;
              return (
                <button
                  key={g}
                  onClick={() => setFilters({ ...filters, genre: g })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#E52E84] text-white shadow-md shadow-pink-900/30 font-semibold'
                      : 'bg-[#26262b] text-neutral-300 hover:bg-[#323238]'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates */}
        <div className="mt-4">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
            Дата
          </label>
          <div className="flex flex-wrap gap-1.5">
            {dates.map((d) => {
              const active = filters.date === d;
              return (
                <button
                  key={d}
                  onClick={() => setFilters({ ...filters, date: d })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#E52E84] text-white shadow-md shadow-pink-900/30 font-semibold'
                      : 'bg-[#26262b] text-neutral-300 hover:bg-[#323238]'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prices */}
        <div className="mt-4">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
            Цена
          </label>
          <div className="flex flex-wrap gap-1.5">
            {prices.map((p) => {
              const active = filters.price === p;
              return (
                <button
                  key={p}
                  onClick={() => setFilters({ ...filters, price: p })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#E52E84] text-white shadow-md shadow-pink-900/30 font-semibold'
                      : 'bg-[#26262b] text-neutral-300 hover:bg-[#323238]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply CTA */}
        <div className="mt-6 pt-2 shrink-0">
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
          >
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};
