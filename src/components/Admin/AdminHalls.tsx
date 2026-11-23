import React, { useState } from 'react';
import { Plus, Trash2, Check, Sliders } from 'lucide-react';
import type { Hall } from '../../data/mockData';

interface AdminHallsProps {
  halls: Hall[];
  onUpdateHalls: (updatedHalls: Hall[]) => void;
}

export const AdminHalls: React.FC<AdminHallsProps> = ({ halls, onUpdateHalls }) => {
  const [selectedHallId, setSelectedHallId] = useState<string>(halls[0]?.id || '');
  const [editingHall, setEditingHall] = useState<Hall>(() => halls[0] || {
    id: 'hall-1',
    name: 'Зал 1',
    type: 'standard',
    rows: 6,
    seatsPerRow: 10,
    priceModifier: 0,
    description: 'Стандартный комфортный зал с лазерным RGB проектором',
  });
  const [saveToast, setSaveToast] = useState(false);

  const handleSelectHall = (hall: Hall) => {
    setSelectedHallId(hall.id);
    setEditingHall({ ...hall });
  };

  const handleApplyPreset = (type: 'standard' | 'vip' | 'imax') => {
    if (type === 'standard') {
      setEditingHall((prev) => ({
        ...prev,
        type: 'standard',
        rows: 6,
        seatsPerRow: 10,
        priceModifier: 0,
        description: 'Стандартный комфортный зал с лазерным RGB проектором',
      }));
    } else if (type === 'vip') {
      setEditingHall((prev) => ({
        ...prev,
        type: 'vip',
        rows: 4,
        seatsPerRow: 6,
        priceModifier: 200,
        description: 'VIP зал с премиальными кожаными диванами-реклайнерами',
      }));
    } else if (type === 'imax') {
      setEditingHall((prev) => ({
        ...prev,
        type: 'imax',
        rows: 8,
        seatsPerRow: 12,
        priceModifier: 350,
        description: 'Гигантский экран IMAX Laser с 12-канальной акустикой',
      }));
    }
  };

  const handleSaveHall = () => {
    const exists = halls.some((h) => h.id === editingHall.id);
    let updated: Hall[];
    if (exists) {
      updated = halls.map((h) => (h.id === editingHall.id ? editingHall : h));
    } else {
      updated = [...halls, editingHall];
    }
    onUpdateHalls(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCreateNewHall = () => {
    const nextNum = halls.length + 1;
    const newHall: Hall = {
      id: `hall-${Date.now()}`,
      name: `Зал ${nextNum}`,
      type: 'standard',
      rows: 6,
      seatsPerRow: 10,
      priceModifier: 0,
      description: 'Новый современный кинозал',
    };
    setSelectedHallId(newHall.id);
    setEditingHall(newHall);
  };

  const handleDeleteHall = (id: string) => {
    if (halls.length <= 1) {
      alert('В кинотеатре должен оставаться хотя бы один кинозал');
      return;
    }
    const filtered = halls.filter((h) => h.id !== id);
    onUpdateHalls(filtered);
    if (selectedHallId === id) {
      setSelectedHallId(filtered[0].id);
      setEditingHall(filtered[0]);
    }
  };

  const totalSeats = editingHall.rows * editingHall.seatsPerRow;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 text-white pb-20">
      {/* Halls Pill Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
          <span>Кинозалы</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
            {halls.length}
          </span>
        </h2>
        <button
          onClick={handleCreateNewHall}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005C53] hover:bg-[#046C62] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-950/40 cursor-pointer"
        >
          <Plus size={14} />
          <span>Новый зал</span>
        </button>
      </div>

      {/* Hall tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {halls.map((h) => {
          const isSelected = h.id === selectedHallId;
          const badgeColor =
            h.type === 'vip'
              ? 'border-purple-500/60 text-purple-300'
              : h.type === 'imax'
              ? 'border-sky-500/60 text-sky-300'
              : 'border-pink-500/60 text-pink-300';
          return (
            <button
              key={h.id}
              onClick={() => handleSelectHall(h)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#291724] border-[#005C53] text-white shadow-md shadow-pink-900/30'
                  : 'bg-[#1C1C20] border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{h.name}</span>
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded border ${badgeColor}`}>
                  {h.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Success alert */}
      {saveToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 rounded-2xl text-xs flex items-center gap-2 animate-fade-in shadow-lg">
          <Check size={16} className="text-emerald-400" />
          <span>Параметры кинозала успешно сохранены!</span>
        </div>
      )}

      {/* Hall Settings Form */}
      <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Конфигурация зала
          </div>
          {halls.length > 1 && (
            <button
              onClick={() => handleDeleteHall(editingHall.id)}
              className="text-neutral-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
            >
              <Trash2 size={13} />
              <span>Удалить зал</span>
            </button>
          )}
        </div>

        {/* Hall Name */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 mb-1">
            Название зала
          </label>
          <input
            type="text"
            value={editingHall.name}
            onChange={(e) => setEditingHall({ ...editingHall, name: e.target.value })}
            className="w-full bg-[#121214] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#005C53]"
          />
        </div>

        {/* 2-3 Hall Variants / Presets */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 mb-1.5">
            Тип зала (Варианты оснащения)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('standard')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                editingHall.type === 'standard'
                  ? 'bg-neutral-800/90 border-[#005C53] shadow-sm'
                  : 'bg-[#141416] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold text-white">Стандарт</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">6×10 (60 мест)</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-semibold">+0 ₽</div>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('vip')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                editingHall.type === 'vip'
                  ? 'bg-purple-950/40 border-purple-500 shadow-sm'
                  : 'bg-[#141416] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold text-purple-300">VIP Зал</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">4×6 (24 места)</div>
              <div className="text-[10px] text-purple-400 mt-1 font-semibold">+200 ₽</div>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('imax')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                editingHall.type === 'imax'
                  ? 'bg-sky-950/40 border-sky-500 shadow-sm'
                  : 'bg-[#141416] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-bold text-sky-300">IMAX Laser</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">8×12 (96 мест)</div>
              <div className="text-[10px] text-sky-400 mt-1 font-semibold">+350 ₽</div>
            </button>
          </div>
        </div>

        {/* Hall Dimensions (Rows and Seats per row) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-400">Рядов</label>
              <span className="text-xs font-mono font-bold text-[#005C53]">{editingHall.rows}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingHall({ ...editingHall, rows: Math.max(3, editingHall.rows - 1) })
                }
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <input
                type="range"
                min={3}
                max={12}
                value={editingHall.rows}
                onChange={(e) =>
                  setEditingHall({ ...editingHall, rows: parseInt(e.target.value) || 3 })
                }
                className="flex-1 accent-[#005C53]"
              />
              <button
                type="button"
                onClick={() =>
                  setEditingHall({ ...editingHall, rows: Math.min(12, editingHall.rows + 1) })
                }
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-400">Мест в ряду</label>
              <span className="text-xs font-mono font-bold text-[#005C53]">
                {editingHall.seatsPerRow}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingHall({
                    ...editingHall,
                    seatsPerRow: Math.max(4, editingHall.seatsPerRow - 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <input
                type="range"
                min={4}
                max={16}
                value={editingHall.seatsPerRow}
                onChange={(e) =>
                  setEditingHall({
                    ...editingHall,
                    seatsPerRow: parseInt(e.target.value) || 4,
                  })
                }
                className="flex-1 accent-[#005C53]"
              />
              <button
                type="button"
                onClick={() =>
                  setEditingHall({
                    ...editingHall,
                    seatsPerRow: Math.min(16, editingHall.seatsPerRow + 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Capacity summary & Surcharge */}
        <div className="p-3 rounded-xl bg-[#121214] border border-neutral-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-400">Вместимость: </span>
            <span className="font-bold text-white">{totalSeats} зрителей</span>
          </div>
          <div>
            <span className="text-neutral-400">Наценка: </span>
            <span className="font-bold text-pink-400">+{editingHall.priceModifier} ₽</span>
          </div>
        </div>

        {/* Save CTA */}
        <button
          type="button"
          onClick={handleSaveHall}
          className="w-full py-3 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-900/40 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check size={15} />
          <span>Применить изменения зала</span>
        </button>
      </div>

      {/* Interactive Live Seat Visualizer */}
      <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sliders size={14} className="text-[#005C53]" />
            <span>Интерактивная схема зала</span>
          </div>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
            {editingHall.rows} рядов × {editingHall.seatsPerRow} мест
          </span>
        </div>

        {/* Screen representation */}
        <div className="w-full pt-2 flex flex-col items-center">
          <div className="w-full max-w-[280px] h-6 relative flex items-center justify-center">
            <svg viewBox="0 0 300 30" className="w-full h-full overflow-visible">
              <path
                d="M 15 25 Q 150 2 285 25"
                stroke={
                  editingHall.type === 'vip'
                    ? '#A855F7'
                    : editingHall.type === 'imax'
                    ? '#38BDF8'
                    : '#005C53'
                }
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[9px] uppercase font-black tracking-[0.25em] text-neutral-400 -mt-1">
            ЭКРАН
          </span>
        </div>

        {/* Dynamic Seat Grid */}
        <div className="overflow-x-auto py-2">
          <div className="inline-block min-w-full">
            <div className="space-y-1.5 flex flex-col items-center">
              {Array.from({ length: editingHall.rows }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <div key={rowNum} className="flex items-center gap-1.5">
                    <span className="w-4 text-[9px] text-neutral-400 font-mono text-right select-none">
                      {rowNum}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: editingHall.seatsPerRow }).map((_, sIdx) => {
                        const seatNum = sIdx + 1;
                        const isVip = editingHall.type === 'vip';
                        const isImax = editingHall.type === 'imax';
                        return (
                          <div
                            key={seatNum}
                            title={`Ряд ${rowNum}, Место ${seatNum}`}
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold transition-all border ${
                              isVip
                                ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                                : isImax
                                ? 'bg-sky-950/60 border-sky-500/50 text-sky-200'
                                : 'bg-[#26262B] border-neutral-700/60 text-neutral-400'
                            }`}
                          >
                            {seatNum}
                          </div>
                        );
                      })}
                    </div>
                    <span className="w-4 text-[9px] text-neutral-400 font-mono text-left select-none">
                      {rowNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-center gap-4 text-[10px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#26262B] border border-neutral-700/60" />
            <span>Свободно</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#005C53] border border-[#005C53]" />
            <span>Выбрано</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-neutral-800 border border-neutral-800 opacity-40" />
            <span>Занято</span>
          </div>
        </div>
      </div>
    </div>
  );
};
