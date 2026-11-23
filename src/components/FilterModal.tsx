import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

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

  const genres = ['Все', 'Приключения', 'Драма', 'Фантастика', 'Анимация'];
  const dates = ['Сегодня', '27 окт.', '28 окт.', '29 окт.'];
  const prices = ['Любая', 'До 500 ₽', '500 - 1 000 ₽', '1 000+ ₽'];

  const handleReset = () => {
    setFilters({
      genre: 'Все',
      date: 'Сегодня',
      price: 'Любая',
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-fade-in overflow-hidden">
      <div
        className="w-full bg-[#FAF9F5] border-t border-[#EAE7DF] rounded-t-3xl p-5 flex flex-col shadow-2xl animate-slide-up max-h-[90%] overflow-y-auto text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Figma Screen 11 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DF] shrink-0">
          <h3 className="text-lg font-black text-[#1A1A1A]">Фильтры</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A] flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Genre Filter */}
          <div>
            <label className="block text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
              Жанр
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => {
                const active = filters.genre === g;
                return (
                  <button
                    key={g}
                    onClick={() => setFilters({ ...filters, genre: g })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#005C53] text-white shadow-xs'
                        : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
              Дата
            </label>
            <div className="flex flex-wrap gap-2">
              {dates.map((d) => {
                const active = filters.date === d;
                return (
                  <button
                    key={d}
                    onClick={() => setFilters({ ...filters, date: d })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#005C53] text-white shadow-xs'
                        : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Tier Filter */}
          <div>
            <label className="block text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
              Стоимость билета
            </label>
            <div className="flex flex-wrap gap-2">
              {prices.map((p) => {
                const active = filters.price === p;
                return (
                  <button
                    key={p}
                    onClick={() => setFilters({ ...filters, price: p })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#005C53] text-white shadow-xs'
                        : 'bg-white border border-[#EAE7DF] text-[#7A7A7A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-3 border-t border-[#EAE7DF] flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-white border border-[#EAE7DF] hover:border-[#7A7A7A] text-[#1A1A1A] font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Сбросить
          </button>
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-1 py-3 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check size={15} />
            <span>Применить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
