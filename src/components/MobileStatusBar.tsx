import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 w-full px-7 flex items-center justify-between text-white shrink-0 select-none z-40 bg-[#121214] pt-1">
      {/* Time */}
      <span className="text-xs font-semibold tracking-tight">{time}</span>

      {/* Dynamic Island / Notch area placeholder in middle */}
      <div className="w-24 h-5 bg-black rounded-full mx-auto" />

      {/* Status Icons */}
      <div className="flex items-center gap-1.5 text-neutral-200">
        <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
          <rect x="0" y="8" width="2" height="4" rx="0.5" />
          <rect x="4" y="5" width="2" height="7" rx="0.5" />
          <rect x="8" y="2" width="2" height="10" rx="0.5" />
          <rect x="12" y="0" width="2" height="12" rx="0.5" />
        </svg>
        <Wifi size={13} />
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 border border-neutral-300 rounded-[3px] p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-[1px]" />
          </div>
          <div className="w-0.5 h-1 bg-neutral-300 rounded-r-[1px]" />
        </div>
      </div>
    </div>
  );
};
