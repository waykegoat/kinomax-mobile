import React, { useState } from 'react';
import type { Ticket as TicketType } from '../data/mockData';
import { QRCodeModal } from './QRCodeModal';
import { ExpiredTicketModal } from './ExpiredTicketModal';
import { QrCode, RotateCcw, AlertCircle } from 'lucide-react';

interface TicketsScreenProps {
  tickets: TicketType[];
  onRefundTicket: (id: string) => void;
  onBrowseMovies: () => void;
}

export const TicketsScreen: React.FC<TicketsScreenProps> = ({
  tickets,
  onRefundTicket,
  onBrowseMovies,
}) => {
  const [selectedQR, setSelectedQR] = useState<TicketType | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#121214] text-white">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight">Мои билеты</h1>
        <button
          onClick={() => setShowExpiredModal(true)}
          className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-800/60"
        >
          <AlertCircle size={13} className="text-amber-400" />
          <span>Архив</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="p-5 space-y-4 pb-12">
        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 text-neutral-500 flex items-center justify-center mx-auto mb-4">
              🎟️
            </div>
            <h3 className="text-base font-bold text-white mb-1">У вас пока нет активных билетов</h3>
            <p className="text-xs text-neutral-400 mb-6 max-w-xs mx-auto">
              Выберите интересующий фильм в расписании и забронируйте лучшие места в зале.
            </p>
            <button
              onClick={onBrowseMovies}
              className="px-6 py-3 bg-[#E52E84] hover:bg-[#F03A92] text-white font-bold rounded-2xl text-xs"
            >
              Перейти к расписанию
            </button>
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className={`rounded-3xl p-5 bg-gradient-to-br ${t.bgGradient} text-white shadow-xl relative overflow-hidden transition-all`}
            >
              {/* Top card metadata */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-wide text-white drop-shadow-sm">
                    {t.movieTitle}
                  </h3>
                  <div className="text-xs text-white/90 font-medium mt-1">
                    {t.date} • {t.time}
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-black/25 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-wider text-white">
                  {t.hall}
                </div>
              </div>

              {/* Seats info */}
              <div className="my-4 py-2 px-3 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>{t.seats}</span>
                <span className="text-white/90">{t.price} ₽</span>
              </div>

              {/* Card Actions matching Figma Screen 10 */}
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => setSelectedQR(t)}
                  className="w-full py-3 bg-white/95 hover:bg-white active:scale-98 text-neutral-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <QrCode size={16} />
                  <span>Посмотреть QR-код</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Вы уверены, что хотите вернуть билет на «${t.movieTitle}»?`)) {
                      onRefundTicket(t.id);
                    }
                  }}
                  className="w-full py-2.5 bg-black/25 hover:bg-black/40 text-white/90 hover:text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Вернуть билет</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal ticket={selectedQR} onClose={() => setSelectedQR(null)} />

      {/* Expired Ticket Modal */}
      <ExpiredTicketModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
      />
    </div>
  );
};
