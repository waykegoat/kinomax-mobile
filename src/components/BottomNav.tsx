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
    { id: 'home', label: 'Расписание', icon: Home },
    { id: 'catalog', label: 'Афиша', icon: Search },
    { id: 'tickets', label: 'Билеты', icon: Ticket, badge: ticketCount },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <div className="shrink-0 h-[68px] bg-[#161619] border-t border-neutral-800/80 px-4 flex items-center justify-around z-30 select-none pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all relative cursor-pointer ${
              isActive ? 'text-[#E52E84]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative">
              <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] bg-[#E52E84] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span
              className={`text-[10px] mt-1 transition-colors ${
                isActive ? 'font-bold text-white' : 'font-medium'
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
