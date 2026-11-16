import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { MOVIES, SEARCH_HISTORY_ITEMS } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';
import { FilterModal } from './FilterModal';
import type { FilterState } from './FilterModal';

interface SearchScreenProps {
  onSelectMovie: (movie: Movie) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectMovie }) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(SEARCH_HISTORY_ITEMS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: 'Все',
    date: 'Сегодня',
    price: 'Любая',
  });

  const removeHistoryItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(history.filter((item) => item !== itemToRemove));
  };

  const filteredMovies = MOVIES.filter((m) => {
    const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.toLowerCase().includes(query.toLowerCase());
    
    if (filters.genre !== 'Все') {
      if (!m.genre.toLowerCase().includes(filters.genre.toLowerCase())) {
        return false;
      }
    }

    if (filters.price === 'До 500 ₽' && m.priceFrom > 500) return false;
    if (filters.price === '500 - 1 000 ₽' && (m.priceFrom < 500 || m.priceFrom > 1000)) return false;
    if (filters.price === '1 000+ ₽' && m.priceFrom < 1000) return false;

    return matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Top Search Input matching Figma Screen 4 */}
      <div className="p-5 pb-3 border-b border-neutral-800/80 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight mb-4">Поиск</h1>

        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-3 bg-[#242428] rounded-2xl border border-neutral-800 focus-within:border-[#E52E84] transition-colors">
            <Search size={18} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Фильмы"
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-11 h-11 rounded-2xl bg-[#242428] hover:bg-[#2c2c32] border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6 pb-12">
        {/* Search History Chips matching Figma Screen 4 */}
        {history.length > 0 && !query && (
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              История поиска
            </h3>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="flex items-center justify-between px-4 py-2.5 bg-[#1C1C20] hover:bg-[#25252A] rounded-xl border border-neutral-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E52E84]" />
                    <span>{item}</span>
                  </div>
                  <button
                    onClick={(e) => removeHistoryItem(item, e)}
                    className="text-neutral-500 hover:text-neutral-300 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Результаты
          </h3>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              Ничего не найдено по вашему запросу
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="flex gap-3.5 p-3 bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow">
                    <MoviePoster movieId={movie.id} className="w-full h-full" />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#E52E84] transition-colors leading-tight">
                      {movie.title}
                    </h4>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {movie.dates[0]} • {movie.genre}
                    </div>
                    <div className="text-xs font-bold text-[#E52E84] mt-1.5">
                      от {movie.priceFrom} ₽
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={(f) => setFilters(f)}
      />
    </div>
  );
};
