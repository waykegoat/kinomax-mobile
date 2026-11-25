import React, { useState } from 'react';
import {
  Upload,
  Calendar,
  Clock,
  Film,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import type { Movie, Hall } from '../../data/mockData';

interface AdminAddMovieProps {
  halls: Hall[];
  existingMovies?: Movie[];
  initialMovie?: Movie | null;
  onSaveMovie: (movie: Movie) => void;
  onCancel: () => void;
}

const PRESET_POSTERS = [
  {
    title: 'Гладиатор 2',
    genre: 'Боевик / Драма / Исторический',
    age: '18+',
    duration: 148,
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    color: '#991b1b',
  },
  {
    title: 'Интерстеллар',
    genre: 'Фантастика / Драма',
    age: '12+',
    duration: 169,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    color: '#1e3a8a',
  },
  {
    title: 'Аватар: Путь воды',
    genre: 'Фантастика / Приключения',
    age: '12+',
    duration: 192,
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    color: '#0e7490',
  },
  {
    title: 'Оппенгеймер',
    genre: 'Биография / Драма / История',
    age: '18+',
    duration: 180,
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    color: '#c2410c',
  },
];

interface ScheduledSession {
  id: string;
  time: string;
  format: '2D' | '3D' | 'IMAX';
  hallName: string;
  price: number;
}

const formatDatesFromRange = (fromStr: string, toStr: string): string[] => {
  const start = new Date(fromStr);
  const end = new Date(toStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return ['Сегодня', 'Завтра'];
  }
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const result: string[] = [];
  const cur = new Date(start);
  let count = 0;
  while (cur <= end && count < 7) {
    result.push(`${cur.getDate()} ${months[cur.getMonth()]}`);
    cur.setDate(cur.getDate() + 1);
    count++;
  }
  return result.length > 0 ? result : ['Сегодня'];
};

export const AdminAddMovie: React.FC<AdminAddMovieProps> = ({
  halls,
  initialMovie = null,
  onSaveMovie,
  onCancel,
}) => {
  const isEditing = Boolean(initialMovie);
  const defaultHall = halls.find((h) => h.id === initialMovie?.hallId) || halls[0];

  const [title, setTitle] = useState(initialMovie?.title || '');
  const [genre, setGenre] = useState(initialMovie?.genre || 'Фантастика / Приключения');
  const [age, setAge] = useState(initialMovie?.age || '16+');
  const [durationMinutes, setDurationMinutes] = useState<number>(initialMovie?.durationMinutes || 135);
  const [basePrice, setBasePrice] = useState<number>(initialMovie?.priceFrom || 380);
  const [description, setDescription] = useState(initialMovie?.description || '');
  const [posterImage, setPosterImage] = useState<string>(initialMovie?.posterImage || '');
  const [posterBg, setPosterBg] = useState(initialMovie?.posterBg || '#221c2c');

  const [dateFrom, setDateFrom] = useState(() => {
    if (initialMovie?.dateFrom) return initialMovie.dateFrom;
    return new Date().toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => {
    if (initialMovie?.dateTo) return initialMovie.dateTo;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const [selectedHallId, setSelectedHallId] = useState(defaultHall?.id || 'hall-1');
  const selectedHall = halls.find((h) => h.id === selectedHallId) || halls[0];

  const [sessions, setSessions] = useState<ScheduledSession[]>(() => {
    if (initialMovie && initialMovie.showtimes.length > 0) {
      return initialMovie.showtimes.map((st, idx) => ({
        id: `init-${idx}-${Date.now()}`,
        time: st.time,
        format: (st.format === '3D' || st.format === 'IMAX' ? st.format : '2D') as '2D' | '3D' | 'IMAX',
        hallName: st.hall,
        price: st.price,
      }));
    }
    return [
      {
        id: 's-1',
        time: '11:00',
        format: '2D',
        hallName: defaultHall?.name || 'Зал 1',
        price: 380 + (defaultHall?.priceModifier || 0),
      },
      {
        id: 's-2',
        time: '14:30',
        format: '2D',
        hallName: defaultHall?.name || 'Зал 1',
        price: 420 + (defaultHall?.priceModifier || 0),
      },
      {
        id: 's-3',
        time: '18:00',
        format: '2D',
        hallName: defaultHall?.name || 'Зал 1',
        price: 450 + (defaultHall?.priceModifier || 0),
      },
    ];
  });

  const [newSessionTime, setNewSessionTime] = useState('21:15');
  const [newSessionFormat, setNewSessionFormat] = useState<'2D' | '3D' | 'IMAX'>('2D');

  const [formError, setFormError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const formatDurationText = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} минут`;
    if (m === 0) return `${h} ч.`;
    return `${h} ч. ${m} мин.`;
  };

  const calculateEndTime = (timeStr: string, durMins: number, bufferMins = 15) => {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMins = h * 60 + m + durMins + bufferMins;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const checkCollision = (time1: string, time2: string, durMins: number) => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const start1 = h1 * 60 + m1;
    const end1 = start1 + durMins + 15;
    const start2 = h2 * 60 + m2;
    const end2 = start2 + durMins + 15;
    return Math.max(start1, start2) < Math.min(end1, end2);
  };

  const detectCollisions = () => {
    const collisions: string[] = [];
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        if (
          sessions[i].hallName === sessions[j].hallName &&
          checkCollision(sessions[i].time, sessions[j].time, durationMinutes)
        ) {
          collisions.push(
            `Сеанс ${sessions[i].time} пересекается с ${sessions[j].time} в ${sessions[i].hallName}`
          );
        }
      }
    }
    return collisions;
  };

  const collisionList = detectCollisions();

  const handleHallSelect = (hall: Hall) => {
    setSelectedHallId(hall.id);
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        hallName: hall.name,
        price: basePrice + hall.priceModifier + (s.format === '3D' ? 50 : s.format === 'IMAX' ? 150 : 0),
      }))
    );
  };

  const handleAutoGenerateShowtimes = () => {
    const safeDur = Math.max(30, Math.min(300, durationMinutes || 120));
    const safePrice = Math.max(100, basePrice || 350);
    const startTotalMins = 10 * 60;
    const endTotalMins = 23 * 60 + 30;
    const blockMins = safeDur + 20;
    const generated: ScheduledSession[] = [];
    let currentMins = startTotalMins;
    let idx = 1;

    while (currentMins + safeDur <= endTotalMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const format = selectedHall?.type === 'imax' ? 'IMAX' : idx % 2 === 0 ? '3D' : '2D';
      const price = safePrice + (selectedHall?.priceModifier || 0) + (format === '3D' ? 50 : 0);

      generated.push({
        id: `auto-${idx}-${Date.now()}`,
        time: timeStr,
        format,
        hallName: selectedHall?.name || 'Зал 1',
        price,
      });

      currentMins += blockMins;
      idx++;
    }

    setSessions(generated);
    setSessionError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors({ ...fieldErrors, poster: 'Размер файла не должен превышать 5 МБ' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPosterImage(reader.result);
        setFieldErrors({ ...fieldErrors, poster: null });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: (typeof PRESET_POSTERS)[0]) => {
    setTitle(preset.title);
    setGenre(preset.genre);
    setAge(preset.age);
    setDurationMinutes(preset.duration);
    setPosterImage(preset.url);
    setPosterBg(preset.color);
    setFieldErrors({});
    setFormError(null);
    if (!description.trim()) {
      setDescription(
        `Захватывающая премьера мирового кинематографа: ${preset.title}. Эксклюзивно в Киномакс.`
      );
    }
  };

  const handleAddSession = () => {
    if (!newSessionTime || !/^\d{2}:\d{2}$/.test(newSessionTime)) {
      setSessionError('Укажите корректное время сеанса (ЧЧ:ММ)');
      return;
    }
    const currentHallName = selectedHall?.name || 'Зал 1';
    const hasConflict = sessions.some(
      (s) => s.hallName === currentHallName && checkCollision(s.time, newSessionTime, durationMinutes)
    );
    if (hasConflict) {
      setSessionError(
        `Время ${newSessionTime} пересекается с существующим сеансом в ${currentHallName} (с учётом ${durationMinutes} мин + 15 мин уборка)`
      );
      return;
    }

    setSessionError(null);
    const price =
      (basePrice || 350) +
      (selectedHall?.priceModifier || 0) +
      (newSessionFormat === '3D' ? 50 : newSessionFormat === 'IMAX' ? 150 : 0);

    const newS: ScheduledSession = {
      id: `s-${Date.now()}`,
      time: newSessionTime,
      format: newSessionFormat,
      hallName: currentHallName,
      price,
    };
    setSessions([...sessions, newS].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleRemoveSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    setSessionError(null);
  };

  const handleDatePreset = (days: number) => {
    const from = new Date(dateFrom);
    if (isNaN(from.getTime())) return;
    from.setDate(from.getDate() + days);
    setDateTo(from.toISOString().split('T')[0]);
    setFieldErrors({ ...fieldErrors, dates: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: Record<string, string | null> = {};

    if (!title.trim()) nextErrs.title = 'Укажите название фильма';
    else if (title.trim().length < 2) nextErrs.title = 'Минимум 2 символа';

    if (!genre.trim()) nextErrs.genre = 'Укажите жанр фильма';

    if (!durationMinutes || isNaN(durationMinutes) || durationMinutes < 30 || durationMinutes > 300) {
      nextErrs.duration = 'Длительность от 30 до 300 мин';
    }

    if (!basePrice || isNaN(basePrice) || basePrice < 100 || basePrice > 10000) {
      nextErrs.price = 'Цена от 100 до 10 000 ₽';
    }

    if (!description.trim() || description.trim().length < 10) {
      nextErrs.description = 'Добавьте описание сюжета (минимум 10 символов)';
    }

    if (!dateFrom || !dateTo) {
      nextErrs.dates = 'Укажите обе даты периода проката';
    } else if (dateFrom > dateTo) {
      nextErrs.dates = 'Дата начала проката не может быть позже даты окончания';
    }

    if (sessions.length === 0) {
      nextErrs.sessions = 'Добавьте хотя бы один сеанс для фильма';
    } else if (collisionList.length > 0) {
      nextErrs.sessions = 'Устраните пересечения сеансов в одном зале';
    }

    if (Object.values(nextErrs).some(Boolean)) {
      setFieldErrors(nextErrs);
      setFormError('Проверьте правильность заполнения формы');
      return;
    }

    const movieId = initialMovie?.id || `movie-${Date.now()}`;
    const minPrice = Math.min(...sessions.map((s) => s.price));
    const computedDates = formatDatesFromRange(dateFrom, dateTo);

    const savedMovie: Movie = {
      id: movieId,
      title: title.trim(),
      age,
      duration: formatDurationText(durationMinutes),
      durationMinutes,
      genre: genre.trim(),
      rating: initialMovie?.rating || '8.5',
      description: description.trim(),
      priceFrom: minPrice,
      dates: computedDates,
      dateFrom,
      dateTo,
      bannerGradient: initialMovie?.bannerGradient || 'from-pink-900 via-neutral-900 to-neutral-950',
      posterBg: posterBg || '#221c2c',
      posterImage: posterImage || undefined,
      tagColor: '#E52E84',
      hallId: selectedHallId,
      showtimes: sessions.map((s) => ({
        time: s.time,
        format: s.format,
        price: s.price,
        hall: s.hallName,
      })),
    };

    onSaveMovie(savedMovie);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5 text-white pb-24">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-black text-white">
            {isEditing ? 'Редактирование фильма' : 'Добавление фильма'}
          </h2>
          <p className="text-[11px] text-neutral-400">
            Заполните параметры, выберите зал и настройте сеансы
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-800 cursor-pointer"
        >
          Отмена
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-red-950/80 border border-red-500/60 text-red-200 rounded-2xl text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Preset Poster Selector */}
      {!isEditing && (
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#E52E84]" />
            <span>Быстрый выбор популярной премьеры</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_POSTERS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="p-2 bg-[#1A1A1E] border border-neutral-800 hover:border-[#E52E84] rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer group"
              >
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-9 h-12 object-cover rounded-md shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{preset.title}</div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {preset.age} • {preset.duration} мин
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Section 1: Movie Data */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3.5 shadow-lg">
          <div className="text-xs font-black uppercase tracking-wider text-pink-400">
            1. Данные о фильме
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Название фильма *
            </label>
            <input
              type="text"
              placeholder="Например, Гладиатор 2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: null });
              }}
              className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                fieldErrors.title ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
              }`}
            />
            {fieldErrors.title && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Poster File Upload */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1.5">
              Изображение / Постер
            </label>
            <div className="flex gap-3 items-center">
              {posterImage ? (
                <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-pink-500/40 relative">
                  <img src={posterImage} alt="Постер" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPosterImage('')}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-14 h-20 rounded-xl bg-neutral-900 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-neutral-500 text-center p-1">
                  <Film size={18} />
                  <span className="text-[8px] mt-1">Нет фото</span>
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-neutral-700/60">
                  <Upload size={14} className="text-[#E52E84]" />
                  <span>Загрузить постер с устройства</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="text-[10px] text-neutral-400">
                  Поддерживаются форматы JPG, PNG, WebP (до 5 МБ)
                </div>
                {fieldErrors.poster && (
                  <p className="text-[10px] text-red-400">{fieldErrors.poster}</p>
                )}
              </div>
            </div>
          </div>

          {/* Genre and Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">Жанр *</label>
              <input
                type="text"
                placeholder="Боевик / Драма"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  if (fieldErrors.genre) setFieldErrors({ ...fieldErrors, genre: null });
                }}
                className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  fieldErrors.genre ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
              {fieldErrors.genre && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.genre}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">Возраст</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#121214] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E52E84]"
              >
                <option value="0+">0+</option>
                <option value="6+">6+</option>
                <option value="12+">12+</option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
              </select>
            </div>
          </div>

          {/* Duration and Base Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-neutral-400">Длительность (мин) *</label>
                <span className="text-[10px] font-mono text-pink-400 font-bold">
                  {formatDurationText(durationMinutes || 0)}
                </span>
              </div>
              <input
                type="number"
                min={30}
                max={300}
                value={durationMinutes || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setDurationMinutes(isNaN(val) ? 0 : val);
                  if (fieldErrors.duration) setFieldErrors({ ...fieldErrors, duration: null });
                }}
                className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  fieldErrors.duration ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
              {fieldErrors.duration && (
                <p className="text-[10px] text-red-400 mt-1">{fieldErrors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Базовая цена (₽) *
              </label>
              <input
                type="number"
                min={100}
                max={10000}
                value={basePrice || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBasePrice(isNaN(val) ? 0 : val);
                  if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: null });
                }}
                className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  fieldErrors.price ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
              {fieldErrors.price && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.price}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Описание сюжета *
            </label>
            <textarea
              rows={2}
              placeholder="Краткое описание фильма для гостей кинотеатра (мин. 10 символов)..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: null });
              }}
              className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none ${
                fieldErrors.description ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-[10px] text-red-400 mt-1">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* Section 2: Screening Dates Range */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center justify-between">
            <span>2. Период проката фильма</span>
            <Calendar size={14} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Дата начала (С) *
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  if (fieldErrors.dates) setFieldErrors({ ...fieldErrors, dates: null });
                }}
                className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  fieldErrors.dates ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Дата окончания (По) *
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  if (fieldErrors.dates) setFieldErrors({ ...fieldErrors, dates: null });
                }}
                className={`w-full bg-[#121214] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                  fieldErrors.dates ? 'border-red-500' : 'border-neutral-700/80 focus:border-[#E52E84]'
                }`}
              />
            </div>
          </div>

          {fieldErrors.dates && <p className="text-[10px] text-red-400">{fieldErrors.dates}</p>}

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-neutral-400">Быстро:</span>
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDatePreset(d)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-[10px] cursor-pointer"
              >
                +{d === 30 ? '1 месяц' : `${d} дней`}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Cinema Hall Assignment */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="text-xs font-black uppercase tracking-wider text-pink-400">
            3. Назначение кинозала
          </div>

          <div className="grid grid-cols-1 gap-2">
            {halls.map((h) => {
              const isSelected = h.id === selectedHallId;
              const seats = h.rows * h.seatsPerRow;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleHallSelect(h)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#291724] border-[#E52E84] shadow-md shadow-pink-900/30'
                      : 'bg-[#121214] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${isSelected ? 'bg-[#E52E84]' : 'bg-neutral-700'}`}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{h.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-pink-300">
                          {h.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {h.rows} рядов × {h.seatsPerRow} мест ({seats} мест)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-pink-400">+{h.priceModifier} ₽</div>
                    <div className="text-[10px] text-neutral-500">к билету</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Showtime Scheduler */}
        <div className="bg-[#1A1A1E] border border-neutral-800 rounded-2xl p-4 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <Clock size={14} />
              <span>4. Расписание сеансов</span>
            </div>
            <button
              type="button"
              onClick={handleAutoGenerateShowtimes}
              className="text-[10px] font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <Sparkles size={11} />
              <span>Авто-расписание</span>
            </button>
          </div>

          <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-[11px] space-y-1">
            <div className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <Info size={13} className="text-[#E52E84]" />
              <span>Расчёт тайминга с учётом длительности:</span>
            </div>
            <div className="text-neutral-400">
              Фильм <strong className="text-white">{durationMinutes || 0} мин.</strong> + 15 мин. уборка ={' '}
              <strong className="text-pink-400">{(durationMinutes || 0) + 15} мин.</strong>
            </div>
          </div>

          {collisionList.length > 0 && (
            <div className="p-3 bg-red-950/80 border border-red-500/70 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <span>Конфликт расписания!</span>
              </div>
              {collisionList.map((c, i) => (
                <div key={i} className="text-[11px] text-red-200">
                  • {c}
                </div>
              ))}
            </div>
          )}

          {fieldErrors.sessions && (
            <p className="text-[11px] text-red-400 font-medium">{fieldErrors.sessions}</p>
          )}

          {/* Current Sessions List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Назначенные сеансы ({sessions.length})
            </div>

            {sessions.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500 bg-[#121214] rounded-xl">
                Сеансы ещё не добавлены
              </div>
            ) : (
              sessions.map((s) => {
                const endTime = calculateEndTime(s.time, durationMinutes || 120);
                return (
                  <div
                    key={s.id}
                    className="p-2.5 bg-[#121214] border border-neutral-800/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="px-2 py-1 rounded-lg bg-pink-950/50 border border-pink-500/30 text-white font-mono text-xs font-bold">
                        {s.time}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                          <span>
                            {s.time} – {endTime}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-pink-300">
                            {s.format}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {s.hallName} • {s.price} ₽
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSession(s.id)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Add New Session Row */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-2">
            <div className="text-[11px] font-bold text-neutral-400">Добавить сеанс вручную:</div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newSessionTime}
                onChange={(e) => {
                  setNewSessionTime(e.target.value);
                  if (sessionError) setSessionError(null);
                }}
                className="bg-[#121214] border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E52E84]"
              />
              <select
                value={newSessionFormat}
                onChange={(e) => setNewSessionFormat(e.target.value as '2D' | '3D' | 'IMAX')}
                className="bg-[#121214] border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E52E84]"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
              <button
                type="button"
                onClick={handleAddSession}
                className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Добавить</span>
              </button>
            </div>
            {sessionError && <p className="text-[10px] text-red-400 mt-1">{sessionError}</p>}
          </div>
        </div>

        {/* Save CTA */}
        <button
          type="submit"
          className="w-full py-3.5 bg-[#E52E84] hover:bg-[#F03A92] active:scale-98 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-pink-900/40 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check size={16} />
          <span>{isEditing ? 'Сохранить изменения фильма' : 'Опубликовать фильм в расписание'}</span>
        </button>
      </form>
    </div>
  );
};
