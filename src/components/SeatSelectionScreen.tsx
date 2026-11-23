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
  // Pre-selected seats matching Figma node 2047-2 flow (Row 5, seats 4 and 5)
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['5-4', '5-5']);

  // Occupied seats
  const occupiedSeats = new Set([
    '2-3', '2-4', '3-5', '3-6', '3-7', '4-2', '4-3', '4-8', '4-9', '6-1', '6-2', '6-9', '6-10'
  ]);

  // Find active hall from passed halls or use default
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

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white overflow-hidden animate-fade-in relative">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-white tracking-wide">{movie.title}</div>
          <div className="text-[11px] text-neutral-400">
            {selectedDate}, {selectedShowtime.time} • {selectedShowtime.hall}
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Hall Interactive Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-between">
        {/* Cinema Curved Screen representation */}
        <div className="w-full max-w-[320px] mb-8 flex flex-col items-center">
          <div className="w-full h-8 relative flex items-center justify-center">
            {/* Screen curve stroke */}
            <svg viewBox="0 0 300 40" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E52E84" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E52E84" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 32 Q 150 4 290 32"
                stroke="#6E6E78"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 10 32 Q 150 4 290 32 L 280 60 L 20 60 Z"
                fill="url(#screen-glow)"
                opacity="0.25"
              />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-400 -mt-1">
            ЭКРАН
          </span>
        </div>

        {/* Seats Grid */}
        <div className="w-full max-w-[360px] overflow-x-auto space-y-2.5 my-auto py-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-between gap-1.5 min-w-fit mx-auto">
              <span className="text-[10px] font-bold text-neutral-400 w-3.5 text-center select-none">
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
                      className={`w-5 h-5 rounded-[4px] text-[8px] font-medium transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#E52E84] text-white shadow-md shadow-pink-900/50 scale-110 z-10'
                          : isOccupied
                          ? 'bg-[#222226] text-transparent cursor-not-allowed border border-neutral-800'
                          : 'bg-[#3A3A40] text-transparent hover:bg-[#4E4E56] border border-neutral-600/30'
                      }`}
                    >
                      {isSelected ? seatNum : ''}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-neutral-400 w-3.5 text-center select-none">
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8 py-3 px-4 bg-[#1A1A1E] rounded-2xl border border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#3A3A40] border border-neutral-600/30" />
            <span className="text-xs text-neutral-400">Свободно</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#E52E84]" />
            <span className="text-xs text-white font-medium">Выбрано</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#222226] border border-neutral-800" />
            <span className="text-xs text-neutral-400">Занято</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="p-4 bg-[#18181B] border-t border-neutral-800 flex items-center justify-between shrink-0">
        <div>
          <div className="text-xs text-neutral-400">
            Выбрано мест: <span className="text-white font-bold">{selectedSeats.length}</span>
          </div>
          <div className="text-lg font-black text-white">
            {totalPrice} ₽
          </div>
        </div>

        <button
          onClick={() => onProceedToPayment(selectedSeats, totalPrice)}
          disabled={selectedSeats.length === 0}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${
            selectedSeats.length > 0
              ? 'bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white shadow-pink-900/40 cursor-pointer'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
