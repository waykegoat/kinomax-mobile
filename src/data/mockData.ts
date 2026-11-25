import bitvaPoster from '../assets/bitva_motorov_poster.jpg';
import sumerkiPoster from '../assets/sumerki_poster.jpg';
import kolobokPoster from '../assets/kolobok_poster.jpg';
import dunePoster from '../assets/dune2_poster.jpg';

export interface Movie {
  id: string;
  title: string;
  age: string;
  duration: string;
  durationMinutes: number;
  genre: string;
  rating?: string;
  description: string;
  priceFrom: number;
  dates: string[];
  dateFrom?: string;
  dateTo?: string;
  bannerGradient: string;
  posterBg: string;
  posterImage?: string;
  tagColor?: string;
  hallId?: string;
  showtimes: {
    time: string;
    format: string;
    price: number;
    hall: string;
  }[];
}

export interface Hall {
  id: string;
  name: string;
  type: 'standard' | 'vip' | 'imax';
  rows: number;
  seatsPerRow: number;
  priceModifier: number;
  description: string;
}

export interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  date: string;
  time: string;
  hall: string;
  seats: string;
  rawSeats?: string[];
  price: number;
  qrCode: string;
  isExpired?: boolean;
  bgGradient: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bonuses?: number;
  notificationsEnabled?: boolean;
}

export interface StoredAccount extends UserProfile {
  password: string;
}

export interface SavedCard {
  id: string;
  label: string;
  number: string;
  last4: string;
  expiry: string;
}

export interface GiftCertificate {
  id: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  message: string;
  code: string;
  createdAt: string;
}

export interface PurchaseStats {
  totalSold: number;
  totalWatched: number;
  totalRefunded: number;
  totalRevenue: number;
  refundedRevenue: number;
  movieStats: {
    [movieId: string]: {
      movieTitle: string;
      soldCount: number;
      revenue: number;
      refundCount: number;
    };
  };
  recentTransactions: {
    id: string;
    movieTitle: string;
    type: 'purchase' | 'refund';
    amount: number;
    seats: string;
    date: string;
    time: string;
  }[];
}

export const CINEMA_INFO = {
  brand: 'КИНОМАКС',
  title: 'КИНОМАКС-БУРЕВЕСТНИК ВЛАДИМИР',
  address: 'пр. Ленина, д. 29',
  tags: ['БОЛЬШОЙ ЭКРАН', 'ЛАЗЕРНЫЙ RGB ПРОЕКТОР'],
};

export const INITIAL_HALLS: Hall[] = [
  {
    id: 'hall-1',
    name: 'Зал 1',
    type: 'standard',
    rows: 6,
    seatsPerRow: 10,
    priceModifier: 0,
    description: 'Стандартный комфортный зал с лазерным RGB проектором',
  },
  {
    id: 'hall-2',
    name: 'Зал 2 VIP',
    type: 'vip',
    rows: 4,
    seatsPerRow: 6,
    priceModifier: 200,
    description: 'VIP зал с премиальными кожаными диванами-реклайнерами',
  },
  {
    id: 'hall-3',
    name: 'Зал 3 IMAX',
    type: 'imax',
    rows: 8,
    seatsPerRow: 12,
    priceModifier: 350,
    description: 'Гигантский экран IMAX Laser с 12-канальной акустикой',
  },
];

