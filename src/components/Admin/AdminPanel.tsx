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
    <div className="flex-1 flex flex-col bg-[#0A1E22] text-white overflow-hidden animate-fade-in relative">
      {/* Top Admin Header */}
      <div className="p-4 border-b border-[#1A383D] bg-[#0E282D] shrink-0 flex items-center justify-between shadow-md">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-[#78C5BC] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>В зал</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-black text-white">
            <Shield size={16} className="text-[#005C53]" />
            <span>Панель управления</span>
          </div>
          <div className="text-[10px] text-[#A8D3CF] font-medium">
            КИНОМАКС • Буревестник Владимир
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-[#A8D3CF] hover:text-white p-1 rounded-lg bg-[#143238] transition-colors cursor-pointer"
          title="Выйти из режима администратора"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-[#1A383D] bg-[#0C2227] px-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'stats'
              ? 'border-[#005C53] text-white'
              : 'border-transparent text-[#78C5BC]/60 hover:text-white'
          }`}
        >
          <BarChart3 size={14} className={activeTab === 'stats' ? 'text-[#78C5BC]' : ''} />
          <span>Статистика</span>
        </button>

        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'movies'
              ? 'border-[#005C53] text-white'
              : 'border-transparent text-[#78C5BC]/60 hover:text-white'
          }`}
        >
          <Film size={14} className={activeTab === 'movies' ? 'text-[#78C5BC]' : ''} />
          <span>Фильмы ({movies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_movie')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'add_movie'
              ? 'border-[#005C53] text-white'
              : 'border-transparent text-[#78C5BC]/60 hover:text-white'
          }`}
        >
          <PlusCircle size={14} className={activeTab === 'add_movie' ? 'text-[#78C5BC]' : ''} />
          <span>Добавить фильм</span>
        </button>

        <button
          onClick={() => setActiveTab('halls')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'halls'
              ? 'border-[#005C53] text-white'
              : 'border-transparent text-[#78C5BC]/60 hover:text-white'
          }`}
        >
          <Layers size={14} className={activeTab === 'halls' ? 'text-[#78C5BC]' : ''} />
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
