import React, { useState, useEffect } from 'react';
import {
  User,
  Ticket as TicketIcon,
  CreditCard,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Settings,
  Award,
  X,
  Bell,
} from 'lucide-react';
import type { UserProfile, SavedCard } from '../data/mockData';
import {
  validateName,
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

interface ProfileScreenProps {
  user: UserProfile | null;
  savedCards: SavedCard[];
  onAddCard: (card: SavedCard) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateTickets: () => void;
  onOpenAdmin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  savedCards,
  onAddCard,
  onDeleteCard,
  onUpdateUser,
  onOpenLogin,
  onLogout,
  onNavigateTickets,
  onOpenAdmin,
}) => {
  const [subView, setSubView] = useState<'main' | 'payment_methods' | 'settings'>('main');
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Settings form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '+7 (900) 123-45-67');
  const [editNotify, setEditNotify] = useState(user?.notificationsEnabled ?? true);
  const [profileErrors, setProfileErrors] = useState<Record<string, string | null>>({});
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Add card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone || '+7 (900) 123-45-67');
      setEditNotify(user.notificationsEnabled ?? true);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#121214] text-white text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mb-4 text-neutral-400">
          <User size={36} />
        </div>
        <h2 className="text-xl font-bold mb-2">Вход в профиль</h2>
        <p className="text-xs text-neutral-400 mb-6 max-w-xs">
          Войдите, чтобы просматривать купленные билеты, сохранять способы оплаты и копить бонусы.
        </p>
        <button
          onClick={onOpenLogin}
          className="w-full max-w-[260px] py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
        >
          Войти или зарегистрироваться
        </button>

        <button
          onClick={onOpenAdmin}
          className="mt-6 text-xs text-neutral-500 hover:text-[#E52E84] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Shield size={14} />
          <span>Вход для администратора</span>
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(editName, 'Имя и фамилия');
    const emailErr = validateEmail(editEmail);
    const phoneErr = validatePhone(editPhone);

    if (nameErr || emailErr || phoneErr) {
      setProfileErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }

    setProfileErrors({});
    onUpdateUser({
      ...user,
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim(),
      notificationsEnabled: editNotify,
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const numErr = validateCardNumber(cardNumber);
    const expErr = validateCardExpiry(cardExpiry);
    const cvvErr = validateCardCvv(cardCvv);

    if (numErr || expErr || cvvErr) {
      setCardErrors({ number: numErr, expiry: expErr, cvv: cvvErr });
      return;
    }

    const digits = cardNumber.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    const brand = detectCardBrand(digits);

    onAddCard({
      id: `card-${Date.now()}`,
      label: brand,
      number: `•••• ${last4}`,
      last4,
      expiry: cardExpiry.trim(),
    });

    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardErrors({});
    setShowAddCardModal(false);
  };

  // Profile Settings sub-view
  if (subView === 'settings') {
    return (
      <div className="flex-1 flex flex-col bg-[#121214] text-white p-5 overflow-y-auto animate-slide-up pb-16">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setProfileErrors({});
              setSubView('main');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-sm font-bold">Личные данные</span>
          <div className="w-10" />
        </div>

        {profileSavedToast && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Изменения сохранены в профиль!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} noValidate className="space-y-4">
          <div className="bg-[#1C1C20] border border-neutral-800 rounded-2xl p-4 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Имя и фамилия *
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (profileErrors.name) setProfileErrors({ ...profileErrors, name: null });
                }}
                placeholder="Иван Петров"
                className={`w-full bg-[#121214] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none ${
                  profileErrors.name ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                }`}
              />
              {profileErrors.name && (
                <p className="text-[11px] text-red-400 mt-1">{profileErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value);
                  if (profileErrors.email) setProfileErrors({ ...profileErrors, email: null });
                }}
                placeholder="ivan@mail.ru"
                className={`w-full bg-[#121214] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none ${
                  profileErrors.email ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                }`}
              />
              {profileErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{profileErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => {
                  setEditPhone(formatPhoneInput(e.target.value));
                  if (profileErrors.phone) setProfileErrors({ ...profileErrors, phone: null });
                }}
                placeholder="+7 (900) 123-45-67"
                className={`w-full bg-[#121214] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none ${
                  profileErrors.phone ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                }`}
              />
              {profileErrors.phone && (
                <p className="text-[11px] text-red-400 mt-1">{profileErrors.phone}</p>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Bell size={14} className="text-[#E52E84]" />
                <span>Уведомления о премьерах и скидках</span>
              </div>
              <button
                type="button"
                onClick={() => setEditNotify(!editNotify)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  editNotify ? 'bg-[#E52E84]' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    editNotify ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
          >
            Сохранить изменения
          </button>
        </form>
      </div>
    );
  }

  // Screen 13.2: Payment Methods sub-view
  if (subView === 'payment_methods') {
    return (
      <div className="flex-1 flex flex-col bg-[#121214] text-white p-5 animate-slide-up relative overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-sm font-bold">Способы оплаты</span>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-[#1C1C1F] border border-neutral-800 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-7 rounded-lg bg-sky-900/40 border border-sky-600/30 flex items-center justify-center text-sky-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold">
                    {card.label} <span className="text-neutral-500 font-mono text-[10px]">({card.expiry})</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">{card.number}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDeleteCard(card.id)}
                className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                title="Удалить карту"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setCardErrors({});
              setShowAddCardModal(true);
            }}
            className="w-full flex items-center gap-3 p-4 bg-[#1C1C1F] border border-dashed border-neutral-700 rounded-2xl text-xs font-medium text-neutral-300 hover:text-white hover:border-[#E52E84] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center text-white">
              <Plus size={16} />
            </div>
            <span>Добавить банковскую карту</span>
          </button>

          <div className="flex items-center justify-between p-4 bg-[#1C1C1F] border border-neutral-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-7 rounded-lg bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                СБП
              </div>
              <span className="text-xs font-semibold">СБП подключен</span>
            </div>
            <CheckCircle2 size={18} className="text-[#E52E84]" />
          </div>
        </div>

        {/* Add Card Modal strictly inside phone container */}
        {showAddCardModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-[320px] bg-[#1C1C22] border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">Привязать карту</h3>
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateCard} noValidate className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Номер карты (16 цифр) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (cardErrors.number) setCardErrors({ ...cardErrors, number: null });
                    }}
                    placeholder="2200 1234 5678 9012"
                    className={`w-full bg-[#121214] border rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none ${
                      cardErrors.number ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                    }`}
                  />
                  {cardErrors.number && (
                    <p className="text-[10px] text-red-400 mt-1">{cardErrors.number}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      Срок (ММ/ГГ) *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(formatCardExpiry(e.target.value));
                        if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: null });
                      }}
                      placeholder="12/28"
                      className={`w-full bg-[#121214] border rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none ${
                        cardErrors.expiry ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                      }`}
                    />
                    {cardErrors.expiry && (
                      <p className="text-[10px] text-red-400 mt-1">{cardErrors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      CVV / CVC *
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
                        if (cardErrors.cvv) setCardErrors({ ...cardErrors, cvv: null });
                      }}
                      placeholder="123"
                      className={`w-full bg-[#121214] border rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none ${
                        cardErrors.cvv ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                      }`}
                    />
                    {cardErrors.cvv && (
                      <p className="text-[10px] text-red-400 mt-1">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E52E84] hover:bg-[#F03A92] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2"
                >
                  Сохранить карту
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Screen 13.1: Profile main
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Header Profile Card matching Figma Screen 13.1 */}
      <div className="p-6 flex flex-col items-center justify-center border-b border-neutral-800/80 bg-gradient-to-b from-[#1C1C22] to-[#121214]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E52E84] to-pink-400 p-1 shadow-xl shadow-pink-950/40 mb-3 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#1A1A1E] flex items-center justify-center text-white">
            <User size={38} className="text-pink-300" />
          </div>
        </div>
        <h2 className="text-lg font-black text-white tracking-wide">{user.name}</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
        {user.phone && <p className="text-[11px] text-neutral-500 mt-0.5">{user.phone}</p>}

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E52E84]/15 border border-[#E52E84]/30 text-pink-300 text-xs font-bold">
          <Award size={14} className="text-[#E52E84]" />
          <span>{user.bonuses ?? 420} бонусов Киномакс</span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-5 space-y-2 pb-16">
        <button
          onClick={onNavigateTickets}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <TicketIcon size={18} />
            </div>
            <span className="text-sm font-semibold text-neutral-200">Мои билеты</span>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>

        <button
          onClick={() => setSubView('settings')}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Settings size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-200">Личные данные</div>
              <div className="text-[10px] text-neutral-500">Имя, почта, телефон</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>

        <button
          onClick={() => setSubView('payment_methods')}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-[#E52E84] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-200">Способы оплаты</div>
              <div className="text-[10px] text-neutral-500">
                Карты ({savedCards.length}) и СБП
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>

        {/* Admin Panel button */}
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-950/50 via-purple-950/30 to-[#1C1C20] hover:from-pink-950/70 rounded-2xl border border-pink-500/30 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E52E84]/20 text-[#E52E84] flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Панель администратора</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E52E84] text-white">КИНОМАКС</span>
              </div>
              <div className="text-[11px] text-neutral-400">Управление фильмами, залами, статистика</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left text-red-400 mt-4 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-semibold">Выйти</span>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>
      </div>
    </div>
  );
};
