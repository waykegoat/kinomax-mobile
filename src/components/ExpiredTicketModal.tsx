import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ExpiredTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpiredTicketModal: React.FC<ExpiredTicketModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-[290px] bg-[#222226] text-white border border-neutral-700/60 rounded-3xl p-5 flex flex-col items-center shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-2.5 text-red-400">
          <AlertCircle size={22} />
        </div>
        <h3 className="text-base font-bold tracking-tight text-white mb-1.5 text-center">
          Срок билета истек
        </h3>
        <p className="text-[11px] text-neutral-400 text-center mb-4">
          Сеанс уже завершился. QR-код больше недействителен для входа в зал.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-neutral-900 font-semibold rounded-2xl text-xs transition-colors cursor-pointer active:scale-98"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
