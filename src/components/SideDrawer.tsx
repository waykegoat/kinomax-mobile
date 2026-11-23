import React from 'react';
import { ArrowLeft, ChevronRight, Shield, User, Ticket, Calendar, Search } from 'lucide-react';
import { CINEMA_INFO } from '../data/mockData';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Личный кабинет', tab: 'profile', icon: User },
    { label: 'Мои билеты', tab: 'tickets', icon: Ticket },
    { label: 'Афиша', tab: 'catalog', icon: Calendar },
    { label: 'Поиск фильмов', tab: 'search', icon: Search },
  ];

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      {/* Dark backdrop strictly confined inside phone screen */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer content sliding inside phone */}
      <div className="relative w-[85%] max-w-[330px] bg-[#FAF9F5] h-full flex flex-col p-5 shadow-2xl z-10 border-r border-[#EAE7DF] animate-slide-right text-[#1A1A1A]">
        {/* Top Header matching Figma Screen 02 */}
        <div className="pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-bold text-[#005C53] hover:text-[#046C62] mb-3 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>

          <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            Меню
          </h2>

          <div className="mt-4 pb-3 border-b border-[#EAE7DF]">
            <div className="text-lg font-black text-[#1A1A1A] tracking-wide">
              {CINEMA_INFO.brand}
            </div>
            <div className="text-xs text-[#7A7A7A] mt-0.5">
              {CINEMA_INFO.city} · {CINEMA_INFO.branch}
            </div>
          </div>
        </div>

        {/* Menu Navigation Cards matching Figma Screen 02 */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onNavigate(item.tab);
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 bg-white border border-[#EAE7DF] rounded-2xl hover:border-[#005C53] hover:shadow-sm transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-[#005C53]" />
                <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#005C53] transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} className="text-[#A09D94] group-hover:text-[#005C53] transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}

          {/* Admin Panel Entry matching requirement */}
          <button
            onClick={() => {
              onOpenAdmin();
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 bg-[#EBF3F2] border border-[#005C53]/30 rounded-2xl hover:border-[#005C53] transition-all text-left cursor-pointer group shadow-xs mt-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#005C53] text-white flex items-center justify-center shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-[#005C53] flex items-center gap-1.5">
                  <span>Панель админа</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#005C53] text-white">PRO</span>
                </div>
                <div className="text-[10px] text-[#7A7A7A]">Репертуар, залы, продажи</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#005C53] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#EAE7DF] text-[11px] text-[#7A7A7A]">
          <div className="font-bold text-[#1A1A1A]">{CINEMA_INFO.address}</div>
          <div className="text-[10px] text-[#A09D94] mt-0.5">«КАДР» • Киномакс Владимир</div>
        </div>
      </div>
    </div>
  );
};
