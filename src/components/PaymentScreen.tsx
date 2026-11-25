import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Plus, Check, Trash2, Tag, AlertCircle, Award, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Movie, Ticket, SavedCard, UserProfile } from '../data/mockData';
import {
  validateEmail,
  validatePhone,
  formatPhoneInput,
  formatCardNumber,
  detectCardBrand,
  validateCardNumber,
  formatCardExpiry,
  validateCardExpiry,
  validateCardCvv,
} from '../utils/validation';

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
  user: UserProfile | null;
  savedCards: SavedCard[];
  onAddCard: (card: SavedCard) => void;
  onDeleteCard: (id: string) => void;
  onOpenLogin?: () => void;
  onBack: () => void;
  onSuccess: (newTicket: Ticket) => void;
  onGoHome: () => void;
  onGoTickets: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  movie,
  selectedDate,
  selectedShowtime,
  selectedSeats,
  totalPrice,
  user,
  savedCards,
  onAddCard,
  onDeleteCard,
  onOpenLogin,
  onBack,
  onSuccess,
  onGoHome,
  onGoTickets,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'saved_card' | 'new_card' | 'sbp' | 'apple_pay'>(
    savedCards.length > 0 ? 'saved_card' : 'sbp'
  );
  const [selectedCardId, setSelectedCardId] = useState<string>(savedCards[0]?.id || '');
  const [isDone, setIsDone] = useState(false);

  // Contact details for e-ticket receipt
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  // New card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveNewCard, setSaveNewCard] = useState(true);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Auth-only Bonus spending state
  const userBonuses = user ? Math.max(0, user.bonuses ?? 0) : 0;
  const priceAfterPromo = Math.max(1, Math.round(totalPrice * (1 - discountPercent / 100)));
  const maxSpendableBonuses = user
    ? Math.min(userBonuses, Math.floor(priceAfterPromo * 0.5), Math.max(0, priceAfterPromo - 1))
    : 0;
  const [useBonuses, setUseBonuses] = useState(false);
  const [bonusesToSpend, setBonusesToSpend] = useState<number>(maxSpendableBonuses);

  // If user logs out, clear bonuses; if promo/user changes bounds when toggled off, sync max
  useEffect(() => {
    if (!user) {
      setUseBonuses(false);
      setBonusesToSpend(0);
    } else if (!useBonuses) {
      setBonusesToSpend(maxSpendableBonuses);
    }
  }, [user, maxSpendableBonuses, useBonuses]);

  // Errors
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const liveBonusError =
    user && useBonuses
      ? !Number.isFinite(bonusesToSpend) || bonusesToSpend < 0
        ? 'Введите корректное количество бонусов'
        : bonusesToSpend > userBonuses
        ? `На балансе только ${userBonuses} бонусов`
        : bonusesToSpend > maxSpendableBonuses
        ? `Можно списать не более 50% заказа (макс. ${maxSpendableBonuses} Б)`
        : null
      : null;

  const effectiveBonusesUsed =
    user && useBonuses && !liveBonusError
      ? Math.min(maxSpendableBonuses, Math.max(0, Math.floor(isNaN(bonusesToSpend) ? 0 : bonusesToSpend)))
      : 0;
  const finalPrice = Math.max(1, priceAfterPromo - effectiveBonusesUsed);
  const bonusesEarned = user ? Math.round(finalPrice * 0.05) : 0;

  const formattedSeats = selectedSeats
    .map((s) => {
      const [r, num] = s.split('-');
      return `Ряд ${r}, место ${num}`;
    })
    .join('; ');

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoFeedback({ type: 'err', text: 'Введите промокод (например: KINO10)' });
      return;
    }
    if (code === 'KINO10') {
      setDiscountPercent(10);
      setPromoFeedback({ type: 'ok', text: 'Промокод KINO10 применён: скидка 10%' });
    } else if (code === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoFeedback({ type: 'ok', text: 'Промокод WELCOME20 применён: скидка 20%' });
    } else {
      setDiscountPercent(0);
      setPromoFeedback({ type: 'err', text: 'Промокод не найден или истёк' });
    }
  };

  const handlePay = () => {
    const nextErrors: Record<string, string | null> = {};
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    if (emailErr) nextErrors.email = emailErr;
    if (phoneErr) nextErrors.phone = phoneErr;

    if (paymentMethod === 'saved_card' && savedCards.length === 0) {
      nextErrors.method = 'Нет сохранённых карт. Выберите другой способ оплаты или добавьте карту.';
    }

    if (paymentMethod === 'new_card') {
      const numErr = validateCardNumber(cardNumber);
      const expErr = validateCardExpiry(cardExpiry);
      const cvvErr = validateCardCvv(cardCvv);
      if (numErr) nextErrors.cardNumber = numErr;
      if (expErr) nextErrors.cardExpiry = expErr;
      if (cvvErr) nextErrors.cardCvv = cvvErr;
    }

    if (user && useBonuses && liveBonusError) {
      nextErrors.bonuses = liveBonusError;
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    if (paymentMethod === 'new_card' && saveNewCard) {
      const digits = cardNumber.replace(/\D/g, '');
      const last4 = digits.slice(-4);
      onAddCard({
        id: `card-${Date.now()}`,
        label: detectCardBrand(digits),
        number: `•••• ${last4}`,
        last4,
        expiry: cardExpiry.trim(),
      });
    }

    setIsDone(true);
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

    const newTicket: Ticket = {
      id: `t-${Date.now().toString().slice(-4)}`,
      movieId: movie.id,
      movieTitle: movie.title,
      date: selectedDate,
      time: selectedShowtime.time,
      hall: selectedShowtime.hall,
      seats: formattedSeats,
      rawSeats: selectedSeats,
      price: finalPrice,
      bonusesUsed: effectiveBonusesUsed,
      bonusesEarned,
      qrCode: `KM-${Date.now().toString().slice(-6)}`,
      bgGradient: 'from-[#5e6bc4] to-[#454c9c]',
    };

    onSuccess(newTicket);
  };

  // Screen 9: SUCCESS SCREEN
  if (isDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#121214] text-white text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 animate-slide-up text-emerald-400">
          <Check size={42} strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight animate-slide-up">
          Готово!
        </h1>
        <p className="text-sm text-neutral-400 max-w-[290px] mb-4 leading-relaxed animate-slide-up">
          Билет успешно приобретён на сумму <strong className="text-white">{finalPrice} ₽</strong>. Чек и QR-код отправлены на{' '}
          <strong className="text-[#E52E84]">{email.trim()}</strong>.
        </p>

        {user && (effectiveBonusesUsed > 0 || bonusesEarned > 0) && (
          <div className="mb-6 px-4 py-2.5 rounded-2xl bg-[#1D1620] border border-[#E52E84]/40 text-xs text-pink-200 flex items-center gap-2">
            <Award size={16} className="text-[#E52E84] shrink-0" />
            <span>
              {effectiveBonusesUsed > 0 && `Списано −${effectiveBonusesUsed} • `}
              Начислено +{bonusesEarned} бонусов
            </span>
          </div>
        )}

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

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <span className="text-sm font-bold text-white">Оплата заказа</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Contact Details with validation */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Получатель чека и билета
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Email для билетов *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="ivan@mail.ru"
              className={`w-full bg-[#121214] border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
              }`}
            />
            {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneInput(e.target.value));
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="+7 (900) 123-45-67"
              className={`w-full bg-[#121214] border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none ${
                errors.phone ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
              }`}
            />
            {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Saved Cards List */}
        {savedCards.map((card) => {
          const isActive = paymentMethod === 'saved_card' && selectedCardId === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                setPaymentMethod('saved_card');
                setSelectedCardId(card.id);
                if (errors.method) setErrors({ ...errors, method: null });
              }}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#222226] border-[#E52E84] shadow-md'
                  : 'bg-[#1C1C1F] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-7 rounded-lg bg-sky-900/40 border border-sky-600/30 flex items-center justify-center text-sky-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {card.label} <span className="text-[10px] text-neutral-500">({card.expiry})</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 tracking-wider font-mono">{card.number}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(card.id);
                    if (selectedCardId === card.id) {
                      const remaining = savedCards.filter((c) => c.id !== card.id);
                      if (remaining.length > 0) setSelectedCardId(remaining[0].id);
                      else setPaymentMethod('sbp');
                    }
                  }}
                  className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                  title="Удалить карту"
                >
                  <Trash2 size={16} />
                </button>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isActive ? 'border-[#E52E84]' : 'border-neutral-600'
                  }`}
                >
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#E52E84]" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* New Card Option + Inline Form */}
        <div
          className={`rounded-2xl border transition-all overflow-hidden ${
            paymentMethod === 'new_card'
              ? 'bg-[#222226] border-[#E52E84]'
              : 'bg-[#1C1C1F] border-dashed border-neutral-700 hover:border-neutral-500'
          }`}
        >
          <button
            type="button"
            onClick={() => setPaymentMethod('new_card')}
            className="w-full flex items-center justify-between p-4 text-xs font-medium text-neutral-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center text-[#E52E84]">
                <Plus size={16} />
              </div>
              <span>Оплатить новой картой</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'new_card' ? 'border-[#E52E84]' : 'border-neutral-600'
              }`}
            >
              {paymentMethod === 'new_card' && <div className="w-2.5 h-2.5 rounded-full bg-[#E52E84]" />}
            </div>
          </button>

          {paymentMethod === 'new_card' && (
            <div className="px-4 pb-4 space-y-3 border-t border-neutral-800 pt-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 mb-1">
                  Номер карты (16 цифр) *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(formatCardNumber(e.target.value));
                    if (errors.cardNumber) setErrors({ ...errors, cardNumber: null });
                  }}
                  placeholder="2200 1234 5678 4242"
                  className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none ${
                    errors.cardNumber ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-[10px] text-red-400 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">
                    Срок (ММ/ГГ) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardExpiry}
                    onChange={(e) => {
                      setCardExpiry(formatCardExpiry(e.target.value));
                      if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: null });
                    }}
                    placeholder="12/28"
                    className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none ${
                      errors.cardExpiry ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                    }`}
                  />
                  {errors.cardExpiry && (
                    <p className="text-[10px] text-red-400 mt-1">{errors.cardExpiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">
                    CVV / CVC *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => {
                      setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
                      if (errors.cardCvv) setErrors({ ...errors, cardCvv: null });
                    }}
                    placeholder="123"
                    className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none ${
                      errors.cardCvv ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                    }`}
                  />
                  {errors.cardCvv && (
                    <p className="text-[10px] text-red-400 mt-1">{errors.cardCvv}</p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveNewCard}
                  onChange={(e) => setSaveNewCard(e.target.checked)}
                  className="accent-[#E52E84]"
                />
                <span>Сохранить карту в личном кабинете</span>
              </label>
            </div>
          )}
        </div>

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

        {/* Apple Pay / SberPay */}
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
              <div className="text-xs font-semibold text-white">SberPay / Mir Pay</div>
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

        {/* Promo code section */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-2">
          <div className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
            <Tag size={12} className="text-[#E52E84]" />
            <span>Промокод (KINO10 или WELCOME20)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                if (promoFeedback) setPromoFeedback(null);
              }}
              placeholder="Введите промокод"
              className="flex-1 bg-[#121214] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#E52E84]"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Применить
            </button>
          </div>
          {promoFeedback && (
            <p
              className={`text-[10px] font-medium ${
                promoFeedback.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {promoFeedback.text}
            </p>
          )}
        </div>

        {/* Auth-Only Loyalty Bonus Card */}
        {!user ? (
          <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                <Lock size={14} className="text-neutral-500" />
                <span>Бонусы Киномакс</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                Только для авторизованных
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Войдите в аккаунт, чтобы списывать до 50% стоимости билетов и копить кэшбэк 5% бонусами.
            </p>
            {onOpenLogin && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full py-2.5 bg-[#26262C] hover:bg-[#32323A] text-white border border-[#E52E84]/40 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Войти и применить бонусы
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#1A1A1E] border border-[#E52E84]/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Award size={15} className="text-[#E52E84]" />
                <span>Бонусы Киномакс</span>
              </div>
              <span className="text-xs font-black text-[#E52E84]">{userBonuses} Б</span>
            </div>

            {userBonuses <= 0 || maxSpendableBonuses <= 0 ? (
              <p className="text-[11px] text-neutral-400">
                На балансе 0 доступных бонусов для списания. За этот заказ начислится{' '}
                <strong className="text-emerald-400">+{bonusesEarned} бонусов</strong>.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-200 font-medium">
                      Списать бонусы (до {maxSpendableBonuses} ₽)
                    </div>
                    <div className="text-[10px] text-neutral-500">1 бонус = 1 ₽ · до 50% заказа</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !useBonuses;
                      setUseBonuses(next);
                      if (next && (!bonusesToSpend || bonusesToSpend > maxSpendableBonuses)) {
                        setBonusesToSpend(maxSpendableBonuses);
                      }
                      if (errors.bonuses) setErrors({ ...errors, bonuses: null });
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      useBonuses ? 'bg-[#E52E84]' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        useBonuses ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {useBonuses && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={maxSpendableBonuses}
                        value={bonusesToSpend === 0 ? '' : bonusesToSpend}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          setBonusesToSpend(isNaN(val) ? 0 : val);
                          if (errors.bonuses) setErrors({ ...errors, bonuses: null });
                        }}
                        className={`flex-1 bg-[#121214] border rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none ${
                          liveBonusError || errors.bonuses ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBonusesToSpend(maxSpendableBonuses);
                          if (errors.bonuses) setErrors({ ...errors, bonuses: null });
                        }}
                        className="px-3 py-2 bg-[#291724] border border-[#E52E84]/40 text-pink-200 rounded-xl text-[11px] font-bold cursor-pointer"
                      >
                        Макс. ({maxSpendableBonuses})
                      </button>
                    </div>
                    {(liveBonusError || errors.bonuses) && (
                      <p className="text-[10px] text-red-400">{liveBonusError || errors.bonuses}</p>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-emerald-400 font-medium">
                  Кэшбэк за этот заказ: +{bonusesEarned} бонусов
                </div>
              </>
            )}
          </div>
        )}

        {errors.method && (
          <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-2xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <span>{errors.method}</span>
          </div>
        )}

        {/* Order Summary box */}
        <div className="p-4 bg-[#18181A] rounded-2xl border border-neutral-800 text-xs space-y-2">
          <div className="font-bold text-white text-sm pb-1 border-b border-neutral-800">
            Детали заказа
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Фильм:</span>
            <span className="text-white font-medium">{movie.title}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Сеанс:</span>
            <span className="text-white">
              {selectedDate}, {selectedShowtime.time} ({selectedShowtime.hall})
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Места:</span>
            <span className="text-white font-medium">{formattedSeats}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Скидка по промокоду ({discountPercent}%):</span>
              <span>−{totalPrice - priceAfterPromo} ₽</span>
            </div>
          )}
          {effectiveBonusesUsed > 0 && (
            <div className="flex justify-between text-[#E52E84]">
              <span>Списано бонусов:</span>
              <span>−{effectiveBonusesUsed} ₽</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-300 font-bold pt-2 border-t border-neutral-800 text-sm">
            <span>К оплате:</span>
            <span className="text-[#E52E84] text-base">{finalPrice} ₽</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="p-4 bg-[#18181B] border-t border-neutral-800 shrink-0">
        <button
          onClick={handlePay}
          className="w-full py-4 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
        >
          Оплатить {finalPrice} ₽
        </button>
      </div>
    </div>
  );
};
