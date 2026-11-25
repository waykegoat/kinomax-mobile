import React, { useState, useEffect } from 'react';
import {
  MOVIES,
  INITIAL_TICKETS,
  INITIAL_HALLS,
  INITIAL_STATS,
  INITIAL_SAVED_CARDS,
  INITIAL_ACCOUNTS,
} from './data/mockData';
import type {
  Movie,
  Ticket,
  Hall,
  PurchaseStats,
  UserProfile,
  StoredAccount,
  SavedCard,
  GiftCertificate,
} from './data/mockData';
import { getStorageItem, setStorageItem } from './utils/validation';
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

const getSessionKey = (movieId: string, date: string, time: string) =>
  `${movieId}__${date}__${time}`;

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'catalog' | 'tickets' | 'profile'>('home');
  const [overlayScreen, setOverlayScreen] = useState<
    null | 'movie_detail' | 'seat_selection' | 'payment' | 'auth' | 'admin_login' | 'admin_panel'
  >(null);
  const [returnToPayment, setReturnToPayment] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cinema Movies State (persisted + auto-heal built-in poster URLs)
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = getStorageItem<Movie[] | null>('kinomax_movies', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved.map((m) => {
        const preset = MOVIES.find((p) => p.id === m.id);
        let patched = m;
        if (preset && (!m.posterImage || (!m.posterImage.startsWith('data:') && !m.posterImage.startsWith('http')))) {
          patched = { ...patched, posterImage: preset.posterImage };
        }
        // Auto-heal legacy cached Dune-2 16:00/19:00 overlap from older versions
        if (
          m.id === 'dune-2' &&
          m.durationMinutes === 166 &&
          m.showtimes.some((s) => s.time === '16:00' && s.hall === 'Зал 3 IMAX') &&
          m.showtimes.some((s) => s.time === '19:00' && s.hall === 'Зал 3 IMAX')
        ) {
          patched = {
            ...patched,
            showtimes: patched.showtimes.map((s) =>
              s.time === '19:00' && s.hall === 'Зал 3 IMAX' ? { ...s, time: '19:15' } : s
            ),
          };
        }
        return patched;
      });
    }
    return MOVIES;
  });

  useEffect(() => {
    setStorageItem('kinomax_movies', movies);
  }, [movies]);

  // Cinema Halls State (persisted)
  const [halls, setHalls] = useState<Hall[]>(() =>
    getStorageItem('kinomax_halls', INITIAL_HALLS)
  );

  useEffect(() => {
    setStorageItem('kinomax_halls', halls);
  }, [halls]);

  // Purchase Statistics State (persisted)
  const [stats, setStats] = useState<PurchaseStats>(() =>
    getStorageItem('kinomax_stats', INITIAL_STATS)
  );

  useEffect(() => {
    setStorageItem('kinomax_stats', stats);
  }, [stats]);

  // Admin Auth State (persisted)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kinomax_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('kinomax_admin_auth', 'true');
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

  // Registered Accounts Directory (persisted)
  const [accounts, setAccounts] = useState<StoredAccount[]>(() =>
    getStorageItem('kinomax_accounts', INITIAL_ACCOUNTS)
  );

  useEffect(() => {
    setStorageItem('kinomax_accounts', accounts);
  }, [accounts]);

  // Active User Profile (persisted, supports logged-out null)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem('kinomax_user');
      if (raw !== null) return JSON.parse(raw);
    } catch {
      // ignore
    }
    const def = INITIAL_ACCOUNTS[0];
    return {
      name: def.name,
      email: def.email,
      phone: def.phone,
      bonuses: def.bonuses,
      notificationsEnabled: def.notificationsEnabled,
    };
  });

  useEffect(() => {
    setStorageItem('kinomax_user', user);
  }, [user]);

  // Saved Bank Cards (persisted)
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() =>
    getStorageItem('kinomax_cards', INITIAL_SAVED_CARDS)
  );

  useEffect(() => {
    setStorageItem('kinomax_cards', savedCards);
  }, [savedCards]);

  // Favorites / Watchlist (persisted)
  const [favorites, setFavorites] = useState<string[]>(() =>
    getStorageItem('kinomax_favorites', [])
  );

  useEffect(() => {
    setStorageItem('kinomax_favorites', favorites);
  }, [favorites]);

  // Gift Certificates (persisted)
  const [certificates, setCertificates] = useState<GiftCertificate[]>(() =>
    getStorageItem('kinomax_certificates', [])
  );

  useEffect(() => {
    setStorageItem('kinomax_certificates', certificates);
  }, [certificates]);

  // Tickets State (persisted)
  const [tickets, setTickets] = useState<Ticket[]>(() =>
    getStorageItem('kinomax_tickets', INITIAL_TICKETS)
  );

  useEffect(() => {
    setStorageItem('kinomax_tickets', tickets);
  }, [tickets]);

  // Booked Seats per Session (persisted)
  const [bookedSeatsMap, setBookedSeatsMap] = useState<Record<string, string[]>>(() =>
    getStorageItem('kinomax_booked_seats', {})
  );

  useEffect(() => {
    setStorageItem('kinomax_booked_seats', bookedSeatsMap);
  }, [bookedSeatsMap]);

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0] || MOVIES[0]);
  const [selectedDate, setSelectedDate] = useState('Сегодня');
  const [selectedShowtime, setSelectedShowtime] = useState(
    (movies[0] || MOVIES[0]).showtimes[0]
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['5-4', '5-5']);
  const [bookingTotalPrice, setBookingTotalPrice] = useState(840);

  // Frame Display Mode
  const [frameMode, setFrameMode] = useState<'device' | 'fluid'>('device');

  // Keep selectedMovie synced when admin updates movies
  const handleUpdateMovies = (nextMovies: Movie[]) => {
    setMovies(nextMovies);
    const updatedSelected = nextMovies.find((m) => m.id === selectedMovie.id);
    if (updatedSelected) {
      setSelectedMovie(updatedSelected);
    } else if (nextMovies.length > 0) {
      setSelectedMovie(nextMovies[0]);
    }
  };

  // Account Handlers
  const handleRegisterAccount = (newAcc: StoredAccount) => {
    setAccounts((prev) => [...prev, newAcc]);
  };

  const handleUpdatePassword = (identifier: string, newPassword: string) => {
    const clean = identifier.trim().toLowerCase();
    const digits = identifier.replace(/\D/g, '');
    setAccounts((prev) =>
      prev.map((acc) => {
        const matchEmail = acc.email.toLowerCase() === clean;
        const matchPhone = digits.length >= 10 && acc.phone?.replace(/\D/g, '') === digits;
        return matchEmail || matchPhone ? { ...acc, password: newPassword } : acc;
      })
    );
  };

  const handleUpdateUser = (updated: UserProfile) => {
    const oldEmail = user?.email?.toLowerCase();
    setUser(updated);
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.email.toLowerCase() === oldEmail || acc.email.toLowerCase() === updated.email.toLowerCase()
          ? { ...acc, ...updated }
          : acc
      )
    );
  };

  const handleAddCard = (card: SavedCard) => {
    setSavedCards((prev) => [card, ...prev]);
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleFavorite = (movieId: string) => {
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const handleBuyCertificate = (cert: GiftCertificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  // Booking Handlers
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(movie.showtimes[0]);
    setOverlayScreen('movie_detail');
  };

  const handleQuickShowtime = (movie: Movie, showtime: Movie['showtimes'][0], date?: string) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setSelectedDate(date || movie.dates[0] || 'Сегодня');
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
    setTickets((prev) => [newTicket, ...prev]);

    // Persist occupied seats
    const key = getSessionKey(newTicket.movieId, newTicket.date, newTicket.time);
    const seatsToBook = newTicket.rawSeats || selectedSeats;
    setBookedSeatsMap((prev) => ({
      ...prev,
      [key]: Array.from(new Set([...(prev[key] || []), ...seatsToBook])),
    }));

    // Deduct spent bonuses and add 5% cashback strictly for authorized users
    if (user) {
      const used = Math.max(0, newTicket.bonusesUsed || 0);
      const earned = newTicket.bonusesEarned ?? Math.round(newTicket.price * 0.05);
      const nextBonuses = Math.max(0, (user.bonuses ?? 0) - used + earned);
      handleUpdateUser({ ...user, bonuses: nextBonuses });
    }

    // Update real-time purchase statistics
    setStats((prev) => {
      const currentMovieStat = prev.movieStats[newTicket.movieId] || {
        movieTitle: newTicket.movieTitle,
        soldCount: 0,
        revenue: 0,
        refundCount: 0,
      };
      const seatsCount = seatsToBook.length || 1;
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
      // Free seats if recorded
      if (refunded.rawSeats && refunded.rawSeats.length > 0) {
        const key = getSessionKey(refunded.movieId, refunded.date, refunded.time);
        setBookedSeatsMap((prev) => {
          const cur = prev[key] || [];
          return {
            ...prev,
            [key]: cur.filter((s) => !refunded.rawSeats?.includes(s)),
          };
        });
      }

      // Revert spent/earned bonuses on refund only for authorized user
      if (user) {
        const used = refunded.bonusesUsed || 0;
        const earned = refunded.bonusesEarned || 0;
        if (used > 0 || earned > 0) {
          const restoredBonuses = Math.max(0, (user.bonuses ?? 0) + used - earned);
          handleUpdateUser({ ...user, bonuses: restoredBonuses });
        }
      }

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
    setReturnToPayment(false);
    setOverlayScreen(null);
    setCurrentTab(tabId as any);
  };

  const activeSessionKey = getSessionKey(selectedMovie.id, selectedDate, selectedShowtime.time);
  const bookedSeatsForActiveSession = bookedSeatsMap[activeSessionKey] || [];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center relative p-0 sm:p-4 select-none">
      {/* Desktop Toolbar */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-[#18181C] border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs text-neutral-400 z-50">
        <span className="font-semibold text-white">КИНОМАКС • Мобильная версия</span>
        <span className="text-neutral-600">|</span>
        <button
          onClick={() => setFrameMode('device')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            frameMode === 'device' ? 'bg-[#E52E84] text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Рамка iPhone</span>
        </button>
        <button
          onClick={() => setFrameMode('fluid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
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
        <MobileStatusBar />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {currentTab === 'home' && (
            <HomeScreen
              movies={movies}
              certificates={certificates}
              onBuyCertificate={handleBuyCertificate}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onSelectMovie={handleSelectMovie}
              onQuickShowtime={handleQuickShowtime}
            />
          )}

          {currentTab === 'search' && (
            <SearchScreen movies={movies} onSelectMovie={handleSelectMovie} />
          )}

          {currentTab === 'catalog' && (
            <CatalogScreen
              movies={movies}
              favorites={favorites}
              onSelectMovie={handleSelectMovie}
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
              savedCards={savedCards}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onUpdateUser={handleUpdateUser}
              onOpenLogin={() => {
                setReturnToPayment(false);
                setOverlayScreen('auth');
              }}
              onLogout={() => setUser(null)}
              onNavigateTickets={() => setCurrentTab('tickets')}
              onOpenAdmin={handleOpenAdmin}
            />
          )}

          {overlayScreen === 'movie_detail' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <MovieDetailScreen
                movie={selectedMovie}
                isLiked={favorites.includes(selectedMovie.id)}
                onToggleFavorite={handleToggleFavorite}
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
                halls={halls}
                bookedSeatsForSession={bookedSeatsForActiveSession}
                onBack={() => setOverlayScreen('movie_detail')}
                onProceedToPayment={handleProceedToPayment}
              />
            </div>
          )}

          {(overlayScreen === 'payment' || (overlayScreen === 'auth' && returnToPayment)) && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <PaymentScreen
                movie={selectedMovie}
                selectedDate={selectedDate}
                selectedShowtime={selectedShowtime}
                selectedSeats={selectedSeats}
                totalPrice={bookingTotalPrice}
                user={user}
                savedCards={savedCards}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onOpenLogin={() => {
                  setReturnToPayment(true);
                  setOverlayScreen('auth');
                }}
                onBack={() => setOverlayScreen('seat_selection')}
                onSuccess={handlePaymentSuccess}
                onGoHome={() => {
                  setReturnToPayment(false);
                  setOverlayScreen(null);
                  setCurrentTab('home');
                }}
                onGoTickets={() => {
                  setReturnToPayment(false);
                  setOverlayScreen(null);
                  setCurrentTab('tickets');
                }}
              />
            </div>
          )}

          {overlayScreen === 'auth' && (
            <div className="absolute inset-0 z-50 bg-[#121214] flex flex-col">
              <AuthScreens
                initialScreen="login"
                accounts={accounts}
                onRegisterAccount={handleRegisterAccount}
                onUpdatePassword={handleUpdatePassword}
                onSuccess={(u) => {
                  setUser(u);
                  if (returnToPayment) {
                    setReturnToPayment(false);
                    setOverlayScreen('payment');
                  } else {
                    setOverlayScreen(null);
                  }
                }}
                onBack={() => {
                  if (returnToPayment) {
                    setReturnToPayment(false);
                    setOverlayScreen('payment');
                  } else {
                    setOverlayScreen(null);
                  }
                }}
              />
            </div>
          )}

          {overlayScreen === 'admin_login' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <AdminLogin
                onSuccess={handleAdminLoginSuccess}
                onBack={() => setOverlayScreen(null)}
              />
            </div>
          )}

          {overlayScreen === 'admin_panel' && (
            <div className="absolute inset-0 z-40 bg-[#121214] flex flex-col">
              <AdminPanel
                movies={movies}
                halls={halls}
                stats={stats}
                onUpdateMovies={handleUpdateMovies}
                onUpdateHalls={(newH) => setHalls(newH)}
                onExit={() => setOverlayScreen(null)}
              />
            </div>
          )}
        </div>

        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={(tab) => {
            setOverlayScreen(null);
            setCurrentTab(tab as any);
          }}
          onOpenAdmin={handleOpenAdmin}
        />

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
