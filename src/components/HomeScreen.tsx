import React, { useState } from 'react';
import { Menu, MapPin, Gift, CheckCircle2 } from 'lucide-react';
import { CINEMA_INFO, MOVIES } from '../data/mockData';
import type { Movie, GiftCertificate } from '../data/mockData';
import { MoviePoster } from './MoviePoster';
import { validateName, validateEmail } from '../utils/validation';

interface HomeScreenProps {
  movies?: Movie[];
  certificates?: GiftCertificate[];
  onBuyCertificate?: (cert: GiftCertificate) => void;
  onOpenDrawer: () => void;
  onSelectMovie: (movie: Movie) => void;
  onQuickShowtime: (movie: Movie, showtime: Movie['showtimes'][0], date?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  movies = MOVIES,
  certificates = [],
  onBuyCertificate,
  onOpenDrawer,
  onSelectMovie,
  onQuickShowtime,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'cert'>('schedule');
  const [selectedDate, setSelectedDate] = useState('Сегодня');
  const [selectedFormat, setSelectedFormat] = useState('Все');

  // Gift certificate form
  const [isCertFormOpen, setIsCertFormOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [certAmount, setCertAmount] = useState<number>(1500);
  const [certMessage, setCertMessage] = useState('');
  const [certErrors, setCertErrors] = useState<Record<string, string | null>>({});
  const [certSuccess, setCertSuccess] = useState<string | null>(null);

  const dateChips = ['Сегодня', 'Завтра', '23 окт.', '24 окт.'];
  const formatChips = ['Все', '2D', 'IMAX', '3D', 'Пушкинская карта'];

  // Filter movies by format
  const visibleMovies = movies.filter((movie) => {
    if (selectedFormat === 'Все') return true;
    if (selectedFormat === 'Пушкинская карта') {
      return movie.priceFrom <= 700 || movie.genre.toLowerCase().includes('драма') || movie.genre.toLowerCase().includes('истор');
    }
    return movie.showtimes.some((st) => st.format === selectedFormat);
  });

  const handleBuyCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(recipientName, 'Имя получателя');
    const emailErr = validateEmail(recipientEmail);
    const amountErr =
      !certAmount || isNaN(certAmount) || certAmount < 300 || certAmount > 15000
        ? 'Укажите сумму от 300 до 15 000 ₽'
        : null;

    if (nameErr || emailErr || amountErr) {
      setCertErrors({ name: nameErr, email: emailErr, amount: amountErr });
      return;
    }

    const code = `GIFT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newCert: GiftCertificate = {
      id: `cert-${Date.now()}`,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim().toLowerCase(),
      amount: certAmount,
      message: certMessage.trim() || 'Приятного просмотра в «Киномакс»!',
      code,
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };

    onBuyCertificate?.(newCert);
    setCertErrors({});
    setRecipientName('');
    setRecipientEmail('');
    setCertMessage('');
    setIsCertFormOpen(false);
    setCertSuccess(`Сертификат на ${newCert.amount} ₽ отправлен на ${newCert.recipientEmail}!`);
    setTimeout(() => setCertSuccess(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Cinema Header */}
      <div className="p-5 pb-4 border-b border-neutral-800/60 bg-gradient-to-b from-[#1C1C22] to-[#121214]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#E52E84] uppercase">
              {CINEMA_INFO.brand}
            </div>
            <h1 className="text-xl font-black text-white leading-tight mt-1 max-w-[260px] tracking-wide">
              КИНОМАКС-БУРЕВЕСТНИК ВЛАДИМИР
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
              <MapPin size={13} className="text-[#E52E84] shrink-0" />
              <span>{CINEMA_INFO.address}</span>
            </div>
          </div>

          <button
            onClick={onOpenDrawer}
            className="w-10 h-10 rounded-2xl bg-[#26262B] text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700/40 cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {CINEMA_INFO.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider bg-[#26262C] text-neutral-300 border border-neutral-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Schedule / Gift Certificate Tabs */}
      <div className="flex border-b border-neutral-800 px-5 pt-2 shrink-0">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
            activeTab === 'schedule' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          РАСПИСАНИЕ
          {activeTab === 'schedule' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E52E84] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cert')}
          className={`ml-6 pb-3 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
            activeTab === 'cert' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          ПОДАРОЧНЫЙ СЕРТИФИКАТ
          {activeTab === 'cert' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E52E84] rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'cert' ? (
        <div className="p-5 space-y-5 pb-12">
          {certSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{certSuccess}</span>
            </div>
          )}

          {!isCertFormOpen ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-pink-950/40 border border-pink-500/30 flex items-center justify-center mx-auto mb-4 text-[#E52E84]">
                <Gift size={28} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Подарите эмоции от кино</h3>
              <p className="text-xs text-neutral-400 mb-6 max-w-xs mx-auto">
                Электронный подарочный сертификат на любой фильм в сети «Киномакс» во Владимире.
              </p>
              <button
                onClick={() => {
                  setCertErrors({});
                  setIsCertFormOpen(true);
                }}
                className="px-6 py-3 bg-[#E52E84] hover:bg-[#F03A92] text-white font-bold rounded-2xl text-xs cursor-pointer shadow-lg shadow-pink-900/40"
              >
                Оформить сертификат
              </button>
            </div>
          ) : (
            <form onSubmit={handleBuyCertificateSubmit} noValidate className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-black text-white">Новый сертификат</span>
                <button
                  type="button"
                  onClick={() => setIsCertFormOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Отмена
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                  Имя получателя *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => {
                    setRecipientName(e.target.value);
                    if (certErrors.name) setCertErrors({ ...certErrors, name: null });
                  }}
                  placeholder="Анна Смирнова"
                  className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                    certErrors.name ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                  }`}
                />
                {certErrors.name && <p className="text-[10px] text-red-400 mt-1">{certErrors.name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                  Email получателя *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (certErrors.email) setCertErrors({ ...certErrors, email: null });
                  }}
                  placeholder="anna@mail.ru"
                  className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                    certErrors.email ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                  }`}
                />
                {certErrors.email && <p className="text-[10px] text-red-400 mt-1">{certErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                  Номинал (₽) *
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[500, 1500, 3000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setCertAmount(val);
                        if (certErrors.amount) setCertErrors({ ...certErrors, amount: null });
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        certAmount === val
                          ? 'bg-[#291724] border-[#E52E84] text-white'
                          : 'bg-[#121214] border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {val} ₽
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={300}
                  max={15000}
                  value={certAmount}
                  onChange={(e) => {
                    setCertAmount(parseInt(e.target.value) || 0);
                    if (certErrors.amount) setCertErrors({ ...certErrors, amount: null });
                  }}
                  className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                    certErrors.amount ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                  }`}
                />
                {certErrors.amount && <p className="text-[10px] text-red-400 mt-1">{certErrors.amount}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                  Поздравление (необязательно)
                </label>
                <textarea
                  rows={2}
                  value={certMessage}
                  onChange={(e) => setCertMessage(e.target.value)}
                  placeholder="С днём рождения! Приятного просмотра!"
                  className="w-full bg-[#121214] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E52E84] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E52E84] hover:bg-[#F03A92] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Оплатить и отправить ({certAmount || 0} ₽)
              </button>
            </form>
          )}

          {/* Purchased certificates history */}
          {certificates.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Оформленные сертификаты ({certificates.length})
              </div>
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-[#1A1A1E] border border-neutral-800 rounded-2xl space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{c.recipientName}</span>
                    <span className="text-xs font-black text-[#E52E84]">{c.amount} ₽</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">{c.recipientEmail}</div>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-neutral-500 font-mono">
                    <span>Код: {c.code}</span>
                    <span>{c.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Date Selector Pills */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {dateChips.map((d) => {
                const active = selectedDate === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#291724] border border-[#E52E84] text-white shadow-sm'
                        : 'bg-[#1C1C20] border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Filters */}
          <div className="px-5 py-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {formatChips.map((f) => {
                const active = selectedFormat === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E52E84] text-white font-bold shadow-md shadow-pink-900/40'
                        : 'bg-[#222226] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Movies Showtime Cards */}
          <div className="p-5 space-y-4 pb-12">
            {visibleMovies.length === 0 ? (
              <div className="p-6 text-center bg-[#1A1A1E] border border-neutral-800 rounded-2xl text-xs text-neutral-400">
                Нет сеансов в формате «{selectedFormat}»
              </div>
            ) : (
              visibleMovies.map((movie) => {
                const filteredShowtimes =
                  selectedFormat === '2D' || selectedFormat === '3D' || selectedFormat === 'IMAX'
                    ? movie.showtimes.filter((st) => st.format === selectedFormat)
                    : movie.showtimes;

                return (
                  <div
                    key={movie.id}
                    className="bg-[#1A1A1E] border border-neutral-800/80 rounded-2xl p-4 shadow-lg hover:border-neutral-700 transition-all"
                  >
                    {/* Movie card top */}
                    <div
                      onClick={() => onSelectMovie(movie)}
                      className="flex gap-3.5 cursor-pointer"
                    >
                      <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
                        <MoviePoster
                          movieId={movie.id}
                          posterImage={movie.posterImage}
                          title={movie.title}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-base font-black text-white hover:text-[#E52E84] transition-colors leading-tight">
                          {movie.title}
                        </h3>
                        <div className="text-[11px] text-neutral-400 mt-1">
                          {movie.age} | {movie.duration}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{movie.genre}</div>
                        <div className="text-xs font-bold text-[#E52E84] mt-2">
                          от {movie.priceFrom} ₽
                        </div>
                      </div>
                    </div>

                    {/* Showtimes Pills */}
                    <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex flex-wrap gap-2">
                      {filteredShowtimes.map((st, idx) => (
                        <button
                          key={idx}
                          onClick={() => onQuickShowtime(movie, st, selectedDate)}
                          className="flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-xl bg-[#222226] border border-neutral-700/60 hover:border-[#E52E84] hover:bg-[#2A1D27] transition-all cursor-pointer group"
                        >
                          <span className="text-[10px] text-neutral-400 group-hover:text-neutral-300">
                            от {st.price} ₽
                          </span>
                          <span className="text-sm font-bold text-white group-hover:text-[#E52E84] transition-colors mt-0.5">
                            {st.time}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-500 group-hover:text-pink-400">
                            {st.format}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
