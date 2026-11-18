import React, { useState, useEffect } from 'react';
import { MOVIES, INITIAL_TICKETS } from './data/mockData';
import type { Movie, Ticket } from './data/mockData';
import { MobileStatusBar } from './components/MobileStatusBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { SearchScreen } from './components/SearchScreen';
import { TicketsScreen } from './components/TicketsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SideDrawer } from './components/SideDrawer';
import { MovieDetailScreen } from './components/MovieDetailScreen';
import { SeatSelectionScreen } from './components/SeatSelectionScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { AuthScreens } from './components/AuthScreens';
import { Smartphone, Monitor } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'catalog' | 'tickets' | 'profile'>('home');
  const [overlayScreen, setOverlayScreen] = useState<
    null | 'movie_detail' | 'seat_selection' | 'payment' | 'auth'
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOVIES[0]);
  const [selectedDate, setSelectedDate] = useState('22 окт');
  const [selectedShowtime, setSelectedShowtime] = useState(MOVIES[0].showtimes[1]); // 12:40
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['5-4', '5-5']);
  const [bookingTotalPrice, setBookingTotalPrice] = useState(840);

  // User State
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: 'Иван Петров',
    email: 'ivan@mail.ru',
  });

  // Tickets State (persisted in localStorage)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('kinomax_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kinomax_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Frame Display Mode (Device frame vs Full screen)
  const [frameMode, setFrameMode] = useState<'device' | 'fluid'>('device');

  // Handlers
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(movie.showtimes[0]);
    setOverlayScreen('movie_detail');
  };

  const handleQuickShowtime = (movie: Movie, showtime: Movie['showtimes'][0]) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setSelectedDate('22 окт');
    setOverlayScreen('seat_selection');
  };

  const handleSelectSeatsFromDetail = (date: string, showtime: Movie['showtimes'][0]) => {
    setSelectedDate(date);
    setSelectedShowtime(showtime);
    setOverlayScreen('seat_selection');
  };

  const handleProceedToPayment = (seats: string[], total: number) => {
    setSelectedSeats(seats);
    setBookingTotalPrice(total);
    setOverlayScreen('payment');
  };

  const handlePaymentSuccess = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
  };

  const handleRefundTicket = (ticketId: string) => {
    setTickets(tickets.filter((t) => t.id !== ticketId));
  };

  const handleTabChange = (tabId: string) => {
    setOverlayScreen(null);
    setCurrentTab(tabId as any);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center relative p-0 sm:p-4 select-none">
      {/* Desktop Toolbar to switch presentation or quick test Figma frames */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-[#18181C] border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs text-neutral-400 z-50">
        <span className="font-semibold text-white">КИНОМАКС • Мобильная версия</span>
        <span className="text-neutral-600">|</span>
        <button
          onClick={() => setFrameMode('device')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors ${
            frameMode === 'device' ? 'bg-[#E52E84] text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Рамка iPhone</span>
        </button>
        <button
          onClick={() => setFrameMode('fluid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors ${
            frameMode === 'fluid' ? 'bg-[#E52E84] text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Monitor size={13} />
          <span>На всю ширину</span>
        </button>
      </div>

      {/* Mobile Shell Container */}
      <div
        className={`mobile-device-container transition-all ${
          frameMode === 'fluid' ? '!max-w-md !border-0 !rounded-none !shadow-none' : ''
        }`}
      >
        {/* iOS Dynamic Status Bar */}
        <MobileStatusBar />

        {/* Dynamic Screen View */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Main Tab Screen */}
          {currentTab === 'home' && (
            <HomeScreen
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onSelectMovie={handleSelectMovie}
              onQuickShowtime={handleQuickShowtime}
            />
          )}

          {currentTab === 'search' && (
            <SearchScreen onSelectMovie={handleSelectMovie} />
          )}

          {currentTab === 'catalog' && (
            <CatalogScreen onSelectMovie={handleSelectMovie} />
          )}

          {currentTab === 'tickets' && (
            <TicketsScreen
              tickets={tickets}
              onRefundTicket={handleRefundTicket}
              onBrowseMovies={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              user={user}
              onOpenLogin={() => setOverlayScreen('auth')}
              onLogout={() => setUser(null)}
              onNavigateTickets={() => setCurrentTab('tickets')}
            />
          )}

          {/* Overlays / Sub-screens */}
          {overlayScreen === 'movie_detail' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <MovieDetailScreen
                movie={selectedMovie}
                onBack={() => setOverlayScreen(null)}
                onSelectSeats={handleSelectSeatsFromDetail}
              />
            </div>
          )}

          {overlayScreen === 'seat_selection' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <SeatSelectionScreen
                movie={selectedMovie}
                selectedDate={selectedDate}
                selectedShowtime={selectedShowtime}
                onBack={() => setOverlayScreen('movie_detail')}
                onProceedToPayment={handleProceedToPayment}
              />
            </div>
          )}

          {overlayScreen === 'payment' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <PaymentScreen
                movie={selectedMovie}
                selectedDate={selectedDate}
                selectedShowtime={selectedShowtime}
                selectedSeats={selectedSeats}
                totalPrice={bookingTotalPrice}
                onBack={() => setOverlayScreen('seat_selection')}
                onSuccess={handlePaymentSuccess}
                onGoHome={() => {
                  setOverlayScreen(null);
                  setCurrentTab('home');
                }}
                onGoTickets={() => {
                  setOverlayScreen(null);
                  setCurrentTab('tickets');
                }}
              />
            </div>
          )}

          {overlayScreen === 'auth' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <AuthScreens
                initialScreen="login"
                onSuccess={(u) => {
                  setUser(u);
                  setOverlayScreen(null);
                }}
                onBack={() => setOverlayScreen(null)}
              />
            </div>
          )}
        </div>

        {/* Side Drawer Menu */}
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={(tab) => {
            setOverlayScreen(null);
            setCurrentTab(tab as any);
          }}
        />

        {/* Bottom Tab Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          ticketCount={tickets.length}
        />
      </div>
    </div>
  );
};

export default App;
