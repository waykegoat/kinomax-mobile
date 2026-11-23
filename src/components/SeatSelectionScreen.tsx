import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Movie, Hall } from '../data/mockData';

interface SeatSelectionScreenProps {
  movie: Movie;
  selectedDate: string;
  selectedShowtime: {
    time: string;
    format: string;
    price: number;
    hall: string;
  };
  halls?: Hall[];
  onBack: () => void;
  onProceedToPayment: (selectedSeats: string[], totalPrice: number) => void;
}

export const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({
  movie,
  selectedDate,
  selectedShowtime,
  halls,
  onBack,
  onProceedToPayment,
}) => {
  // Pre-selected seats matching Figma Screen 16 (Row 3, seats 4 and 5)
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['3-4', '3-5']);

  // Occupied seats matching Figma
  const occupiedSeats = new Set([
    '1-2', '1-3', '2-5', '2-6', '3-1', '3-2', '4-7', '4-8', '5-3', '5-4', '6-8', '6-9'
  ]);

  // Find active hall configuration
  const activeHall = halls?.find(
    (h) => h.name === selectedShowtime.hall || h.id === movie.hallId
  ) || halls?.[0];

  const rowCount = activeHall?.rows || 6;
  const seatsPerRow = activeHall?.seatsPerRow || 10;
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

  const toggleSeat = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (occupiedSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const seatPrice = selectedShowtime.price || 420;
  const totalPrice = selectedSeats.length * seatPrice;

  // Formatted seat string matching Figma: "Ряд 3 · места 4, 5"
  const formattedSeatsSummary = () => {
    if (selectedSeats.length === 0) return 'Места не выбраны';
    const byRow: Record<string, string[]> = {};
    selectedSeats.forEach((s) => {
      const [r, seat] = s.split('-');
      if (!byRow[r]) byRow[r] = [];
      byRow[r].push(seat);
    });
    return Object.entries(byRow)
      .map(([r, sList]) => `Ряд ${r} · мест${sList.length > 1 ? 'а' : 'о'} ${sList.join(', ')}`)
      .join('; ');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] overflow-hidden animate-fade-in relative">
      {/* Top Header matching Figma Screen 16 */}
      <div className="p-4 border-b border-[#EAE7DF] bg-white flex items-center justify-between shrink-0 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#005C53] hover:text-[#046C62] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <div className="text-center">
          <div className="text-sm font-black text-[#1A1A1A] tracking-tight">{movie.title}</div>
          <div className="text-[11px] text-[#7A7A7A]">
            {selectedDate} · {selectedShowtime.time} · {selectedShowtime.hall} · {selectedShowtime.format}
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Hall Interactive Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-between">
        {/* Cinema Curved Screen representation matching Screen 16 */}
        <div className="w-full max-w-[320px] mb-6 flex flex-col items-center">
          <div className="w-full h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 300 35" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="screen-teal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005C53" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#005C53" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 15 28 Q 150 4 285 28"
                stroke="#005C53"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 15 28 Q 150 4 285 28 L 275 48 L 25 48 Z"
                fill="url(#screen-teal)"
                opacity="0.3"
              />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#7A7A7A] -mt-1">
            ЭКРАН
          </span>
        </div>

        {/* Dynamic Seats Grid */}
        <div className="w-full max-w-[360px] overflow-x-auto space-y-2.5 my-auto py-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-between gap-1.5 min-w-fit mx-auto">
              <span className="text-[10px] font-bold text-[#A09D94] w-3.5 text-center select-none">
                {row}
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-1">
                {Array.from({ length: seatsPerRow }).map((_, seatIdx) => {
                  const seatNum = seatIdx + 1;
                  const seatId = `${row}-${seatNum}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isOccupied = occupiedSeats.has(seatId);

                  return (
                    <button
                      key={seatNum}
                      onClick={() => toggleSeat(row, seatNum)}
                      disabled={isOccupied}
                      title={`Ряд ${row}, Место ${seatNum}`}
                      className={`w-5 h-5 rounded-[5px] text-[8px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#005C53] text-white shadow-sm scale-110 z-10'
                          : isOccupied
                          ? 'bg-[#D5D2C9] text-transparent cursor-not-allowed opacity-50'
                          : 'bg-white text-[#7A7A7A] hover:border-[#005C53] border border-[#D5D2C9]'
                      }`}
                    >
                      {isSelected ? seatNum : ''}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-[#A09D94] w-3.5 text-center select-none">
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Legend matching Screen 16 */}
        <div className="flex items-center justify-center gap-6 mt-6 py-2.5 px-4 bg-white rounded-2xl border border-[#EAE7DF] shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-white border border-[#D5D2C9]" />
            <span className="text-xs text-[#7A7A7A]">Свободно</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#005C53]" />
            <span className="text-xs text-[#1A1A1A] font-bold">Выбрано</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#D5D2C9]" />
            <span className="text-xs text-[#7A7A7A]">Занято</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Card matching Screen 16 */}
      <div className="p-4 bg-white border-t border-[#EAE7DF] flex items-center justify-between shrink-0 shadow-md">
        <div>
          <div className="text-xs font-bold text-[#1A1A1A]">
            {formattedSeatsSummary()}
          </div>
          <div className="text-sm font-black text-[#005C53] mt-0.5">
            {selectedSeats.length} билет{selectedSeats.length === 1 ? '' : 'а'} × {seatPrice} ₽ = {totalPrice} ₽
          </div>
        </div>

        <button
          onClick={() => onProceedToPayment(selectedSeats, totalPrice)}
          disabled={selectedSeats.length === 0}
          className={`px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
            selectedSeats.length > 0
              ? 'bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white cursor-pointer'
              : 'bg-[#EAE7DF] text-[#A09D94] cursor-not-allowed'
          }`}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};
