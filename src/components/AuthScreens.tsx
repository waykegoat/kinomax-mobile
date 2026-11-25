import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import type { StoredAccount, UserProfile } from '../data/mockData';
import {
  validateEmail,
  validatePhone,
  validateEmailOrPhone,
  formatPhoneInput,
  validateName,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validation';

interface AuthScreensProps {
  initialScreen?: 'login' | 'register' | 'forgot';
  accounts: StoredAccount[];
  onRegisterAccount: (account: StoredAccount) => void;
  onUpdatePassword: (identifier: string, newPassword: string) => void;
  onSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialScreen = 'login',
  accounts,
  onRegisterAccount,
  onUpdatePassword,
  onSuccess,
  onBack,
}) => {
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'code' | 'reset'>(initialScreen);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('ivan@mail.ru');
  const [phone, setPhone] = useState('+7 (900) 123-45-67');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation error states per field & banner
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [toastError, setToastError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);

  // OTP Code verification state
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (screen === 'code' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [screen, timer]);

  const switchScreen = (next: 'login' | 'register' | 'forgot' | 'code' | 'reset') => {
    setErrors({});
    setToastError(null);
    setToastSuccess(null);
    setScreen(next);
  };

  const findAccount = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');
    return accounts.find((acc) => {
      if (acc.email.toLowerCase() === clean) return true;
      if (cleanDigits.length >= 10 && acc.phone && acc.phone.replace(/\D/g, '') === cleanDigits) {
        return true;
      }
      return false;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idErr = validateEmailOrPhone(email);
    const passErr = !password ? 'Введите пароль' : password.length < 6 ? 'Минимум 6 символов' : null;

    if (idErr || passErr) {
      setErrors({ email: idErr, password: passErr });
      setToastError('Проверьте правильность заполнения полей');
      return;
    }

    const found = findAccount(email);
    if (!found) {
      setErrors({ email: 'Аккаунт не найден' });
      setToastError('Пользователь с таким email или телефоном не зарегистрирован');
      return;
    }

    if (found.password !== password) {
      setErrors({ password: 'Неверный пароль' });
      setToastError('Неправильный логин или пароль');
      return;
    }

    setErrors({});
    setToastError(null);
    onSuccess({
      name: found.name,
      email: found.email,
      phone: found.phone,
      bonuses: found.bonuses ?? 420,
      notificationsEnabled: found.notificationsEnabled ?? true,
    });
  };

  const demoAccount = accounts[0] || {
    name: 'Иван Петров',
    email: 'ivan@mail.ru',
    phone: '+7 (900) 123-45-67',
    password: 'password123',
    bonuses: 420,
    notificationsEnabled: true,
  };

  const handleDemoLogin = () => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setErrors({});
    setToastError(null);
    onSuccess({
      name: demoAccount.name,
      email: demoAccount.email,
      phone: demoAccount.phone,
      bonuses: demoAccount.bonuses ?? 420,
      notificationsEnabled: demoAccount.notificationsEnabled ?? true,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(name, 'Имя и фамилия');
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password, true);
    const confErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || phoneErr || passErr || confErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr,
        confirmPassword: confErr,
      });
      setToastError('Исправьте ошибки в форме регистрации');
      return;
    }

    if (findAccount(email)) {
      setErrors({ email: 'Этот email уже зарегистрирован' });
      setToastError('Аккаунт с таким email уже существует');
      return;
    }

    const newAcc: StoredAccount = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      bonuses: 100, // Приветственные бонусы
      notificationsEnabled: true,
    };

    onRegisterAccount(newAcc);
    onSuccess({
      name: newAcc.name,
      email: newAcc.email,
      phone: newAcc.phone,
      bonuses: newAcc.bonuses,
      notificationsEnabled: newAcc.notificationsEnabled,
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idErr = validateEmailOrPhone(email);
    if (idErr) {
      setErrors({ email: idErr });
      return;
    }
    const found = findAccount(email);
    if (!found) {
      setErrors({ email: 'Пользователь с такими данными не найден' });
      return;
    }
    setErrors({});
    setToastSuccess('Код подтверждения отправлен (для демо введите 1234 или любые 4 цифры)');
    setTimer(45);
    setTimeout(() => {
      setToastSuccess(null);
      setScreen('code');
    }, 1000);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4 || !/^\d{4}$/.test(code)) {
      setErrors({ otp: 'Введите все 4 цифры кода подтверждения' });
      return;
    }
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setScreen('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passErr = validatePassword(password, true);
    const confErr = validateConfirmPassword(password, confirmPassword);
    if (passErr || confErr) {
      setErrors({ password: passErr, confirmPassword: confErr });
      return;
    }
    onUpdatePassword(email, password);
    setErrors({});
    setToastSuccess('Пароль успешно изменён и сохранён!');
    setTimeout(() => {
      setToastSuccess(null);
      setScreen('login');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121214] text-white p-6 overflow-y-auto animate-fade-in relative">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            if (screen === 'reset') switchScreen('code');
            else if (screen === 'code') switchScreen('forgot');
            else if (screen === 'forgot' || screen === 'register') switchScreen('login');
            else onBack();
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#E52E84] hover:text-[#F03A92] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* Quick state switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => switchScreen('login')}
            className={`text-[10px] px-2.5 py-1 rounded-lg cursor-pointer ${
              screen === 'login' ? 'bg-[#E52E84] text-white font-bold' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => switchScreen('register')}
            className={`text-[10px] px-2.5 py-1 rounded-lg cursor-pointer ${
              screen === 'register' ? 'bg-[#E52E84] text-white font-bold' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            Регистрация
          </button>
        </div>
      </div>

      {/* Screen 11.1: LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="mb-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Вход</h1>
            <p className="text-sm text-neutral-400 mt-1">Войдите в свой аккаунт Киномакс</p>
          </div>

          {toastError && (
            <div className="mb-4 bg-red-950/75 text-red-200 text-xs p-3 rounded-2xl border border-red-500/50 flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2 font-medium leading-snug">
                <ShieldAlert size={16} className="text-red-400 shrink-0" />
                <span>{toastError}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastError(null)}
                className="text-red-300 hover:text-white shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Demo instant login button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="mb-4 p-3 rounded-2xl bg-[#1D1620] border border-[#E52E84]/40 hover:border-[#E52E84] flex items-center justify-between text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E52E84]/20 text-[#E52E84] flex items-center justify-center shrink-0">
                <Sparkles size={15} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Быстрый демо-вход</div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {demoAccount.email} / {demoAccount.password}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#E52E84]">Войти →</span>
          </button>

          <form onSubmit={handleLogin} noValidate className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                  if (toastError) setToastError(null);
                }}
                placeholder="ivan@mail.ru или +7..."
                className={`w-full px-4 py-3.5 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-400' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Пароль *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                  if (toastError) setToastError(null);
                }}
                placeholder="Минимум 6 символов"
                className={`w-full px-4 py-3.5 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-400' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1 font-medium">{errors.password}</p>
              )}
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
              type="button"
              onClick={() => switchScreen('forgot')}
              className="text-xs font-medium text-[#E52E84] hover:underline cursor-pointer"
            >
              Забыли пароль?
            </button>
          </div>

          {/* Social SSO Divider */}
          <div className="mt-6">
            <div className="relative text-center mb-4">
              <span className="text-xs text-neutral-500 bg-[#121214] px-3 relative z-10">
                или войдите через
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/80 -z-0" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  onSuccess({
                    name: 'Иван (Telegram)',
                    email: 'tg_user@mail.ru',
                    phone: '+7 (900) 555-35-35',
                    bonuses: 250,
                  })
                }
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#2AABEE]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.65-.53.81-1.08.5l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.22-.05-.34-.38-.13l-6.87 4.33-2.96-.92c-.64-.2-.66-.64.14-.95l11.55-4.45c.54-.2 1.01.13.86.92z" />
                </svg>
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onSuccess({
                    name: 'Иван (VK)',
                    email: 'vk_user@mail.ru',
                    phone: '+7 (900) 777-11-22',
                    bonuses: 250,
                  })
                }
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#26262A] hover:bg-[#323238] rounded-2xl text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#0077FF]" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C3.592 0 0 3.592 0 8.316v7.368C0 20.408 3.592 24 8.316 24h7.368C20.408 24 24 20.408 24 15.684V8.316C24 3.592 20.408 0 15.684 0zm3.692 17.106h-1.744c-.66 0-.862-.525-2.05-1.713-1.033-1.01-1.492-1.139-1.748-1.139-.36 0-.462.103-.462.6v1.652c0 .422-.134.6-1.242.6-1.833 0-3.87-1.112-5.3-3.178-2.15-3.04-2.736-5.328-2.736-5.795 0-.256.103-.493.6-.493h1.744c.444 0 .61.205.782.688.857 2.49 2.296 4.674 2.894 4.674.223 0 .324-.103.324-.666V9.407c-.07-.942-.55-1.025-.55-1.36 0-.16.136-.324.36-.324h2.285c.38 0 .513.205.513.637v3.428c0 .37.166.493.275.493.223 0 .41-.123.823-.538 1.282-1.439 2.193-3.665 2.193-3.665.12-.256.326-.493.77-.493h1.744c.52 0 .633.27.52.637-.22 1.02-2.33 3.99-2.33 3.99-.18.29-.25.42 0 .75.358.47 1.54 1.51 2.33 2.62.59.83.33 1.54-.25 1.54z" />
                </svg>
                <span>VK</span>
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 text-center text-xs text-neutral-400">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={() => switchScreen('register')}
              className="text-[#E52E84] font-semibold hover:underline cursor-pointer"
            >
              Создать
            </button>
          </div>
        </div>
      )}

      {/* Screen 12: REGISTRATION SCREEN */}
      {screen === 'register' && (
        <div className="flex-1 flex flex-col animate-slide-up">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Регистрация</h1>
            <p className="text-sm text-neutral-400 mt-1">Создайте новый аккаунт (+100 бонусов)</p>
          </div>

          {toastError && (
            <div className="mb-3 bg-red-950/75 text-red-200 text-xs p-3 rounded-2xl border border-red-500/50 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-400 shrink-0" />
              <span>{toastError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} noValidate className="space-y-3">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Имя и фамилия *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholder="Иван Петров"
                className={`w-full px-4 py-3 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.name ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                placeholder="ivan@mail.ru"
                className={`w-full px-4 py-3 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.email ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Телефон *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneInput(e.target.value));
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                placeholder="+7 (900) 123-45-67"
                className={`w-full px-4 py-3 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.phone ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Пароль *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                placeholder="Мин. 6 символов, буквы и цифры"
                className={`w-full px-4 py-3 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.password ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Подтвердите пароль *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                placeholder="Повторите пароль"
                className={`w-full px-4 py-3 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Зарегистрироваться
            </button>
          </form>

          <div className="mt-auto pt-4 text-center text-xs text-neutral-400">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => switchScreen('login')}
              className="text-[#E52E84] font-semibold hover:underline cursor-pointer"
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
              Введите email или телефон, привязанный к аккаунту, и мы отправим код
            </p>
          </div>

          {toastSuccess && (
            <div className="mb-4 bg-[#26262A] border border-[#E52E84]/50 text-white text-xs p-4 rounded-2xl shadow-xl">
              <div className="font-semibold text-[#E52E84] mb-1">Восстановление пароля</div>
              <p className="text-neutral-300">{toastSuccess}</p>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Email или телефон *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                placeholder="ivan@mail.ru"
                className={`w-full px-4 py-3.5 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.email ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
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
              Мы отправили 4-значный код на <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleCodeSubmit} noValidate className="space-y-6">
            <div>
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(-1);
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                      if (errors.otp) setErrors({ ...errors, otp: null });
                      if (val && idx < 3) {
                        otpRefs.current[idx + 1]?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                        otpRefs.current[idx - 1]?.focus();
                      }
                    }}
                    className={`w-14 h-16 text-center text-2xl font-bold bg-[#26262A] border focus:outline-none rounded-2xl text-white transition-colors ${
                      errors.otp ? 'border-red-500' : 'border-neutral-700 focus:border-[#E52E84]'
                    }`}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-[11px] text-red-400 text-center mt-2">{errors.otp}</p>}
            </div>

            <div className="text-center text-xs text-neutral-400">
              {timer > 0 ? (
                <span>
                  Отправить код повторно через{' '}
                  <span className="text-[#E52E84] font-semibold">0:{timer.toString().padStart(2, '0')}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-[#E52E84] font-semibold hover:underline cursor-pointer"
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
              Создайте новый надёжный пароль
            </p>
          </div>

          {toastSuccess && (
            <div className="mb-4 bg-emerald-950/80 border border-emerald-500/50 text-white text-xs p-4 rounded-2xl shadow-xl flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-200">{toastSuccess}</span>
            </div>
          )}

          <form onSubmit={handleResetSubmit} noValidate className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">Аккаунт</label>
              <input
                type="text"
                disabled
                value={email}
                className="w-full px-4 py-3.5 bg-[#1C1C1F] border border-neutral-800 text-neutral-400 rounded-2xl text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">Новый пароль *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                placeholder="Мин. 6 символов, буквы и цифры"
                className={`w-full px-4 py-3.5 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.password ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
                Подтвердите пароль *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                placeholder="Повторите пароль"
                className={`w-full px-4 py-3.5 bg-[#26262A] border focus:outline-none rounded-2xl text-sm text-white placeholder-neutral-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-neutral-800 focus:border-[#E52E84]'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-pink-900/40 cursor-pointer"
            >
              Подтвердить смену пароля
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
