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
  price: number;
  qrCode: string;
  isExpired?: boolean;
  bgGradient: string;
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
  title: 'КИНОМАКС · ВЛАДИМИР',
  city: 'Владимир',
  branch: 'Буревестник',
  address: 'Буревестник · пр. Ленина, 29',
  slogan: 'Большое кино. Рядом с вами.',
  tagline: 'ВАШ СЛЕДУЮЩИЙ КИНОВЕЧЕР',
  tags: ['БОЛЬШОЙ ЭКРАН', 'ЛАЗЕРНЫЙ ПРОЕКТОР', 'DOLBY ATMOS'],
};

export const INITIAL_HALLS: Hall[] = [
  {
    id: 'hall-1',
    name: 'Зал 1',
    type: 'standard',
    rows: 6,
    seatsPerRow: 10,
    priceModifier: 0,
    description: 'Зал 1 · лазерный проектор, кристальный звук Dolby Atmos',
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
    title: 'Битва моторов',
    age: '12+',
    duration: '2 ч 20 мин',
    durationMinutes: 140,
    genre: 'Приключения / Драма',
    rating: '8.4',
    description: 'В центре сюжета — гонка на мотоциклах. Два друга соревнуются за главный приз в захватывающем заезде, проверяющем их дружбу на прочность.',
    priceFrom: 420,
    dates: ['Сегодня', '27 окт.', '28 окт.', '29 окт.'],
    bannerGradient: 'from-[#0B353A] to-[#124B52]',
    posterBg: '#8A3B14',
    posterImage: bitvaPoster,
    hallId: 'hall-1',
    showtimes: [
      { time: '09:40', format: '2D', price: 350, hall: 'Зал 1' },
      { time: '12:40', format: '2D', price: 420, hall: 'Зал 1' },
      { time: '13:50', format: '2D', price: 350, hall: 'Зал 2 VIP' },
      { time: '15:40', format: 'IMAX', price: 580, hall: 'Зал 3 IMAX' },
    ],
  },
  {
    id: 'sumerki',
    title: 'Сумерки',
    age: '16+',
    duration: '2 ч 02 мин',
    durationMinutes: 122,
    genre: 'Фантастика / Мелодрама',
    rating: '7.8',
    description: 'Семнадцатилетняя девушка Белла переезжает к отцу в небольшой городок Форкс и влюбляется в загадочного одноклассника Эдварда, хранящего опасную тайну.',
    priceFrom: 420,
    dates: ['Сегодня', '27 окт.', '28 окт.', '29 окт.'],
    bannerGradient: 'from-[#0E2F35] to-[#1A454C]',
    posterBg: '#1e293b',
    posterImage: sumerkiPoster,
    hallId: 'hall-2',
    showtimes: [
      { time: '17:10', format: '2D', price: 420, hall: 'Зал 2 VIP' },
      { time: '20:00', format: '2D', price: 450, hall: 'Зал 2 VIP' },
    ],
  },
  {
    id: 'vlastelin-kolets',
    title: 'Властелин колец 1',
    age: '16+',
    duration: '2 ч 58 мин',
    durationMinutes: 178,
    genre: 'Фэнтези / Приключения',
    rating: '8.9',
    description: 'Скромный хоббит Фродо Бэггинс получает в наследство древнее Кольцо Всевластья и отправляется в опаснейшее путешествие к Роковой Горе, чтобы уничтожить его.',
    priceFrom: 450,
    dates: ['Сегодня', '27 окт.', '28 окт.', '29 окт.'],
    bannerGradient: 'from-[#0C302F] to-[#1C4E4B]',
    posterBg: '#183626',
    hallId: 'hall-3',
    showtimes: [
      { time: '14:00', format: 'IMAX', price: 450, hall: 'Зал 3 IMAX' },
      { time: '18:30', format: 'IMAX', price: 520, hall: 'Зал 3 IMAX' },
    ],
  },
  {
    id: 'kolobok',
    title: 'Колобок',
    age: '0+',
    duration: '1 ч 23 мин',
    durationMinutes: 83,
    genre: 'Анимация / Семейный',
    rating: '8.2',
    description: 'Красочное 3D-переосмысление любимой народной сказки с новыми приключениями, юмором и добрыми песнями для всей семьи.',
    priceFrom: 350,
    dates: ['Сегодня', '27 окт.', '28 окт.', '29 окт.'],
    bannerGradient: 'from-[#194038] to-[#255C52]',
    posterBg: '#d97706',
    posterImage: kolobokPoster,
    hallId: 'hall-1',
    showtimes: [
      { time: '10:30', format: '2D', price: 350, hall: 'Зал 1' },
      { time: '12:15', format: '3D', price: 400, hall: 'Зал 1' },
    ],
  },
  {
    id: 'dune-2',
    title: 'Дюна: Часть 2',
    age: '12+',
    duration: '2 ч 46 мин',
    durationMinutes: 166,
    genre: 'Фантастика / Боевик',
    rating: '8.8',
    description: 'Пол Атрейдес объединяется с Чани и фременами, чтобы отомстить заговорщикам, уничтожившим его семью, и предотвратить ужасное будущее галактики.',
    priceFrom: 500,
    dates: ['Сегодня', '27 окт.', '28 окт.', '29 окт.'],
    bannerGradient: 'from-[#1E3A34] to-[#2D5A51]',
    posterBg: '#9a3412',
    posterImage: dunePoster,
    hallId: 'hall-3',
    showtimes: [
      { time: '16:00', format: 'IMAX', price: 500, hall: 'Зал 3 IMAX' },
      { time: '19:40', format: 'IMAX', price: 650, hall: 'Зал 3 IMAX' },
    ],
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ticket-1',
    movieId: 'bitva-motorov',
    movieTitle: 'Битва моторов',
    date: '27 октября',
    time: '12:40',
    hall: 'Зал 1',
    seats: 'Ряд 3 · места 4, 5',
    price: 840,
    qrCode: 'KMAX-BM-2710-1240-345',
    bgGradient: 'from-[#0B353A] to-[#005C53]',
  },
  {
    id: 'ticket-2',
    movieId: 'sumerki',
    movieTitle: 'Сумерки',
    date: '28 октября',
    time: '17:10',
    hall: 'Зал 2 VIP',
    seats: 'Ряд 2 · место 3',
    price: 420,
    qrCode: 'KMAX-SM-2810-1710-23',
    bgGradient: 'from-[#0E2F35] to-[#046C62]',
  },
];

