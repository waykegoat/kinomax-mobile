import React, { useState } from 'react';
import { User, Ticket as TicketIcon, CreditCard, LogOut, ChevronRight, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ProfileScreenProps {
  user: { name: string; email: string } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateTickets: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onNavigateTickets,
}) => {
  const [subView, setSubView] = useState<'main' | 'payment_methods'>('main');
  const [savedCards, setSavedCards] = useState([
    { id: 'c1', label: 'Банковская карта', number: '•••• 4242' },
  ]);

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
      </div>
    );
  }

  // Screen 13.2: Payment Methods sub-view
  if (subView === 'payment_methods') {
    return (
      <div className="flex-1 flex flex-col bg-[#121214] text-white p-5 animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92]"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-sm font-bold">Способ оплаты</span>
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
                  <div className="text-xs font-semibold">{card.label}</div>
                  <div className="text-[11px] text-neutral-400">{card.number}</div>
                </div>
              </div>
              <button
                onClick={() => setSavedCards(savedCards.filter((c) => c.id !== card.id))}
                className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={() => alert('Форма добавления новой банковской карты')}
            className="w-full flex items-center gap-3 p-4 bg-[#1C1C1F] border border-dashed border-neutral-700 rounded-2xl text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center text-white">
              <Plus size={16} />
            </div>
            <span>Добавить карту</span>
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
      </div>

      {/* Menu Options matching Figma Screen 13.1 */}
      <div className="p-5 space-y-2">
        <button
          onClick={onNavigateTickets}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left"
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
          onClick={() => setSubView('payment_methods')}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-[#E52E84] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <span className="text-sm font-semibold text-neutral-200">Способ оплаты</span>
          </div>
          <ChevronRight size={18} className="text-neutral-500" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C20] hover:bg-[#25252A] rounded-2xl border border-neutral-800/80 transition-colors text-left text-red-400 mt-4"
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
