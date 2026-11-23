import React, { useState } from 'react';
import {
  Shield,
  Film,
  PlusCircle,
  Layers,
  BarChart3,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import type { Movie, Hall, PurchaseStats } from '../../data/mockData';
import { AdminMovieList } from './AdminMovieList';
import { AdminAddMovie } from './AdminAddMovie';
import { AdminHalls } from './AdminHalls';
import { AdminStats } from './AdminStats';

interface AdminPanelProps {
  movies: Movie[];
  halls: Hall[];
  stats: PurchaseStats;
  onUpdateMovies: (movies: Movie[]) => void;
  onUpdateHalls: (halls: Hall[]) => void;
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  movies,
  halls,
  stats,
  onUpdateMovies,
  onUpdateHalls,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'add_movie' | 'halls' | 'stats'>('stats');

  const handleAddMovie = (newMovie: Movie) => {
    onUpdateMovies([newMovie, ...movies]);
    setActiveTab('movies');
  };

  const handleDeleteMovie = (id: string) => {
    onUpdateMovies(movies.filter((m) => m.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white overflow-hidden animate-fade-in relative">
      {/* Top Admin Header */}
      <div className="p-4 border-b border-neutral-800/80 bg-[#16161A] shrink-0 flex items-center justify-between shadow-md">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>В зал</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-black text-white">
            <Shield size={16} className="text-[#E52E84]" />
            <span>Панель управления</span>
          </div>
          <div className="text-[10px] text-neutral-400 font-medium">
            Киномакс-Буревестник Владимир
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-800/60 transition-colors"
          title="Выйти из режима администратора"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-neutral-800 bg-[#18181D] px-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'stats'
              ? 'border-[#E52E84] text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart3 size={14} className={activeTab === 'stats' ? 'text-[#E52E84]' : ''} />
          <span>Статистика</span>
        </button>

        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'movies'
              ? 'border-[#E52E84] text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Film size={14} className={activeTab === 'movies' ? 'text-[#E52E84]' : ''} />
          <span>Фильмы ({movies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_movie')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'add_movie'
              ? 'border-[#E52E84] text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <PlusCircle size={14} className={activeTab === 'add_movie' ? 'text-[#E52E84]' : ''} />
          <span>Добавить фильм</span>
        </button>

        <button
          onClick={() => setActiveTab('halls')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'halls'
              ? 'border-[#E52E84] text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers size={14} className={activeTab === 'halls' ? 'text-[#E52E84]' : ''} />
          <span>Залы ({halls.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'stats' && <AdminStats stats={stats} />}

        {activeTab === 'movies' && (
          <AdminMovieList
            movies={movies}
            halls={halls}
            onAddMovieClick={() => setActiveTab('add_movie')}
            onDeleteMovie={handleDeleteMovie}
          />
        )}

        {activeTab === 'add_movie' && (
          <AdminAddMovie
            halls={halls}
            existingMovies={movies}
            onAddMovie={handleAddMovie}
            onCancel={() => setActiveTab('movies')}
          />
        )}

        {activeTab === 'halls' && (
          <AdminHalls halls={halls} onUpdateHalls={onUpdateHalls} />
        )}
      </div>
    </div>
  );
};
