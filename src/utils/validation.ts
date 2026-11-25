export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!trimmed) return 'Укажите email';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'Некорректный формат email (пример: ivan@mail.ru)';
  }
  return null;
};

export const formatPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  let clean = digits;
  if (clean.startsWith('8') && clean.length > 1) clean = '7' + clean.slice(1);
  else if (clean === '8') return '+7';
  else if (!clean.startsWith('7')) clean = '7' + clean;
  clean = clean.slice(0, 11);

  let result = '+7';
  if (clean.length > 1) result += ' (' + clean.slice(1, 4);
  if (clean.length > 4) result += ') ' + clean.slice(4, 7);
  if (clean.length > 7) result += '-' + clean.slice(7, 9);
  if (clean.length > 9) result += '-' + clean.slice(9, 11);
  return result;
};

export const validatePhone = (phone: string): string | null => {
  const trimmed = phone.trim();
  if (!trimmed) return 'Укажите номер телефона';
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length !== 11 || (!digits.startsWith('7') && !digits.startsWith('8'))) {
    return 'Введите корректный телефон (11 цифр, +7...)';
  }
  return null;
};

export const validateEmailOrPhone = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Введите email или номер телефона';
  if (trimmed.includes('@') || /[a-zA-Z]/.test(trimmed)) {
    return validateEmail(trimmed);
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) {
    return 'Введите корректный email или телефон из 11 цифр';
  }
  return validatePhone(trimmed);
};

export const validateName = (name: string, fieldLabel = 'Имя'): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return `Укажите ${fieldLabel.toLowerCase()}`;
  if (trimmed.length < 2) return `${fieldLabel} должно содержать минимум 2 символа`;
  if (trimmed.length > 50) return `${fieldLabel} не должно превышать 50 символов`;
  if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(trimmed)) {
    return 'Используйте только буквы, пробелы и дефис';
  }
  return null;
};

export const validatePassword = (password: string, requireComplex = false): string | null => {
  if (!password) return 'Введите пароль';
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
  if (requireComplex && (!/[a-zA-Zа-яА-ЯёЁ]/.test(password) || !/\d/.test(password))) {
    return 'Пароль должен содержать хотя бы одну букву и цифру';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string): string | null => {
  if (!confirm) return 'Повторите пароль';
  if (password !== confirm) return 'Пароли не совпадают';
  return null;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const detectCardBrand = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('2')) return 'МИР';
  if (digits.startsWith('4')) return 'Visa';
  if (digits.startsWith('5')) return 'Mastercard';
  return 'Банковская карта';
};

export const validateCardNumber = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Введите номер карты';
  if (digits.length !== 16) return 'Номер карты должен содержать ровно 16 цифр';
  if (/^0+$/.test(digits)) return 'Некорректный номер карты';
  return null;
};

export const formatCardExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const validateCardExpiry = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Укажите срок действия';
  if (!/^\d{2}\/\d{2}$/.test(trimmed)) return 'Укажите срок в формате ММ/ГГ';
  const [mmStr, yyStr] = trimmed.split('/');
  const mm = parseInt(mmStr, 10);
  const yy = parseInt(yyStr, 10);
  if (mm < 1 || mm > 12) return 'Некорректный месяц (от 01 до 12)';
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY || (yy === curYY && mm < curMM)) {
    return 'Срок действия карты истёк';
  }
  return null;
};

export const validateCardCvv = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Введите CVV/CVC';
  if (digits.length !== 3) return 'CVV/CVC код должен состоять из 3 цифр';
  return null;
};

export const getStorageItem = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
};
