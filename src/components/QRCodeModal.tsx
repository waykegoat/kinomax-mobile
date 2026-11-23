import React from 'react';
import type { Ticket } from '../data/mockData';

interface QRCodeModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-[310px] bg-white text-neutral-900 rounded-3xl p-5 flex flex-col items-center shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold tracking-tight text-neutral-950 mb-1">
          QR-код билета
        </h3>
        <p className="text-[11px] text-neutral-500 text-center mb-4">
          Покажите код контролеру при входе в зал
        </p>

        {/* Crisp QR Code Visual */}
        <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-inner mb-3">
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            <rect width="160" height="160" fill="#FFFFFF" />
            {/* Corner Markers */}
            {/* Top-Left */}
            <rect x="10" y="10" width="40" height="40" fill="#000000" rx="6" />
            <rect x="18" y="18" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="24" y="24" width="12" height="12" fill="#000000" rx="2" />

            {/* Top-Right */}
            <rect x="110" y="10" width="40" height="40" fill="#000000" rx="6" />
            <rect x="118" y="18" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="124" y="24" width="12" height="12" fill="#000000" rx="2" />

            {/* Bottom-Left */}
            <rect x="10" y="110" width="40" height="40" fill="#000000" rx="6" />
            <rect x="18" y="118" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="24" y="124" width="12" height="12" fill="#000000" rx="2" />

            {/* Timing Patterns */}
            <g fill="#000000">
              <rect x="58" y="26" width="6" height="6" />
              <rect x="70" y="26" width="6" height="6" />
              <rect x="82" y="26" width="6" height="6" />
              <rect x="94" y="26" width="6" height="6" />
              
              <rect x="26" y="58" width="6" height="6" />
              <rect x="26" y="70" width="6" height="6" />
              <rect x="26" y="82" width="6" height="6" />
              <rect x="26" y="94" width="6" height="6" />

              {/* Data Blocks */}
              <rect x="60" y="60" width="40" height="40" rx="4" fill="#005C53" />
              <rect x="72" y="72" width="16" height="16" fill="#FFFFFF" rx="2" />

              <rect x="10" y="60" width="10" height="10" />
              <rect x="35" y="75" width="8" height="8" />
              <rect x="12" y="90" width="14" height="8" />

              <rect x="110" y="60" width="12" height="12" />
              <rect x="130" y="75" width="15" height="10" />
              <rect x="115" y="92" width="25" height="10" />

              <rect x="60" y="110" width="14" height="14" />
              <rect x="80" y="110" width="12" height="10" />
              <rect x="70" y="130" width="20" height="15" />
              <rect x="100" y="120" width="15" height="25" />
              <rect x="125" y="115" width="20" height="10" />
              <rect x="130" y="135" width="15" height="15" />
            </g>
          </svg>
        </div>

        {/* Ticket Info */}
        <div className="w-full bg-[#FAF9F5] border border-[#EAE7DF] rounded-2xl p-3 mb-4 text-center">
          <div className="text-xs font-bold text-[#1A1A1A]">{ticket.movieTitle}</div>
          <div className="text-[11px] text-[#7A7A7A] mt-0.5">
            {ticket.date} • {ticket.time}
          </div>
          <div className="text-[11px] font-bold text-[#005C53] mt-0.5">
            {ticket.hall} • {ticket.seats}
          </div>
        </div>

        {/* Buttons matching Screen 27 */}
        <div className="w-full space-y-2">
          <button
            onClick={() => alert('Билет добавлен в Apple Wallet')}
            className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Добавить в Apple Wallet
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-white border border-[#EAE7DF] text-[#1A1A1A] font-semibold rounded-2xl text-xs transition-colors cursor-pointer hover:border-[#7A7A7A]"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
