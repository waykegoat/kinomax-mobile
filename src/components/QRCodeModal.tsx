import React from 'react';
import type { Ticket } from '../data/mockData';

interface QRCodeModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-[340px] bg-white text-neutral-900 rounded-3xl p-6 flex flex-col items-center shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold tracking-tight text-neutral-950 mb-1">
          QR-код билета
        </h3>
        <p className="text-xs text-neutral-500 text-center mb-5">
          Покажите код контролеру при входе в зал
        </p>

        {/* Crisp QR Code Visual */}
        <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-inner mb-4">
          <svg viewBox="0 0 160 160" className="w-48 h-48">
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
              <rect x="60" y="60" width="40" height="40" rx="4" fill="#E52E84" />
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
        <div className="w-full bg-neutral-100 rounded-2xl p-3 mb-5 text-center">
          <div className="text-sm font-bold text-neutral-900">{ticket.movieTitle}</div>
          <div className="text-xs text-neutral-600 mt-1">
            {ticket.date} • {ticket.time}
          </div>
          <div className="text-xs font-semibold text-pink-600 mt-0.5">
            {ticket.hall} • {ticket.seats}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-2xl text-sm transition-colors cursor-pointer active:scale-98"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
