import React, { useState, useEffect } from 'react';
import {
  MOVIES,
  INITIAL_TICKETS,
  INITIAL_HALLS,
  INITIAL_STATS,
} from './data/mockData';
import type { Movie, Ticket, Hall, PurchaseStats } from './data/mockData';
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
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Smartphone, Monitor } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'catalog' | 'tickets' | 'profile'>('home');
  const [overlayScreen, setOverlayScreen] = useState<
    null | 'movie_detail' | 'seat_selection' | 'payment' | 'auth' | 'admin_login' | 'admin_panel'
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cinema Movies State (persisted)
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('kadr_movies');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOVIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kadr_movies', JSON.stringify(movies));
    } catch {
      // ignore
    }
  }, [movies]);

  // Cinema Halls State (persisted)
  const [halls, setHalls] = useState<Hall[]>(() => {
    try {
      const saved = localStorage.getItem('kadr_halls');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_HALLS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kadr_halls', JSON.stringify(halls));
    } catch {
      // ignore
    }
  }, [halls]);

  // Purchase Statistics State (persisted)
  const [stats, setStats] = useState<PurchaseStats>(() => {
    try {
      const saved = localStorage.getItem('kadr_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kadr_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Admin Auth State (persisted)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kadr_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('kadr_admin_auth', 'true');
    } catch {
      // ignore
    }
    setOverlayScreen('admin_panel');
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setOverlayScreen('admin_panel');
    } else {
      setOverlayScreen('admin_login');
    }
  };

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0] || MOVIES[0]);
  const [selectedDate, setSelectedDate] = useState('27 окт.');
  const [selectedShowtime, setSelectedShowtime] = useState(
    (movies[0] || MOVIES[0]).showtimes[1] || (movies[0] || MOVIES[0]).showtimes[0]
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['3-4', '3-5']);
  const [bookingTotalPrice, setBookingTotalPrice] = useState(840);

  // User State
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: 'Иван Петров',
    email: 'ivan@example.com',
  });

  // Tickets State (persisted in localStorage)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('kadr_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kadr_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Frame Display Mode (Device frame vs Full screen)
  const [frameMode, setFrameMode] = useState<'device' | 'fluid'>('device');

  // Handlers
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(movie.showtimes[1] || movie.showtimes[0]);
    setOverlayScreen('movie_detail');
  };

  const handleQuickShowtime = (movie: Movie, showtime: Movie['showtimes'][0]) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setSelectedDate('27 окт.');
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

    // Update real-time purchase statistics
    setStats((prev) => {
      const currentMovieStat = prev.movieStats[newTicket.movieId] || {
        movieTitle: newTicket.movieTitle,
        soldCount: 0,
        revenue: 0,
        refundCount: 0,
      };

      const seatsCount = selectedSeats.length || 1;

      return {
        ...prev,
        totalSold: prev.totalSold + seatsCount,
        totalWatched: prev.totalWatched + seatsCount,
        totalRevenue: prev.totalRevenue + newTicket.price,
        movieStats: {
          ...prev.movieStats,
          [newTicket.movieId]: {
            ...currentMovieStat,
            soldCount: currentMovieStat.soldCount + seatsCount,
            revenue: currentMovieStat.revenue + newTicket.price,
          },
        },
        recentTransactions: [
          {
            id: `tx-${Date.now()}`,
            movieTitle: newTicket.movieTitle,
            type: 'purchase',
            amount: newTicket.price,
            seats: newTicket.seats,
            date: 'Сегодня',
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.recentTransactions,
        ],
      };
    });
  };

  const handleRefundTicket = (ticketId: string) => {
    const refunded = tickets.find((t) => t.id === ticketId);
    setTickets(tickets.filter((t) => t.id !== ticketId));

    if (refunded) {
      // Update real-time refund statistics
      setStats((prev) => {
        const currentMovieStat = prev.movieStats[refunded.movieId] || {
          movieTitle: refunded.movieTitle,
          soldCount: 0,
          revenue: 0,
          refundCount: 0,
        };

        return {
          ...prev,
          totalRefunded: prev.totalRefunded + 1,
          refundedRevenue: prev.refundedRevenue + refunded.price,
          movieStats: {
            ...prev.movieStats,
            [refunded.movieId]: {
              ...currentMovieStat,
              refundCount: currentMovieStat.refundCount + 1,
            },
          },
          recentTransactions: [
            {
              id: `tx-ref-${Date.now()}`,
              movieTitle: refunded.movieTitle,
              type: 'refund',
              amount: refunded.price,
              seats: refunded.seats,
              date: 'Сегодня',
              time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            },
            ...prev.recentTransactions,
          ],
        };
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    setOverlayScreen(null);
    setCurrentTab(tabId as any);
  };

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#1A1A1A] flex flex-col items-center justify-center relative p-0 sm:p-4 select-none">
      {/* Desktop Toolbar */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-[#1A1D22] border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs text-neutral-300 z-50 shadow-md">
        <span className="font-bold text-white">КАДР • Киномакс Владимир</span>
        <span className="text-neutral-600">|</span>
        <button
          onClick={() => setFrameMode('device')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            frameMode === 'device' ? 'bg-[#005C53] text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Рамка iPhone</span>
        </button>
        <button
          onClick={() => setFrameMode('fluid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            frameMode === 'fluid' ? 'bg-[#005C53] text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Monitor size={13} />
          <span>На всю ширину</span>
        </button>
      </div>

      {/* Mobile Shell Container strictly bounded to phone frame */}
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
              movies={movies}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onSelectMovie={handleSelectMovie}
              onQuickShowtime={handleQuickShowtime}
              onGoAfisha={() => setCurrentTab('catalog')}
            />
          )}

          {currentTab === 'search' && (
            <SearchScreen movies={movies} onSelectMovie={handleSelectMovie} />
          )}

          {currentTab === 'catalog' && (
            <CatalogScreen
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onGoSearch={() => setCurrentTab('search')}
            />
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
              onOpenAdmin={handleOpenAdmin}
            />
          )}

          {/* Overlays / Sub-screens */}
          {overlayScreen === 'movie_detail' && (
            <div className="absolute inset-0 z-40 bg-[#FAF9F5] flex flex-col">
              <MovieDetailScreen
                movie={selectedMovie}
                onBack={() => setOverlayScreen(null)}
                onSelectSeats={handleSelectSeatsFromDetail}
              />
            </div>
          )}

          {overlayScreen === 'seat_selection' && (
            <div className="absolute inset-0 z-40 bg-[#FAF9F5] flex flex-col">
              <SeatSelectionScreen
                movie={selectedMovie}
                selectedDate={selectedDate}
                selectedShowtime={selectedShowtime}
                halls={halls}
                onBack={() => setOverlayScreen('movie_detail')}
                onProceedToPayment={handleProceedToPayment}
              />
            </div>
          )}

          {overlayScreen === 'payment' && (
            <div className="absolute inset-0 z-40 bg-[#FAF9F5] flex flex-col">
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
            <div className="absolute inset-0 z-40 bg-[#FAF9F5] flex flex-col">
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

          {/* Admin Login Modal Overlay */}
          {overlayScreen === 'admin_login' && (
            <div className="absolute inset-0 z-40 bg-[#0A1E22] flex flex-col">
              <AdminLogin
                onSuccess={handleAdminLoginSuccess}
                onBack={() => setOverlayScreen(null)}
              />
            </div>
          )}

          {/* Admin Panel Overlay */}
          {overlayScreen === 'admin_panel' && (
            <div className="absolute inset-0 z-40 bg-[#0A1E22] flex flex-col">
              <AdminPanel
                movies={movies}
                halls={halls}
                stats={stats}
                onUpdateMovies={(newM) => setMovies(newM)}
                onUpdateHalls={(newH) => setHalls(newH)}
                onExit={() => setOverlayScreen(null)}
              />
            </div>
          )}
        </div>

        {/* Side Drawer Menu - strictly contained inside phone container */}
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={(tab) => {
            setOverlayScreen(null);
            setCurrentTab(tab as any);
          }}
          onOpenAdmin={handleOpenAdmin}
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
