import React from 'react';
import { Home, Search, Ticket, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  ticketCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  ticketCount,
}) => {
  const tabs = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'search', label: 'Поиск', icon: Search },
    { id: 'tickets', label: 'Билеты', icon: Ticket, badge: ticketCount },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <div className="shrink-0 h-[68px] bg-white border-t border-[#EAE7DF] px-4 flex items-center justify-around z-30 select-none pb-1 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all relative cursor-pointer ${
              isActive ? 'text-[#005C53]' : 'text-[#8E8E93] hover:text-[#1A1A1A]'
            }`}
          >
            <div className="relative">
              <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] bg-[#005C53] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span
              className={`text-[10px] mt-1 transition-colors ${
                isActive ? 'font-bold text-[#005C53]' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
