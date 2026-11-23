import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { CINEMA_INFO } from '../../data/mockData';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, заполните логин и пароль');
      return;
    }

    if (username.trim().toLowerCase() === 'admin' && (password === 'admin' || password === 'admin123')) {
      setError(null);
      onSuccess();
    } else {
      setError('Неверный логин или пароль администратора');
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
    setTimeout(() => {
      onSuccess();
    }, 200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A1E22] text-white p-5 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1A383D] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#78C5BC] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>В кинотеатр</span>
        </button>
        <span className="text-sm font-bold tracking-wide">Панель управления</span>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 max-w-sm mx-auto w-full">
        {/* Shield Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#005C53] to-[#046C62] flex items-center justify-center shadow-xl shadow-teal-950/60 mb-6 border border-[#78C5BC]/30">
          <Shield size={38} className="text-white" />
        </div>

        <h2 className="text-xl font-black text-white text-center">
          Вход для администратора
        </h2>
        <p className="text-xs text-[#A8D3CF] text-center mt-1.5 mb-6">
          {CINEMA_INFO.brand} · {CINEMA_INFO.branch} • Управление фильмами, сеансами, залами и статистика
        </p>

        {/* Demo Fast Login Pill */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mb-5 p-3 rounded-2xl bg-gradient-to-r from-[#005C53]/40 via-[#0B353A] to-[#0A1E22] border border-[#005C53] hover:border-[#78C5BC] flex items-center justify-between transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#005C53] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Sparkles size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>1-клик демо вход</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#005C53] text-white">Админ</span>
              </div>
              <div className="text-[11px] text-[#A8D3CF] font-mono">admin / admin123</div>
            </div>
          </div>
          <span className="text-xs text-[#78C5BC] font-bold group-hover:translate-x-0.5 transition-transform">Войти →</span>
        </button>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-3 mb-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-200 animate-shake">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[#A8D3CF] uppercase tracking-wider mb-1.5">
              Логин
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78C5BC]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Логин администратора"
                className="w-full bg-[#11292E] border border-[#1A383D] rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-[#78C5BC]/60 focus:outline-none focus:border-[#005C53] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#A8D3CF] uppercase tracking-wider mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78C5BC]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль администратора"
                className="w-full bg-[#11292E] border border-[#1A383D] rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-[#78C5BC]/60 focus:outline-none focus:border-[#005C53] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-teal-950/50 cursor-pointer mt-2"
          >
            Войти в панель администратора
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-[#78C5BC]/80 pb-2">
        {CINEMA_INFO.address} • Служба управления
      </div>
    </div>
  );
};
