import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextFieldErrors: { username?: string; password?: string } = {};
    if (!username.trim()) nextFieldErrors.username = 'Введите логин администратора';
    else if (username.trim().length < 3) nextFieldErrors.username = 'Минимум 3 символа';

    if (!password) nextFieldErrors.password = 'Введите пароль';
    else if (password.length < 4) nextFieldErrors.password = 'Минимум 4 символа';

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Заполните обязательные поля');
      return;
    }

    // Default admin credentials: admin / admin or admin123
    if (username.trim().toLowerCase() === 'admin' && (password === 'admin' || password === 'admin123')) {
      setFieldErrors({});
      setError(null);
      onSuccess();
    } else {
      setFieldErrors({ password: 'Неверный пароль' });
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
    <div className="flex-1 flex flex-col bg-[#121214] text-white p-5 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E52E84] hover:text-[#F03A92] cursor-pointer"
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
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#E52E84] to-purple-600 flex items-center justify-center shadow-xl shadow-pink-900/40 mb-6">
          <Shield size={40} className="text-white" />
        </div>

        <h2 className="text-xl font-black text-white text-center">
          Вход для администратора
        </h2>
        <p className="text-xs text-neutral-400 text-center mt-1.5 mb-6">
          Управление репертуаром, расписанием сеансов, кинозалами и статистика продаж билетов
        </p>

        {/* Demo Fast Login Pill */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mb-5 p-3 rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/50 to-neutral-900 border border-pink-500/40 hover:border-pink-500 flex items-center justify-between transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E52E84]/20 flex items-center justify-center text-[#E52E84] group-hover:scale-110 transition-transform">
              <Sparkles size={16} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>1-клик демо вход</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E52E84] text-white">Супер-Админ</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">admin / admin123</div>
            </div>
          </div>
          <span className="text-xs text-[#E52E84] font-semibold group-hover:translate-x-0.5 transition-transform">Войти →</span>
        </button>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-3 mb-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-200 animate-shake">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate className="w-full space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Логин *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
                  if (error) setError(null);
                }}
                placeholder="Логин администратора"
                className={`w-full bg-[#1A1A1E] border rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                  fieldErrors.username ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Пароль *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  if (error) setError(null);
                }}
                placeholder="Пароль администратора"
                className={`w-full bg-[#1A1A1E] border rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                  fieldErrors.password ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-pink-900/40 cursor-pointer mt-2"
          >
            Войти в панель администратора
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-neutral-400 pb-2">
        Киномакс-Буревестник Владимир • Служба управления
      </div>
    </div>
  );
};
