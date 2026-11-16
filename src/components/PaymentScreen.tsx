import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Check, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Movie } from '../data/mockData';

interface PaymentScreenProps {
  movie: Movie;
  selectedDate: string;
  selectedShowtime: {
    time: string;
    format: string;
    price: number;
    hall: string;
  };
  selectedSeats: string[];
  totalPrice: number;
  onBack: () => void;
  onSuccess: (newTicket: {
    id: string;
    movieId: string;
    movieTitle: string;
    date: string;
    time: string;
    hall: string;
    seats: string;
    price: number;
    qrCode: string;
    bgGradient: string;
  }) => void;
  onGoHome: () => void;
  onGoTickets: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  movie,
  selectedDate,
  selectedShowtime,
  selectedSeats,
  totalPrice,
  onBack,
  onSuccess,
  onGoHome,
  onGoTickets,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'apple_pay'>('sbp');
  const [isDone, setIsDone] = useState(false);

  const formattedSeats = selectedSeats
    .map((s) => {
      const [r, num] = s.split('-');
      return `Ряд ${r}, место ${num}`;
    })
    .join('; ');

  const handlePay = () => {
    setIsDone(true);
    // Fire confetti for celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E52E84', '#F03A92', '#3B82F6', '#10B981'],
      });
    } catch {
      // ignore
    }

    const newTicket = {
      id: `t-${Date.now().toString().slice(-4)}`,
      movieId: movie.id,
      movieTitle: movie.title,
      date: `${selectedDate} 2024`,
      time: selectedShowtime.time,
      hall: selectedShowtime.hall,
      seats: formattedSeats,
      price: totalPrice,
      qrCode: `KM-${Date.now().toString().slice(-6)}`,
      bgGradient: 'from-[#5e6bc4] to-[#454c9c]',
    };

    onSuccess(newTicket);
  };

  // Screen 9: SUCCESS SCREEN (Готово!)
  if (isDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#121214] text-white text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 animate-slide-up text-emerald-400">
          <Check size={42} strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight animate-slide-up">
          Готово!
        </h1>
        <p className="text-sm text-neutral-400 max-w-[280px] mb-8 leading-relaxed animate-slide-up">
          Билет успешно приобретен. Чек отправлен на email.
        </p>

        {/* Action Buttons matching Figma Screen 9 */}
        <div className="w-full max-w-[320px] space-y-3">
          <button
            onClick={onGoTickets}
            className="w-full py-4 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
          >
            Мои билеты
          </button>
          <button
            onClick={onGoHome}
            className="w-full py-3.5 bg-[#26262A] hover:bg-[#323238] active:scale-98 text-neutral-200 font-semibold rounded-2xl text-sm transition-all cursor-pointer"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  // Screen 8: PAYMENT METHOD SCREEN
  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <span className="text-sm font-bold text-white">Способ оплаты</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {/* Saved Credit Card */}
        <div
          onClick={() => setPaymentMethod('card')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
            paymentMethod === 'card'
              ? 'bg-[#222226] border-[#E52E84] shadow-md'
              : 'bg-[#1C1C1F] border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-7 rounded-lg bg-sky-900/40 border border-sky-600/30 flex items-center justify-center text-sky-400">
              <CreditCard size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Банковская карта</div>
              <div className="text-[11px] text-neutral-400 tracking-wider">•••• 4242</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-neutral-500 hover:text-red-400 p-1"
            >
              <Trash2 size={16} />
            </button>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-[#E52E84]' : 'border-neutral-600'
              }`}
            >
              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#E52E84]" />}
            </div>
          </div>
        </div>

        {/* Add new card */}
        <button
          onClick={() => alert('Форма добавления новой банковской карты')}
          className="w-full flex items-center gap-3 p-4 bg-[#1C1C1F] border border-dashed border-neutral-700 rounded-2xl text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center text-white">
            <Plus size={16} />
          </div>
          <span>Добавить карту</span>
        </button>

        {/* SBP option */}
        <div
          onClick={() => setPaymentMethod('sbp')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
            paymentMethod === 'sbp'
              ? 'bg-[#222226] border-[#E52E84] shadow-md'
              : 'bg-[#1C1C1F] border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-7 rounded-lg bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-400 font-black text-xs">
              СБП
            </div>
            <div>
              <div className="text-xs font-semibold text-white">СБП (Система быстрых платежей)</div>
              <div className="text-[11px] text-neutral-400">Оплата через приложение банка</div>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'sbp' ? 'border-[#E52E84]' : 'border-neutral-600'
            }`}
          >
            {paymentMethod === 'sbp' && <div className="w-2.5 h-2.5 rounded-full bg-[#E52E84]" />}
          </div>
        </div>

        {/* Apple Pay / Mir Pay */}
        <div
          onClick={() => setPaymentMethod('apple_pay')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
            paymentMethod === 'apple_pay'
              ? 'bg-[#222226] border-[#E52E84] shadow-md'
              : 'bg-[#1C1C1F] border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-xs font-bold">
              Pay
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Apple Pay / SberPay</div>
              <div className="text-[11px] text-neutral-400">Быстрая оплата в 1 касание</div>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'apple_pay' ? 'border-[#E52E84]' : 'border-neutral-600'
            }`}
          >
            {paymentMethod === 'apple_pay' && <div className="w-2.5 h-2.5 rounded-full bg-[#E52E84]" />}
          </div>
        </div>

        {/* Order Summary box */}
        <div className="mt-6 p-4 bg-[#18181A] rounded-2xl border border-neutral-800 text-xs space-y-2">
          <div className="font-bold text-white text-sm pb-1 border-b border-neutral-800">
            Детали заказа
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Фильм:</span>
            <span className="text-white font-medium">{movie.title}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Сеанс:</span>
            <span className="text-white">{selectedDate}, {selectedShowtime.time} ({selectedShowtime.hall})</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Места:</span>
            <span className="text-white font-medium">{formattedSeats}</span>
          </div>
          <div className="flex justify-between text-neutral-300 font-bold pt-2 border-t border-neutral-800 text-sm">
            <span>К оплате:</span>
            <span className="text-[#E52E84] text-base">{totalPrice} ₽</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA matching Figma: "Оплатить 840 ₽" */}
      <div className="p-4 bg-[#18181B] border-t border-neutral-800 shrink-0">
        <button
          onClick={handlePay}
          className="w-full py-4 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
        >
          Оплатить {totalPrice} ₽
        </button>
      </div>
    </div>
  );
};
