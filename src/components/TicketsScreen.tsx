import React, { useState } from 'react';
import type { Ticket as TicketType } from '../data/mockData';
import { QRCodeModal } from './QRCodeModal';
import { ExpiredTicketModal } from './ExpiredTicketModal';
import { QrCode, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [refundingTicket, setRefundingTicket] = useState<TicketType | null>(null);
  const [refundSuccessToast, setRefundSuccessToast] = useState<string | null>(null);

  const confirmRefund = () => {
    if (!refundingTicket) return;
    const title = refundingTicket.movieTitle;
    onRefundTicket(refundingTicket.id);
    setRefundingTicket(null);
    setRefundSuccessToast(`Возврат средств за билет «${title}» успешно оформлен`);
    setTimeout(() => setRefundSuccessToast(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5] text-[#1A1A1A]">
      {/* Header matching Figma Screen 26 */}
      <div className="p-5 pb-3 border-b border-[#EAE7DF] bg-[#FAF9F5] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Мои билеты</h1>
          <div className="text-[11px] text-[#7A7A7A]">Активные сеансы и архив</div>
        </div>
        <button
          onClick={() => setShowExpiredModal(true)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#7A7A7A] hover:text-[#1A1A1A] px-3 py-1.5 rounded-xl bg-white border border-[#EAE7DF] cursor-pointer"
        >
          <AlertCircle size={13} className="text-[#005C53]" />
          <span>Архив</span>
        </button>
      </div>

      {/* Success notification */}
      {refundSuccessToast && (
        <div className="m-4 p-3.5 bg-[#EBF3F2] border border-[#005C53]/40 text-[#005C53] rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 size={16} />
          <span>{refundSuccessToast}</span>
        </div>
      )}

      {/* Tickets List */}
      <div className="p-5 space-y-4 pb-20">
        {tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE7DF] p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#EAE7DF] text-[#005C53] flex items-center justify-center mx-auto text-2xl">
              🎟️
            </div>
            <h3 className="text-base font-black text-[#1A1A1A]">У вас пока нет активных билетов</h3>
            <p className="text-xs text-[#7A7A7A] max-w-xs mx-auto">
              Выберите фильм в расписании и забронируйте удобные места в кинозале.
            </p>
            <button
              onClick={onBrowseMovies}
              className="px-6 py-3 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs shadow-xs cursor-pointer"
            >
              Перейти к расписанию
            </button>
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl bg-white border border-[#EAE7DF] text-[#1A1A1A] shadow-xs hover:shadow-md transition-all overflow-hidden relative"
            >
              {/* Header card banner */}
              <div className="bg-gradient-to-r from-[#0B353A] to-[#124B52] p-4 text-white flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#78C5BC]">
                    Электронный билет
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5 leading-tight">
                    {t.movieTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono">{t.time}</span>
                  <div className="text-[10px] text-[#B5DFDA]">{t.date}</div>
                </div>
              </div>

              {/* Ticket Body with Boarding Pass Look */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A7A7A] block">Кинозал:</span>
                    <span className="font-bold text-[#1A1A1A]">{t.hall}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A7A7A] block">Места:</span>
                    <span className="font-bold text-[#005C53]">{t.seats}</span>
                  </div>
                </div>

                {/* Perforation line */}
                <div className="relative py-1 border-t border-dashed border-[#EAE7DF] flex items-center justify-between">
                  {/* Left notch */}
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#FAF9F5] border-r border-[#EAE7DF]" />
                  {/* Right notch */}
                  <div className="absolute -right-6 w-4 h-4 rounded-full bg-[#FAF9F5] border-l border-[#EAE7DF]" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedQR(t)}
                    className="flex-1 py-2.5 bg-[#005C53] hover:bg-[#046C62] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <QrCode size={15} />
                    <span>Показать QR</span>
                  </button>

                  <button
                    onClick={() => setRefundingTicket(t)}
                    className="py-2.5 px-3 bg-[#FAF9F5] hover:bg-red-50 text-[#7A7A7A] hover:text-red-600 border border-[#EAE7DF] hover:border-red-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Оформить возврат билета"
                  >
                    <RotateCcw size={14} />
                    <span>Возврат</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal matching Screen 27 */}
      {selectedQR && (
        <QRCodeModal
          onClose={() => setSelectedQR(null)}
          ticket={selectedQR}
        />
      )}

      {/* Expired / Archive Modal */}
      <ExpiredTicketModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
      />

      {/* Screen 28-29 · Возврат билета Modal */}
      {refundingTicket && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE7DF] space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <h3 className="text-base font-black text-[#1A1A1A]">Оформить возврат билета?</h3>
            <div className="text-xs text-[#7A7A7A] text-left p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE7DF] space-y-1">
              <div><strong>Фильм:</strong> {refundingTicket.movieTitle}</div>
              <div><strong>Сеанс:</strong> {refundingTicket.date}, {refundingTicket.time}</div>
              <div><strong>Сумма к возврату:</strong> <span className="font-bold text-[#005C53]">{refundingTicket.price} ₽</span></div>
            </div>
            <p className="text-[11px] text-[#7A7A7A]">
              Средства будут возвращены на карту, с которой производилась оплата, в течение 1–3 рабочих дней.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={confirmRefund}
                className="w-full py-3 bg-[#005C53] hover:bg-[#046C62] text-white font-bold rounded-2xl text-xs cursor-pointer shadow-xs"
              >
                Подтвердить возврат
              </button>
              <button
                onClick={() => setRefundingTicket(null)}
                className="w-full py-2.5 bg-white border border-[#EAE7DF] text-[#1A1A1A] font-bold rounded-2xl text-xs cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