export const INITIAL_STATS: PurchaseStats = {
  totalSold: 312,
  totalWatched: 274,
  totalRefunded: 14,
  totalRevenue: 172600,
  refundedRevenue: 7800,
  movieStats: {
    'bitva-motorov': {
      movieTitle: 'Битва моторов',
      soldCount: 142,
      revenue: 78400,
      refundCount: 5,
    },
    'dune-2': {
      movieTitle: 'Дюна: Часть 2',
      soldCount: 88,
      revenue: 52000,
      refundCount: 4,
    },
    'sumerki': {
      movieTitle: 'Сумерки',
      soldCount: 46,
      revenue: 21400,
      refundCount: 3,
    },
    'vlastelin-kolets': {
      movieTitle: 'Властелин колец 1',
      soldCount: 24,
      revenue: 12800,
      refundCount: 1,
    },
    'kolobok': {
      movieTitle: 'Колобок',
      soldCount: 12,
      revenue: 8000,
      refundCount: 1,
    },
  },
  recentTransactions: [
    {
      id: 'tx-501',
      movieTitle: 'Битва моторов',
      type: 'purchase',
      amount: 840,
      seats: 'Ряд 3, место 4, 5',
      date: 'Сегодня',
      time: '12:15',
    },
    {
      id: 'tx-502',
      movieTitle: 'Дюна: Часть 2',
      type: 'purchase',
      amount: 500,
      seats: 'Ряд 4, место 8',
      date: 'Сегодня',
      time: '11:40',
    },
    {
      id: 'tx-503',
      movieTitle: 'Сумерки',
      type: 'refund',
      amount: 420,
      seats: 'Ряд 2, место 3',
      date: 'Вчера',
      time: '18:22',
    },
    {
      id: 'tx-504',
      movieTitle: 'Битва моторов',
      type: 'purchase',
      amount: 420,
      seats: 'Ряд 5, место 6',
      date: 'Вчера',
      time: '16:05',
    },
    {
      id: 'tx-505',
      movieTitle: 'Властелин колец 1',
      type: 'purchase',
      amount: 450,
      seats: 'Ряд 6, место 7',
      date: '21 окт.',
      time: '14:10',
    },
  ],
};

export const SEARCH_HISTORY_ITEMS = [
  'Битва моторов',
  'Фантастика',
  'Драма',
  'Сумерки',
];