export const MOVIES: Movie[] = [
  {
    id: 'bitva-motorov',
    title: 'БИТВА МОТОРОВ',
    age: '16+',
    duration: '2 часа 32 минуты',
    durationMinutes: 152,
    genre: 'Приключения / Драма',
    rating: '8.4',
    description: 'В центре сюжета — гонки на мотоциклах. Два друга соревнуются за главный приз в захватывающем заезде, проверяющем их дружбу на прочность.',
    priceFrom: 350,
    dates: ['22 окт', '23 окт', '24 окт', '25 окт'],
    bannerGradient: 'from-amber-700 via-orange-950 to-neutral-950',
    posterBg: '#8A3B14',
    posterImage: bitvaPoster,
    hallId: 'hall-1',
    showtimes: [
      { time: '09:40', format: '2D', price: 350, hall: 'Зал 1' },
      { time: '12:40', format: 'IMAX', price: 700, hall: 'Зал 1' },
      { time: '13:50', format: '2D', price: 350, hall: 'Зал 2 VIP' },
      { time: '15:40', format: 'IMAX', price: 700, hall: 'Зал 1' },
    ],
  },
  {
    id: 'sumerki',
    title: 'Сумерки',
    age: '16+',
    duration: '2 часа 02 минуты',
    durationMinutes: 122,
    genre: 'Фэнтези / Мелодрама',
    rating: '7.8',
    description: 'Семнадцатилетняя девушка Белла переезжает к отцу в небольшой городок Форкс и влюбляется в загадочного одноклассника Эдварда, хранящего опасную тайну.',
    priceFrom: 350,
    dates: ['16 дек', '17 дек', '18 дек'],
    bannerGradient: 'from-sky-900 via-slate-900 to-neutral-950',
    posterBg: '#1e293b',
    posterImage: sumerkiPoster,
    hallId: 'hall-2',
    showtimes: [
      { time: '19:00', format: '2D', price: 350, hall: 'Зал 2 VIP' },
      { time: '21:30', format: '2D', price: 400, hall: 'Зал 2 VIP' },
    ],
  },
  {
    id: 'kolobok',
    title: 'Колобок',
    age: '0+',
    duration: '1 час 25 минут',
    durationMinutes: 85,
    genre: 'Мультфильм / Семейный',
    rating: '9.1',
    description: 'Красочное 3D-переосмысление любимой народной сказки с новыми приключениями, юмором и добрыми песнями для всей семьи.',
    priceFrom: 1500,
    dates: ['20 дек', '21 дек', '22 дек'],
    bannerGradient: 'from-amber-500 via-yellow-800 to-neutral-950',
    posterBg: '#d97706',
    posterImage: kolobokPoster,
    hallId: 'hall-1',
    showtimes: [
      { time: '11:00', format: '3D', price: 1500, hall: 'Зал 1' },
      { time: '14:30', format: '3D', price: 1500, hall: 'Зал 1' },
    ],
  },
  {
    id: 'dune-2',
    title: 'Дюна: Часть 2',
    age: '12+',
    duration: '2 часа 46 минут',
    durationMinutes: 166,
    genre: 'Фантастика / Боевик',
    rating: '8.9',
    description: 'Пол Атрейдес объединяется с Чани и фременами, чтобы отомстить заговорщикам, уничтожившим его семью, и предотвратить ужасное будущее галактики.',
    priceFrom: 450,
    dates: ['21 дек', '22 дек', '23 дек'],
    bannerGradient: 'from-orange-800 via-red-950 to-neutral-950',
    posterBg: '#9a3412',
    posterImage: dunePoster,
    hallId: 'hall-3',
    showtimes: [
      { time: '16:00', format: 'IMAX', price: 600, hall: 'Зал 3 IMAX' },
      { time: '19:00', format: 'IMAX', price: 700, hall: 'Зал 3 IMAX' },
      { time: '22:15', format: '2D', price: 450, hall: 'Зал 1' },
    ],
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-101',
    movieId: 'bitva-motorov',
    movieTitle: 'БИТВА МОТОРОВ',
    date: '22 окт 2024',
    time: '12:40',
    hall: 'Зал 1',
    seats: 'Ряд 5, место 4-5',
    rawSeats: ['5-4', '5-5'],
    price: 840,
    qrCode: 'KM-2024-BM-840-545',
    bgGradient: 'from-[#5e6bc4] to-[#454c9c]',
  },
  {
    id: 't-102',
    movieId: 'dune-2',
    movieTitle: 'ДЮНА: ЧАСТЬ 2',
    date: '21 дек 2024',
    time: '19:00',
    hall: 'Зал 3 IMAX',
    seats: 'Ряд 5, место 12',
    rawSeats: ['5-12'],
    price: 700,
    qrCode: 'KM-2024-D2-700-512',
    bgGradient: 'from-[#be548d] to-[#8d3664]',
  },
];

export const INITIAL_SAVED_CARDS: SavedCard[] = [
  {
    id: 'card-1',
    label: 'МИР',
    number: '•••• 4242',
    last4: '4242',
    expiry: '12/28',
  },
];

export const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    name: 'Иван Петров',
    email: 'ivan@mail.ru',
    phone: '+7 (900) 123-45-67',
    password: 'password123',
    bonuses: 420,
    notificationsEnabled: true,
  },
];

export const INITIAL_STATS: PurchaseStats = {
  totalSold: 284,
  totalWatched: 246,
  totalRefunded: 18,
  totalRevenue: 154200,
  refundedRevenue: 9800,
  movieStats: {
    'bitva-motorov': {
      movieTitle: 'БИТВА МОТОРОВ',
      soldCount: 128,
      revenue: 68400,
      refundCount: 7,
    },
    'dune-2': {
      movieTitle: 'ДЮНА: ЧАСТЬ 2',
      soldCount: 96,
      revenue: 54600,
      refundCount: 5,
    },
    'sumerki': {
      movieTitle: 'Сумерки',
      soldCount: 38,
      revenue: 14200,
      refundCount: 4,
    },
    'kolobok': {
      movieTitle: 'Колобок',
      soldCount: 22,
      revenue: 17000,
      refundCount: 2,
    },
  },
  recentTransactions: [
    {
      id: 'tx-501',
      movieTitle: 'БИТВА МОТОРОВ',
      type: 'purchase',
      amount: 840,
      seats: 'Ряд 5, место 4-5',
      date: 'Сегодня',
      time: '12:15',
    },
    {
      id: 'tx-502',
      movieTitle: 'ДЮНА: ЧАСТЬ 2',
      type: 'purchase',
      amount: 700,
      seats: 'Ряд 5, место 12',
      date: 'Сегодня',
      time: '11:40',
    },
    {
      id: 'tx-503',
      movieTitle: 'Сумерки',
      type: 'refund',
      amount: 350,
      seats: 'Ряд 3, место 8',
      date: 'Вчера',
      time: '18:22',
    },
    {
      id: 'tx-504',
      movieTitle: 'БИТВА МОТОРОВ',
      type: 'purchase',
      amount: 700,
      seats: 'Ряд 4, место 6',
      date: 'Вчера',
      time: '16:05',
    },
    {
      id: 'tx-505',
      movieTitle: 'Колобок',
      type: 'purchase',
      amount: 1500,
      seats: 'Ряд 2, место 3',
      date: '21 ноя',
      time: '14:10',
    },
  ],
};

export const SEARCH_HISTORY_ITEMS = [
  'фильмы декабря',
  'театральные спектакли',
  'кино-премьеры',
];
