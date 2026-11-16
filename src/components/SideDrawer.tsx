import React from 'react';
import { X, MapPin, User, Ticket as TicketIcon, Film, Sparkles, Calendar, Baby, Palette, Award, Gift } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Фильмы', icon: Film, tab: 'home' },
    { label: 'КиноМиры', icon: Sparkles, tab: 'catalog' },
    { label: 'Афиша', icon: Calendar, tab: 'catalog' },
    { label: 'Детям', icon: Baby, tab: 'catalog' },
    { label: 'Арт', icon: Palette, tab: 'catalog' },
    { label: 'Твой Киномакс', icon: Award, tab: 'home' },
    { label: 'Пригласительный билет', icon: TicketIcon, tab: 'tickets' },
    { label: 'Подарочный сертификат', icon: Gift, tab: 'home' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-[300px] max-w-[85vw] bg-[#161619] h-full flex flex-col p-6 shadow-2xl z-10 animate-fade-in border-r border-neutral-800">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80">
          <div>
            <span className="text-xl font-black tracking-wider text-white">КИНОМАКС</span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <MapPin size={12} className="text-[#E52E84]" />
              <span>Владимир</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#26262a] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Quick Shortcuts */}
        <div className="py-4 border-b border-neutral-800/80 space-y-2">
          <button
            onClick={() => {
              onNavigate('profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#26262a] text-left transition-colors text-neutral-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#E52E84]/20 text-[#E52E84] flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Личный кабинет</span>
          </button>

          <button
            onClick={() => {
              onNavigate('tickets');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#26262a] text-left transition-colors text-neutral-200"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TicketIcon size={16} />
            </div>
            <span className="text-sm font-medium">Мои билеты</span>
          </button>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2">
            Меню
          </div>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#222226] text-left text-sm transition-colors"
              >
                <Icon size={16} className="text-neutral-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
          Киномакс-Буревестник Владимир
          <div className="text-neutral-400 mt-0.5">пр. Ленина, д. 29</div>
        </div>
      </div>
    </div>
  );
};
