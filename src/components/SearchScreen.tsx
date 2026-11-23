import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
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
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5] text-[#1A1A1A]">
      {/* Top Search Header matching Figma Screen 09-10 */}
      <div className="p-5 pb-3 border-b border-[#EAE7DF] shrink-0 bg-[#FAF9F5] space-y-3">
        <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
          {query ? 'Результаты поиска' : 'Поиск'}
        </h1>

        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wider">
            Название фильма
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например, Битва моторов"
              className="w-full bg-white border border-[#EAE7DF] rounded-2xl py-3 pl-4 pr-10 text-xs text-[#1A1A1A] placeholder-[#9A9890] focus:outline-none focus:border-[#005C53] transition-colors shadow-2xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 text-[#9A9890] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Buttons row: Найти + Фильтры */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            className="py-2.5 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Search size={14} />
            <span>Найти</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="py-2.5 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-[#005C53]" />
            <span>
              {filters.genre !== 'Все' || filters.price !== 'Любая' ? 'Фильтры · акт.' : 'Фильтры'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5 flex-1">
        {/* Search History matching Figma Screen 09 */}
        {!query && history.length > 0 && (
          <div>
            <div className="text-xs font-bold text-[#7A7A7A] mb-2.5 uppercase tracking-wider">
              История поиска
            </div>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="flex items-center justify-between p-3.5 bg-white border border-[#EAE7DF] rounded-2xl text-xs text-[#1A1A1A] font-medium hover:border-[#005C53] cursor-pointer transition-colors shadow-2xs"
                >
                  <span>{item}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => removeHistoryItem(item, e)}
                      className="text-[#9A9890] hover:text-red-500 p-0.5 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                    <ChevronRight size={15} className="text-[#A09D94]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results / Recommendations matching Figma Screen 09-10 */}
        <div>
          <div className="text-xs font-bold text-[#7A7A7A] mb-3 uppercase tracking-wider">
            {query
              ? `Найдено фильмов: ${filteredMovies.length}`
              : 'Вам может понравиться'}
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-12 text-[#7A7A7A] text-xs bg-white rounded-2xl border border-[#EAE7DF] p-6">
              Ничего не найдено по вашему запросу
              <button
                onClick={() => setQuery('')}
                className="block mx-auto mt-3 px-4 py-2 bg-[#005C53] text-white rounded-xl text-xs font-bold"
              >
                Сбросить поиск
              </button>
            </div>
          ) : (
            <div className="space-y-3 pb-12">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="flex gap-3.5 p-3.5 bg-white border border-[#EAE7DF] rounded-2xl hover:border-[#005C53] transition-all cursor-pointer shadow-xs group"
                >
                  <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#EAE7DF]">
                    <MoviePoster
                      movieId={movie.id}
                      posterImage={movie.posterImage}
                      title={movie.title}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-black text-[#1A1A1A] group-hover:text-[#005C53] transition-colors leading-tight">
                      {movie.title}
                    </h3>
                    <div className="text-[11px] text-[#7A7A7A] mt-1">
                      {movie.age} · {movie.genre} · {movie.duration}
                    </div>
                    <div className="text-xs font-bold text-[#005C53] mt-2">
                      от {movie.priceFrom} ₽
                    </div>
                  </div>
                </div>
              ))}

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer mt-4"
                >
                  Сбросить поиск
                </button>
              )}
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
