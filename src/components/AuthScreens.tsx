import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ShieldAlert } from 'lucide-react';

interface AuthScreensProps {
  initialScreen?: 'login' | 'register' | 'forgot';
  onSuccess: (user: { name: string; email: string }) => void;
  onBack: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialScreen = 'login',
  onSuccess,
  onBack,
}) => {
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'code' | 'reset'>(initialScreen);
  const [email, setEmail] = useState('ivan@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');

  // Toasts / validation popovers
  const [showLoginErrorToast, setShowLoginErrorToast] = useState(false);

  // OTP Code verification state
  const [otp, setOtp] = useState(['4', '7', '2', '']);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (screen === 'code' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [screen, timer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setShowLoginErrorToast(true);
      return;
    }
    onSuccess({ name: 'Иван Петров', email: email || 'ivan@example.com' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ name: 'Иван Петров', email: email || 'ivan@example.com' });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('login');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-[#1A1A1A] p-6 overflow-y-auto animate-fade-in relative">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            if (screen === 'reset') setScreen('code');
            else if (screen === 'code') setScreen('forgot');
            else if (screen === 'forgot' || screen === 'register') setScreen('login');
            else onBack();
          }}
          className="flex items-center gap-1.5 text-sm font-bold text-[#005C53] hover:text-[#046C62] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* Quick state switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScreen('login')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${screen === 'login' ? 'bg-[#005C53] text-white' : 'bg-white border border-[#EAE7DF] text-[#7A7A7A]'}`}
          >
            Вход
          </button>
          <button
            onClick={() => setScreen('register')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${screen === 'register' ? 'bg-[#005C53] text-white' : 'bg-white border border-[#EAE7DF] text-[#7A7A7A]'}`}
          >
            Рег.
          </button>
        </div>
      </div>

      {/* Screen 03: LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Вход</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">Войдите в свой аккаунт</p>

            {/* Error Toast */}
            {showLoginErrorToast && (
              <div className="absolute top-0 right-0 z-20 max-w-[240px] bg-red-50 text-red-800 text-xs p-3 rounded-2xl shadow-lg border border-red-200 animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium leading-snug">
                    <ShieldAlert size={16} className="text-red-500 shrink-0" />
                    <span>Неправильный логин или пароль</span>
                  </div>
                  <button
                    onClick={() => setShowLoginErrorToast(false)}
                    className="text-red-400 hover:text-red-600 shrink-0 mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] placeholder-[#9A9890] transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] placeholder-[#9A9890] transition-colors shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer mt-2"
            >
              Войти
            </button>
          </form>

          {/* Forgot Password link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setScreen('forgot')}
              className="text-xs font-bold text-[#005C53] hover:underline cursor-pointer"
            >
              Забыли пароль?
            </button>
          </div>

          {/* Social login buttons */}
          <div className="mt-8">
            <div className="relative text-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAE7DF]" />
              </div>
              <span className="relative bg-[#FAF9F5] px-3 text-xs text-[#7A7A7A]">
                или войдите через
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSuccess({ name: 'Иван Петров', email: 'telegram@kinomax.ru' })}
                className="py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] rounded-2xl text-xs font-bold text-[#1A1A1A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Telegram</span>
              </button>
              <button
                type="button"
                onClick={() => onSuccess({ name: 'Иван Петров', email: 'vk@kinomax.ru' })}
                className="py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] rounded-2xl text-xs font-bold text-[#1A1A1A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>VK</span>
              </button>
            </div>
          </div>

          {/* Create account button */}
          <div className="mt-auto pt-6 text-center">
            <button
              type="button"
              onClick={() => setScreen('register')}
              className="w-full py-3 bg-white border border-[#EAE7DF] hover:border-[#005C53] text-[#1A1A1A] font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      )}

      {/* Screen 04: REGISTER SCREEN */}
      {screen === 'register' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Регистрация</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">Создайте личный аккаунт</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Имя и фамилия
              </label>
              <input
                type="text"
                defaultValue="Иван Петров"
                placeholder="Иван Петров"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Не менее 6 символов"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer mt-2"
            >
              Зарегистрироваться
            </button>
          </form>

          <div className="mt-auto pt-6 text-center">
            <button
              type="button"
              onClick={() => setScreen('login')}
              className="text-xs text-[#7A7A7A] hover:text-[#005C53] cursor-pointer"
            >
              Уже есть аккаунт? <strong className="text-[#005C53]">Войти</strong>
            </button>
          </div>
        </div>
      )}

      {/* Screen 05: FORGOT PASSWORD */}
      {screen === 'forgot' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Забыли пароль?</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              Введите email или телефон — отправим код для восстановления доступа
            </p>
          </div>

          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
            >
              Отправить код
            </button>
          </form>
        </div>
      )}

      {/* Screen 06: OTP CODE */}
      {screen === 'code' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Код подтверждения</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              Мы отправили 4-значный код на {email}
            </p>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const nextOtp = [...otp];
                    nextOtp[idx] = e.target.value;
                    setOtp(nextOtp);
                  }}
                  className="w-14 h-16 text-center text-2xl font-black bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-[#1A1A1A] shadow-2xs"
                />
              ))}
            </div>

            <div className="text-center text-xs text-[#7A7A7A]">
              Повторный код через <span className="font-mono font-bold text-[#005C53]">0:{timer.toString().padStart(2, '0')}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
            >
              Подтвердить
            </button>
          </form>
        </div>
      )}

      {/* Screen 07: RESET PASSWORD */}
      {screen === 'reset' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Новый пароль</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">Придумайте новый надежный пароль</p>
          </div>

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Новый пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7A7A7A] mb-1.5 block">
                Повторите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[#EAE7DF] focus:border-[#005C53] focus:outline-none rounded-2xl text-sm text-[#1A1A1A] transition-colors shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#005C53] hover:bg-[#046C62] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
            >
              Сохранить пароль
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
