import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ExpiredTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpiredTicketModal: React.FC<ExpiredTicketModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-[320px] bg-[#222226] text-white border border-neutral-700/60 rounded-3xl p-6 flex flex-col items-center shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-3 text-red-400">
          <AlertCircle size={26} />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-white mb-2 text-center">
          Срок билета истек
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-5">
          Сеанс уже завершился. QR-код больше недействителен для входа в зал.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-neutral-900 font-semibold rounded-2xl text-sm transition-colors cursor-pointer active:scale-98"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
