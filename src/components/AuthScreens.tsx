import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, CheckCircle2, ShieldAlert } from 'lucide-react';

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
  const [email, setEmail] = useState('ivan@mail.ru');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  
  // Toasts / validation popovers matching Figma exactly
  const [showLoginErrorToast, setShowLoginErrorToast] = useState(true);
  const [showRegPasswordTooltip, setShowRegPasswordTooltip] = useState(false);
  const [showForgotToast, setShowForgotToast] = useState(false);
  const [showResetSuccessToast, setShowResetSuccessToast] = useState(false);

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
    onSuccess({ name: 'Иван Петров', email: email || 'ivan@mail.ru' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setShowRegPasswordTooltip(true);
      return;
    }
    onSuccess({ name: 'Иван Петров', email: email || 'ivan@mail.ru' });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotToast(true);
    setTimeout(() => {
      setShowForgotToast(false);
      setScreen('code');
    }, 1500);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResetSuccessToast(true);
    setTimeout(() => {
      setShowResetSuccessToast(false);
      setScreen('login');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white p-6 overflow-y-auto animate-fade-in relative">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            if (screen === 'reset') setScreen('code');
            else if (screen === 'code') setScreen('forgot');
            else if (screen === 'forgot' || screen === 'register') setScreen('login');
            else onBack();
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* Quick state switcher for tester / showcase convenience */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScreen('login')}
            className={`text-[10px] px-2 py-0.5 rounded ${screen === 'login' ? 'bg-[#E52E84] text-white' : 'bg-neutral-800 text-neutral-400'}`}
          >
            Вход
          </button>
          <button
            onClick={() => setScreen('register')}
            className={`text-[10px] px-2 py-0.5 rounded ${screen === 'register' ? 'bg-[#E52E84] text-white' : 'bg-neutral-800 text-neutral-400'}`}
          >
            Рег.
          </button>
        </div>
      </div>

      {/* Screen 11.1: LOGIN SCREEN (Node 2047-2) */}
      {screen === 'login' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Вход</h1>
            <p className="text-sm text-neutral-400 mt-1">Войдите в свой аккаунт</p>

            {/* Error Validation Toast matching Figma Node 2047-2 exactly */}
            {showLoginErrorToast && (
              <div className="absolute top-0 right-0 z-20 max-w-[240px] bg-[#3E3E42]/95 text-white text-xs p-3 rounded-2xl shadow-2xl border border-neutral-600/50 backdrop-blur-md animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium leading-snug">
                    <ShieldAlert size={16} className="text-red-400 shrink-0" />
                    <span>Неправильное имя пользователя или пароль</span>
                  </div>
                  <button
                    onClick={() => setShowLoginErrorToast(false)}
                    className="text-neutral-400 hover:text-white shrink-0 mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@mail.ru"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Войти
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              onClick={() => setScreen('forgot')}
              className="text-xs font-medium text-[#E52E84] hover:underline"
            >
              Забыли пароль?
            </button>
          </div>

          {/* Social SSO Divider */}
          <div className="mt-8">
            <div className="relative text-center mb-4">
              <span className="text-xs text-neutral-500 bg-[#121214] px-3 relative z-10">
                или войдите через
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/80 -z-0" />
            </div>

            {/* Telegram & VK Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSuccess({ name: 'Иван (Telegram)', email: 'tg_user@mail.ru' })}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-[#2AABEE]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.65-.53.81-1.08.5l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.22-.05-.34-.38-.13l-6.87 4.33-2.96-.92c-.64-.2-.66-.64.14-.95l11.55-4.45c.54-.2 1.01.13.86.92z" />
                </svg>
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={() => onSuccess({ name: 'Иван (VK)', email: 'vk_user@mail.ru' })}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-[#0077FF]" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C3.592 0 0 3.592 0 8.316v7.368C0 20.408 3.592 24 8.316 24h7.368C20.408 24 24 20.408 24 15.684V8.316C24 3.592 20.408 0 15.684 0zm3.692 17.106h-1.744c-.66 0-.862-.525-2.05-1.713-1.033-1.01-1.492-1.139-1.748-1.139-.36 0-.462.103-.462.6v1.652c0 .422-.134.6-1.242.6-1.833 0-3.87-1.112-5.3-3.178-2.15-3.04-2.736-5.328-2.736-5.795 0-.256.103-.493.6-.493h1.744c.444 0 .61.205.782.688.857 2.49 2.296 4.674 2.894 4.674.223 0 .324-.103.324-.666V9.407c-.07-.942-.55-1.025-.55-1.36 0-.16.136-.324.36-.324h2.285c.38 0 .513.205.513.637v3.428c0 .37.166.493.275.493.223 0 .41-.123.823-.538 1.282-1.439 2.193-3.665 2.193-3.665.12-.256.326-.493.77-.493h1.744c.52 0 .633.27.52.637-.22 1.02-2.33 3.99-2.33 3.99-.18.29-.25.42 0 .75.358.47 1.54 1.51 2.33 2.62.59.83.33 1.54-.25 1.54z" />
                </svg>
                <span>VK</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-auto pt-8 text-center text-xs text-neutral-400">
            Нет аккаунта?{' '}
            <button
              onClick={() => setScreen('register')}
              className="text-[#E52E84] font-semibold hover:underline"
            >
              Создать
            </button>
          </div>
        </div>
      )}

      {/* Screen 12: REGISTRATION SCREEN */}
      {screen === 'register' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="relative mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Регистрация</h1>
            <p className="text-sm text-neutral-400 mt-1">Создайте новый аккаунт</p>

            {/* Validation tooltip matching Figma Screen 12.2 */}
            {showRegPasswordTooltip && (
              <div className="absolute top-0 right-0 z-20 max-w-[260px] bg-[#3E3E42]/95 text-white text-xs p-3 rounded-2xl shadow-2xl border border-neutral-600/50 backdrop-blur-md animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium leading-snug">
                    <ShieldAlert size={16} className="text-amber-400 shrink-0" />
                    <span>Слишком простой пароль. Используйте буквы и цифры.</span>
                  </div>
                  <button
                    onClick={() => setShowRegPasswordTooltip(false)}
                    className="text-neutral-400 hover:text-white shrink-0 mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@mail.ru"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Зарегистрироваться
            </button>
          </form>

          {/* Social SSO */}
          <div className="mt-6">
            <div className="relative text-center mb-4">
              <span className="text-xs text-neutral-500 bg-[#121214] px-3 relative z-10">
                или через
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/80 -z-0" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSuccess({ name: 'Новый Пользователь (TG)', email: 'new_user@mail.ru' })}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors"
              >
                <span className="text-blue-400 font-bold">TG</span> Telegram
              </button>
              <button
                type="button"
                onClick={() => onSuccess({ name: 'Новый Пользователь (VK)', email: 'new_user@mail.ru' })}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors"
              >
                <span className="text-blue-500 font-bold">VK</span> ВКонтакте
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 text-center text-xs text-neutral-400">
            Уже есть аккаунт?{' '}
            <button
              onClick={() => setScreen('login')}
              className="text-[#E52E84] font-semibold hover:underline"
            >
              Войти
            </button>
          </div>
        </div>
      )}

      {/* Screen 11.3: FORGOT PASSWORD REQUEST */}
      {screen === 'forgot' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Забыли пароль?</h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Введите телефон или почту, мы отправим код подтверждения
            </p>
          </div>

          {showForgotToast && (
            <div className="mb-4 bg-[#26262A] border border-[#E52E84]/50 text-white text-xs p-4 rounded-2xl shadow-xl animate-slide-up">
              <div className="font-semibold text-[#E52E84] mb-1">Восстановление пароля</div>
              <p className="text-neutral-300">
                Запрос на восстановление пароля отправлен. Дальнейшие инструкции указаны в письме.
              </p>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@mail.ru"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Отправить код
            </button>
          </form>
        </div>
      )}

      {/* Screen 11.5: OTP CODE VERIFICATION */}
      {screen === 'code' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Код подтверждения</h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Мы отправили код на <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-6">
            {/* 4-digit PIN input matching Figma Screen 11.5 */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = [...otp];
                    next[idx] = val;
                    setOtp(next);
                  }}
                  className="w-14 h-16 text-center text-2xl font-bold bg-[#26262A] border border-neutral-700 focus:border-[#E52E84] focus:outline-none rounded-2xl text-white transition-colors"
                />
              ))}
            </div>

            <div className="text-center text-xs text-neutral-400">
              {timer > 0 ? (
                <span>
                  Отправить код повторно через <span className="text-[#E52E84] font-semibold">0:{timer.toString().padStart(2, '0')}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-[#E52E84] font-semibold hover:underline"
                >
                  Отправить код повторно
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Подтвердить
            </button>
          </form>
        </div>
      )}

      {/* Screen 11.6: RESET PASSWORD */}
      {screen === 'reset' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Смена пароля</h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Создайте новый пароль и запомните его
            </p>
          </div>

          {showResetSuccessToast && (
            <div className="mb-4 bg-emerald-950/80 border border-emerald-500/50 text-white text-xs p-4 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-up">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-200">Пароль был успешно сменен!</span>
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон
              </label>
              <input
                type="text"
                disabled
                value={email}
                className="w-full px-4 py-3.5 bg-[#1C1C1F] border border-neutral-800 text-neutral-400 rounded-2xl text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Подтвердите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#26262A] border border-neutral-800 focus:border-[#E52E84] focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Подтвердить смену пароля
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
