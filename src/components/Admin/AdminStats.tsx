import React, { useState } from 'react';
import {
  TrendingUp,
  Ticket as TicketIcon,
  Eye,
  RotateCcw,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import type { PurchaseStats } from '../../data/mockData';

interface AdminStatsProps {
  stats: PurchaseStats;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'refund'>('all');

  // Convert movieStats map to sorted array (highest soldCount first)
  const sortedMovies = Object.entries(stats.movieStats)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.soldCount - a.soldCount);

  const topMovie = sortedMovies[0];

  const filteredTransactions = stats.recentTransactions.filter((tx) => {
    if (filterType === 'purchase') return tx.type === 'purchase';
    if (filterType === 'refund') return tx.type === 'refund';
    return true;
  });

  const refundRate =
    stats.totalSold > 0
      ? ((stats.totalRefunded / (stats.totalSold + stats.totalRefunded)) * 100).toFixed(1)
      : '0';

  const averageCheck =
    stats.totalSold > 0 ? Math.round(stats.totalRevenue / stats.totalSold) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 text-white pb-24">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-800">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <span>Статистика и аналитика продаж</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </h2>
        <p className="text-[11px] text-neutral-400">
          Сводка по билетам, возвратам и популярности фильмов
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Sold */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Куплено билетов</span>
            <TicketIcon size={14} className="text-[#005C53]" />
          </div>
          <div className="text-xl font-black text-white">{stats.totalSold} шт.</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight size={11} />
            <span>+14% за сегодня</span>
          </div>
        </div>

        {/* Total Watched */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Посмотрели фильм</span>
            <Eye size={14} className="text-sky-400" />
          </div>
          <div className="text-xl font-black text-sky-400">{stats.totalWatched} чел.</div>
          <div className="text-[10px] text-neutral-400">
            {stats.totalSold > 0
              ? `${Math.round((stats.totalWatched / stats.totalSold) * 100)}% от проданных`
              : '0%'}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Общая выручка</span>
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">
            {stats.totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-[10px] text-neutral-400">Ср. чек: {averageCheck} ₽</div>
        </div>

        {/* Refunds */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Возвраты товара</span>
            <RotateCcw size={14} className="text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{stats.totalRefunded} шт.</div>
          <div className="text-[10px] text-neutral-400">
            -{stats.refundedRevenue.toLocaleString('ru-RU')} ₽ ({refundRate}%)
          </div>
        </div>
      </div>

      {/* Top Movie Callout */}
      {topMovie && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/50 to-neutral-900 border border-pink-500/40 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#005C53]/20 border border-[#005C53]/40 flex items-center justify-center text-[#005C53] shrink-0">
              <Award size={22} />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#005C53]">
                Лидер проката по билетам
              </div>
              <div className="text-sm font-black text-white">{topMovie.movieTitle}</div>
              <div className="text-[11px] text-neutral-300">
                {topMovie.soldCount} билетов • {topMovie.revenue.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Popularity Chart / Ranking */}
      <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-pink-400">
            Рейтинг фильмов (По продажам билетов)
          </div>
          <span className="text-[10px] text-neutral-400">Всего {sortedMovies.length} кинолент</span>
        </div>

        <div className="space-y-3 pt-1">
          {sortedMovies.map((m, idx) => {
            const share =
              stats.totalSold > 0 ? Math.round((m.soldCount / stats.totalSold) * 100) : 0;
            const rankEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

            return (
              <div key={m.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{rankEmoji}</span>
                    <span className="font-bold text-white truncate max-w-[170px]">
                      {m.movieTitle}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-pink-400">{m.soldCount} шт.</span>
                    <span className="text-[10px] text-neutral-500 ml-1.5">({share}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#005C53] to-purple-600 transition-all duration-500"
                    style={{ width: `${Math.max(6, Math.min(100, share))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 px-0.5">
                  <span>Выручка: {m.revenue.toLocaleString('ru-RU')} ₽</span>
                  <span>Возвратов: {m.refundCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Purchases & Refunds Transactions */}
      <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-neutral-300">
            Журнал операций
          </div>
          <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                filterType === 'all' ? 'bg-[#005C53] text-white' : 'text-neutral-400'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilterType('purchase')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                filterType === 'purchase' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
              }`}
            >
              Покупки
            </button>
            <button
              onClick={() => setFilterType('refund')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                filterType === 'refund' ? 'bg-amber-600 text-white' : 'text-neutral-400'
              }`}
            >
              Возвраты
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-500">
              Операций данного типа нет
            </div>
          ) : (
            filteredTransactions.slice(0, 10).map((tx) => {
              const isPurchase = tx.type === 'purchase';
              return (
                <div
                  key={tx.id}
                  className="p-2.5 bg-[#121214] border border-neutral-800/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isPurchase
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isPurchase ? <ArrowDownLeft size={14} /> : <RotateCcw size={14} />}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="truncate max-w-[140px]">{tx.movieTitle}</span>
                        <span
                          className={`text-[9px] px-1 rounded ${
                            isPurchase ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {isPurchase ? 'Покупка' : 'Возврат'}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">{tx.seats}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black font-mono ${
                        isPurchase ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isPurchase ? `+${tx.amount} ₽` : `-${tx.amount} ₽`}
                    </div>
                    <div className="text-[9px] text-neutral-500">
                      {tx.date}, {tx.time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
