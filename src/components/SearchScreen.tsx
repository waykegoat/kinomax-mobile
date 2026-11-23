import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { MOVIES, SEARCH_HISTORY_ITEMS } from '../data/mockData';
import type { Movie } from '../data/mockData';
import { MoviePoster } from './MoviePoster';
import { FilterModal } from './FilterModal';
import type { FilterState } from './FilterModal';

interface SearchScreenProps {
  movies?: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  movies = MOVIES,
  onSelectMovie,
}) => {
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

  const filteredMovies = movies.filter((m) => {
    const matchesQuery =
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.toLowerCase().includes(query.toLowerCase());

    if (filters.genre !== 'Все') {
      if (!m.genre.toLowerCase().includes(filters.genre.toLowerCase())) {
        return false;
      }
    }

    if (filters.price === 'До 500 ₽' && m.priceFrom > 500) return false;
    if (filters.price === '500 - 1 000 ₽' && (m.priceFrom < 500 || m.priceFrom > 1000))
      return false;
    if (filters.price === '1 000+ ₽' && m.priceFrom < 1000) return false;

    return matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Top Search Input matching Figma Screen 4 */}
      <div className="p-5 pb-3 border-b border-neutral-800/80 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight mb-4">Поиск</h1>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Фильмы, персоны, кинотеатры"
              className="w-full bg-[#1C1C20] border border-neutral-700/60 rounded-2xl py-3 pl-10 pr-10 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#E52E84] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-11 h-11 rounded-2xl bg-[#1C1C20] border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#E52E84] transition-colors shrink-0 cursor-pointer"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5 flex-1">
        {/* Search History */}
        {!query && history.length > 0 && (
          <div>
            <div className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">
              Вы недавно искали
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1C20] border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 cursor-pointer transition-colors"
                >
                  <span>{item}</span>
                  <button
                    onClick={(e) => removeHistoryItem(item, e)}
                    className="text-neutral-500 hover:text-neutral-300 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">
            {query ? `Найдено: ${filteredMovies.length}` : 'Рекомендуем посмотреть'}
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              Ничего не найдено по вашему запросу
            </div>
          ) : (
            <div className="space-y-3 pb-12">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="flex gap-3.5 p-3 bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <MoviePoster
                      movieId={movie.id}
                      posterImage={movie.posterImage}
                      title={movie.title}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-black text-white group-hover:text-[#E52E84] transition-colors leading-tight">
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={(f: FilterState) => setFilters(f)}
      />
    </div>
  );
};
