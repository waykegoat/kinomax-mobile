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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div 
        className="w-full sm:max-w-[400px] bg-[#1a1a1e] border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 flex flex-col shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white">Фильтры</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Сбросить
          </button>
        </div>

        {/* Genres */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 block">
            Жанр
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => {
              const active = filters.genre === g;
              return (
                <button
                  key={g}
                  onClick={() => setFilters({ ...filters, genre: g })}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
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
        <div className="mt-5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 block">
            Дата
          </label>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => {
              const active = filters.date === d;
              return (
                <button
                  key={d}
                  onClick={() => setFilters({ ...filters, date: d })}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
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
        <div className="mt-5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 block">
            Цена
          </label>
          <div className="flex flex-wrap gap-2">
            {prices.map((p) => {
              const active = filters.price === p;
              return (
                <button
                  key={p}
                  onClick={() => setFilters({ ...filters, price: p })}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
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
        <div className="mt-7 pt-2">
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
          >
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};
