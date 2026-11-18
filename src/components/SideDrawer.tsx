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
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      {/* Dark backdrop strictly confined inside phone screen */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer content sliding inside phone */}
      <div className="relative w-[82%] max-w-[320px] bg-[#161619] h-full flex flex-col p-5 shadow-2xl z-10 border-r border-neutral-800 animate-slide-right">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
          <div>
            <span className="text-lg font-black tracking-wider text-white">КИНОМАКС</span>
            <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
              <MapPin size={12} className="text-[#E52E84]" />
              <span>Владимир</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#26262a] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Quick Shortcuts */}
        <div className="py-3 border-b border-neutral-800/80 space-y-1.5">
          <button
            onClick={() => {
              onNavigate('profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#26262a] text-left transition-colors text-neutral-200 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#E52E84]/20 text-[#E52E84] flex items-center justify-center shrink-0">
              <User size={15} />
            </div>
            <span className="text-xs font-semibold">Личный кабинет</span>
          </button>

          <button
            onClick={() => {
              onNavigate('tickets');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#26262a] text-left transition-colors text-neutral-200 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <TicketIcon size={15} />
            </div>
            <span className="text-xs font-semibold">Мои билеты</span>
          </button>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-0.5">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1.5">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#222226] text-left text-xs transition-colors cursor-pointer"
              >
                <Icon size={15} className="text-neutral-400 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-400">
          Киномакс-Буревестник Владимир
          <div className="text-neutral-500 mt-0.5">пр. Ленина, д. 29</div>
        </div>
      </div>
    </div>
  );
};
