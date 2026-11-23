import React, { useState } from 'react';
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
} from 'lucide-react';

interface ProfileScreenProps {
  user: { name: string; email: string } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateTickets: () => void;
  onOpenAdmin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onNavigateTickets,
  onOpenAdmin,
}) => {
  const [subView, setSubView] = useState<'main' | 'payment_methods' | 'settings'>('main');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: 'c1', label: 'Банковская карта', number: '•••• 4242' },
  ]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FAF9F5] text-[#1A1A1A] text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-[#EAE7DF] flex items-center justify-center mb-4 text-[#005C53] shadow-xs">
          <User size={36} />
        </div>
        <h2 className="text-xl font-black mb-2">Вход в профиль</h2>
        <p className="text-xs text-[#7A7A7A] mb-6 max-w-xs">
          Войдите, чтобы просматривать купленные билеты, сохранять способы оплаты и копить бонусы.
        </p>
        <button
          onClick={onOpenLogin}
          className="w-full max-w-[260px] py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
        >
          Войти или зарегистрироваться
        </button>

        <button
          onClick={onOpenAdmin}
          className="mt-6 text-xs text-[#7A7A7A] hover:text-[#005C53] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Shield size={14} />
          <span>Вход для администратора</span>
        </button>
      </div>
    );
  }

  // Payment Methods sub-view
  if (subView === 'payment_methods') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] p-5 animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DF] mb-5">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-sm font-black">Способы оплаты</span>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-white border border-[#EAE7DF] rounded-2xl shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-7 rounded-lg bg-[#EBF3F2] border border-[#005C53]/20 flex items-center justify-center text-[#005C53]">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold">{card.label}</div>
                  <div className="text-[11px] text-[#7A7A7A] font-mono">{card.number}</div>
                </div>
              </div>
              <button
                onClick={() => setSavedCards(savedCards.filter((c) => c.id !== card.id))}
                className="text-[#9A9890] hover:text-red-500 p-1 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={() => alert('Форма добавления новой банковской карты')}
            className="w-full flex items-center gap-3 p-4 bg-white border border-dashed border-[#C5C2B8] rounded-2xl text-xs font-medium text-[#7A7A7A] hover:text-[#1A1A1A] hover:border-[#005C53] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#FAF9F5] border border-[#EAE7DF] flex items-center justify-center text-[#005C53]">
              <Plus size={16} />
            </div>
            <span>Добавить карту</span>
          </button>

          <div className="flex items-center justify-between p-4 bg-white border border-[#EAE7DF] rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-7 rounded-lg bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-black text-xs">
                СБП
              </div>
              <span className="text-xs font-bold">СБП подключен</span>
            </div>
            <CheckCircle2 size={18} className="text-[#005C53]" />
          </div>
        </div>
      </div>
    );
  }

  // Account Settings sub-view matching Screen 34
  if (subView === 'settings') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] p-5 animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DF] mb-5">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
          <span className="text-sm font-black">Настройки аккаунта</span>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#EAE7DF] rounded-2xl p-4 space-y-3 shadow-2xs">
            <div>
              <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">Имя</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A7A7A] mb-1">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#005C53]"
              />
            </div>
          </div>

          <button
            onClick={() => alert('Настройки сохранены')}
            className="w-full py-3 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    );
  }

  // Main Profile View matching Figma Screen 33
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5] text-[#1A1A1A] relative">
      {/* User Header Card matching Figma Screen 33 */}
      <div className="p-6 flex flex-col items-center justify-center border-b border-[#EAE7DF] bg-white">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0B353A] to-[#005C53] p-1 shadow-md mb-3 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#005C53]">
            <User size={38} />
          </div>
        </div>
        <h2 className="text-lg font-black text-[#1A1A1A] tracking-tight">{user.name}</h2>
        <p className="text-xs text-[#7A7A7A] mt-0.5">{user.email}</p>

        {/* Loyalty bonus points pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3F2] border border-[#005C53]/30 text-[#005C53] text-xs font-bold">
          <Award size={14} />
          <span>420 бонусов Киномакс</span>
        </div>
      </div>

      {/* Menu Options matching Figma Screen 33 */}
      <div className="p-5 space-y-2.5">
        <button
          onClick={onNavigateTickets}
          className="w-full flex items-center justify-between p-4 bg-white hover:border-[#005C53] rounded-2xl border border-[#EAE7DF] transition-all text-left cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF3F2] text-[#005C53] flex items-center justify-center">
              <TicketIcon size={18} />
            </div>
            <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#005C53]">Мои билеты</span>
          </div>
          <ChevronRight size={18} className="text-[#A09D94] group-hover:text-[#005C53]" />
        </button>

        <button
          onClick={() => setSubView('payment_methods')}
          className="w-full flex items-center justify-between p-4 bg-white hover:border-[#005C53] rounded-2xl border border-[#EAE7DF] transition-all text-left cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF3F2] text-[#005C53] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#005C53]">Способы оплаты</span>
          </div>
          <ChevronRight size={18} className="text-[#A09D94] group-hover:text-[#005C53]" />
        </button>

        <button
          onClick={() => setSubView('settings')}
          className="w-full flex items-center justify-between p-4 bg-white hover:border-[#005C53] rounded-2xl border border-[#EAE7DF] transition-all text-left cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF3F2] text-[#005C53] flex items-center justify-center">
              <Settings size={18} />
            </div>
            <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#005C53]">Настройки аккаунта</span>
          </div>
          <ChevronRight size={18} className="text-[#A09D94] group-hover:text-[#005C53]" />
        </button>

        {/* Admin Panel button */}
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-between p-4 bg-[#EBF3F2] hover:bg-[#E2EFEF] rounded-2xl border border-[#005C53]/30 transition-all text-left cursor-pointer shadow-2xs group mt-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005C53] text-white flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <div className="text-sm font-black text-[#005C53] flex items-center gap-1.5">
                <span>Панель администратора</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#005C53] text-white">КИНОМАКС</span>
              </div>
              <div className="text-[11px] text-[#7A7A7A]">Репертуар, залы, статистика</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#005C53] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 rounded-2xl border border-[#EAE7DF] hover:border-red-200 transition-colors text-left text-red-600 mt-4 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-bold">Выйти из аккаунта</span>
          </div>
          <ChevronRight size={18} className="text-red-400" />
        </button>
      </div>

      {/* Screen 35 · Выйти из аккаунта? Modal */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE7DF] space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-black text-[#1A1A1A]">Выйти из аккаунта?</h3>
            <p className="text-xs text-[#7A7A7A]">
              Вы сможете войти снова в любое время с вашим email и паролем.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs cursor-pointer"
              >
                Да, выйти
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 bg-white border border-[#EAE7DF] text-[#1A1A1A] font-bold rounded-2xl text-xs cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
