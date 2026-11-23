import React, { useState } from 'react';
import { ArrowLeft, CreditCard, QrCode, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
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
  // Checkout sub-step: 'cart' (Screen 17) -> 'payment' (Screen 19-21) -> 'processing' -> 'success' (Screen 23)
  const [step, setStep] = useState<'cart' | 'payment' | 'processing' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'sberpay'>('card');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('ivan@example.com');
  const [phone, setPhone] = useState('+7 (900) 123-45-67');
  const [cardNumber, setCardNumber] = useState('2200 1234 5678 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  const formattedSeatsSummary = selectedSeats
    .map((s) => {
      const [r, seat] = s.split('-');
      return `Ряд ${r}, место ${seat}`;
    })
    .join('; ');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#005C53', '#046C62', '#EAE7DF', '#F5A623'],
        });
      } catch {
        // ignore
      }

      const newTicket = {
        id: `ticket-${Date.now()}`,
        movieId: movie.id,
        movieTitle: movie.title,
        date: selectedDate,
        time: selectedShowtime.time,
        hall: selectedShowtime.hall,
        seats: formattedSeatsSummary,
        price: totalPrice,
        qrCode: `KM-${Date.now().toString().slice(-6)}`,
        bgGradient: 'from-[#0B353A] to-[#005C53]',
      };

      onSuccess(newTicket);
    }, 1200);
  };

  // Screen 23 · Покупка завершена
  if (step === 'success') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] p-6 animate-fade-in justify-between">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#EBF3F2] border border-[#005C53]/30 flex items-center justify-center text-[#005C53] mb-2 shadow-sm">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <span className="text-[10px] font-black tracking-widest text-[#005C53] uppercase">
            Заказ #KM-{Date.now().toString().slice(-5)}
          </span>
          <h2 className="text-2xl font-black text-[#1A1A1A]">
            Покупка завершена!
          </h2>
          <p className="text-xs text-[#7A7A7A] max-w-xs">
            Электронные билеты отправлены на почту <strong className="text-[#1A1A1A]">{email}</strong>. Предъявите QR-код на входе в зал.
          </p>

          {/* Ticket mini summary card */}
          <div className="w-full max-w-xs p-4 bg-white border border-[#EAE7DF] rounded-2xl shadow-xs text-left space-y-2 mt-4">
            <div className="text-sm font-black text-[#1A1A1A]">{movie.title}</div>
            <div className="text-xs text-[#7A7A7A]">
              {selectedDate} · {selectedShowtime.time} · {selectedShowtime.hall}
            </div>
            <div className="text-xs text-[#1A1A1A] font-bold pt-1 border-t border-[#F2EFE7]">
              {formattedSeatsSummary}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onGoTickets}
            className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            Перейти к билетам
          </button>
          <button
            onClick={onGoHome}
            className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  // Screen 22 · Обработка платежа
  if (step === 'processing') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] p-6 items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-[#005C53] border-t-transparent animate-spin" />
        <h3 className="text-lg font-black text-[#1A1A1A]">Обработка платежа</h3>
        <p className="text-xs text-[#7A7A7A] max-w-xs">
          Связываемся с банком для подтверждения оплаты заказа на сумму {totalPrice} ₽...
        </p>
      </div>
    );
  }

  // Screen 17 · Корзина
  if (step === 'cart') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] overflow-hidden animate-fade-in relative">
        {/* Header matching Screen 17 */}
        <div className="p-4 border-b border-[#EAE7DF] bg-white flex items-center justify-between shrink-0">
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-base font-black text-[#1A1A1A]">Корзина</span>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
          {/* Movie order card matching Screen 17 */}
          <div className="bg-white border border-[#EAE7DF] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="pb-3 border-b border-[#F2EFE7]">
              <h2 className="text-base font-black text-[#1A1A1A]">{movie.title}</h2>
              <div className="text-xs text-[#7A7A7A] mt-0.5">
                {selectedDate} · {selectedShowtime.time} · {selectedShowtime.hall}
              </div>
            </div>

            {/* Individual seats breakdown */}
            <div className="space-y-2">
              {selectedSeats.map((s, idx) => {
                const [r, num] = s.split('-');
                return (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="font-medium text-[#1A1A1A]">
                      Ряд {r}, место {num}
                    </span>
                    <span className="font-bold text-[#005C53]">{selectedShowtime.price} ₽</span>
                  </div>
                );
              })}
            </div>

            {/* Total matching Screen 17 */}
            <div className="pt-3 border-t border-[#F2EFE7] flex items-center justify-between">
              <span className="text-sm font-black text-[#1A1A1A]">Итого:</span>
              <span className="text-lg font-black text-[#005C53]">{totalPrice} ₽</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-[#EAE7DF] rounded-2xl text-[11px] text-[#7A7A7A] space-y-1">
            <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#005C53]" />
              <span>Проверьте данные</span>
            </div>
            <div>
              Проверьте дату, время и выбранные места перед подтверждением и переходом к оплате.
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Изменить места
          </button>
        </div>

        {/* Sticky Proceed CTA */}
        <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between shrink-0 shadow-sm">
          <div>
            <div className="text-[11px] text-[#7A7A7A]">Сумма к оплате</div>
            <div className="text-base font-black text-[#005C53]">{totalPrice} ₽</div>
          </div>
          <button
            onClick={() => setStep('payment')}
            className="px-8 py-3.5 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-all shadow-sm cursor-pointer"
          >
            Оформить заказ
          </button>
        </div>

        {/* Screen 25 · Отменить заказ? Modal */}
        {showCancelModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-fade-in">
            <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE7DF] space-y-3.5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-black text-[#1A1A1A]">Отменить заказ?</h3>
              <p className="text-xs text-[#7A7A7A]">
                Выбранные места будут освобождены. Покупка билетов на фильм «{movie.title}» не будет завершена.
              </p>
              <div className="pt-2 space-y-2">
                <button
                  onClick={onBack}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs cursor-pointer"
                >
                  Да, отменить заказ
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-2.5 bg-white border border-[#EAE7DF] text-[#1A1A1A] font-bold rounded-2xl text-xs cursor-pointer"
                >
                  Продолжить оформление
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 'payment' (Screens 18-21: Оформление, способ оплаты, реквизиты карты или СБП)
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] overflow-hidden animate-fade-in relative">
      {/* Header */}
      <div className="p-4 border-b border-[#EAE7DF] bg-white flex items-center justify-between shrink-0">
        <button
          onClick={() => setStep('cart')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>В корзину</span>
        </button>
        <span className="text-base font-black text-[#1A1A1A]">Оплата заказа</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
        {/* Contact details matching Screen 18 */}
        <div className="bg-white border border-[#EAE7DF] rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-[#7A7A7A]">
            Контакты для билетов
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">
              Email для электронных билетов
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
            />
          </div>
        </div>

        {/* Payment method selector matching Screen 19 */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-[#7A7A7A]">
            Способ оплаты
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-[#EBF3F2] border-[#005C53] shadow-xs'
                  : 'bg-white border-[#EAE7DF]'
              }`}
            >
              <CreditCard size={18} className="text-[#005C53] mb-1.5" />
              <div className="text-xs font-bold text-[#1A1A1A]">Карта</div>
              <div className="text-[10px] text-[#7A7A7A]">Мир, Visa</div>
            </button>

            <button
              onClick={() => setPaymentMethod('sbp')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                paymentMethod === 'sbp'
                  ? 'bg-[#EBF3F2] border-[#005C53] shadow-xs'
                  : 'bg-white border-[#EAE7DF]'
              }`}
            >
              <QrCode size={18} className="text-[#005C53] mb-1.5" />
              <div className="text-xs font-bold text-[#1A1A1A]">СБП</div>
              <div className="text-[10px] text-[#7A7A7A]">0% комиссия</div>
            </button>

            <button
              onClick={() => setPaymentMethod('sberpay')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                paymentMethod === 'sberpay'
                  ? 'bg-[#EBF3F2] border-[#005C53] shadow-xs'
                  : 'bg-white border-[#EAE7DF]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center mb-1.5">
                S
              </div>
              <div className="text-xs font-bold text-[#1A1A1A]">SberPay</div>
              <div className="text-[10px] text-[#7A7A7A]">В 1 клик</div>
            </button>
          </div>
        </div>

        {/* Card input form matching Screen 20 */}
        {paymentMethod === 'card' && (
          <div className="bg-white border border-[#EAE7DF] rounded-2xl p-4 space-y-3 shadow-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">
                Номер карты
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">
                  Срок действия
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  maxLength={3}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SBP screen matching Screen 21 */}
        {paymentMethod === 'sbp' && (
          <div className="bg-white border border-[#EAE7DF] rounded-2xl p-4 text-center space-y-3 shadow-xs">
            <div className="w-36 h-36 mx-auto bg-[#FAF9F5] border-2 border-dashed border-[#005C53]/40 rounded-2xl flex items-center justify-center p-2">
              <QrCode size={110} className="text-[#005C53]" />
            </div>
            <div className="text-xs text-[#7A7A7A]">
              Отсканируйте QR-код в приложении вашего банка для моментальной оплаты без комиссии
            </div>
          </div>
        )}
      </div>

      {/* Pay CTA */}
      <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between shrink-0 shadow-md">
        <div>
          <div className="text-[11px] text-[#7A7A7A]">К списанию</div>
          <div className="text-base font-black text-[#005C53]">{totalPrice} ₽</div>
        </div>
        <button
          onClick={handlePay}
          className="px-8 py-3.5 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-all shadow-sm cursor-pointer"
        >
          Оплатить {totalPrice} ₽
        </button>
      </div>
    </div>
  );
};
