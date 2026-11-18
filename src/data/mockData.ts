export interface Movie {
  id: string;
  title: string;
  age: string;
  duration: string;
  genre: string;
  rating?: string;
  description: string;
  priceFrom: number;
  dates: string[];
  bannerGradient: string;
  posterBg: string;
  posterImage?: string;
  tagColor?: string;
  showtimes: {
    time: string;
    format: string;
    price: number;
    hall: string;
  }[];
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

export const CINEMA_INFO = {
  brand: 'КИНОМАКС',
  title: 'КИНОМАКС-БУРЕВЕСТНИК ВЛАДИМИР',
  address: 'пр. Ленина, д. 29',
  tags: ['БОЛЬШОЙ ЭКРАН', 'ЛАЗЕРНЫЙ RGB ПРОЕКТОР'],
};

export const MOVIES: Movie[] = [
  {
    id: 'bitva-motorov',
    title: 'БИТВА МОТОРОВ',
    age: '16+',
    duration: '2 часа 32 минуты',
    genre: 'Приключения / Драма',
    rating: '8.4',
    description: 'В центре сюжета — гонки на мотоциклах. Два друга соревнуются за главный приз в захватывающем заезде, проверяющем их дружбу на прочность.',
    priceFrom: 350,
    dates: ['22 окт', '23 окт', '24 окт', '25 окт'],
    bannerGradient: 'from-amber-700 via-orange-950 to-neutral-950',
    posterBg: '#8A3B14',
    posterImage: './assets/bitva_motorov_poster.jpg',
    showtimes: [
      { time: '09:40', format: '2D', price: 350, hall: 'Зал 1' },
      { time: '12:40', format: 'IMAX', price: 700, hall: 'Зал 1' },
      { time: '13:50', format: '2D', price: 350, hall: 'Зал 2' },
      { time: '15:40', format: 'IMAX', price: 700, hall: 'Зал 1' },
    ],
  },
  {
    id: 'sumerki',
    title: 'Сумерки',
    age: '16+',
    duration: '2 часа 02 минуты',
    genre: 'Фэнтези / Мелодрама',
    rating: '7.8',
    description: 'Семнадцатилетняя девушка Белла переезжает к отцу в небольшой городок Форкс и влюбляется в загадочного одноклассника Эдварда, хранящего опасную тайну.',
    priceFrom: 350,
    dates: ['16 дек', '17 дек', '18 дек'],
    bannerGradient: 'from-sky-900 via-slate-900 to-neutral-950',
    posterBg: '#1e293b',
    posterImage: './assets/sumerki_poster.jpg',
    showtimes: [
      { time: '19:00', format: '2D', price: 350, hall: 'Зал 2' },
      { time: '21:30', format: '2D', price: 400, hall: 'Зал 2' },
    ],
  },
  {
    id: 'kolobok',
    title: 'Колобок',
    age: '0+',
    duration: '1 час 25 минут',
    genre: 'Мультфильм / Семейный',
    rating: '9.1',
    description: 'Красочное 3D-переосмысление любимой народной сказки с новыми приключениями, юмором и добрыми песнями для всей семьи.',
    priceFrom: 1500,
    dates: ['20 дек', '21 дек', '22 дек'],
    bannerGradient: 'from-amber-500 via-yellow-800 to-neutral-950',
    posterBg: '#d97706',
    posterImage: './assets/kolobok_poster.jpg',
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
    genre: 'Фантастика / Боевик',
    rating: '8.9',
    description: 'Пол Атрейдес объединяется с Чани и фременами, чтобы отомстить заговорщикам, уничтожившим его семью, и предотвратить ужасное будущее галактики.',
    priceFrom: 450,
    dates: ['21 дек', '22 дек', '23 дек'],
    bannerGradient: 'from-orange-800 via-red-950 to-neutral-950',
    posterBg: '#9a3412',
    posterImage: './assets/dune2_poster.jpg',
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
    price: 700,
    qrCode: 'KM-2024-D2-700-512',
    bgGradient: 'from-[#be548d] to-[#8d3664]',
  },
];

export const SEARCH_HISTORY_ITEMS = [
  'фильмы декабря',
  'театральные спектакли',
  'кино-премьеры',
];
