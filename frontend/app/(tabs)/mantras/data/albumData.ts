export interface Track {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSecs: number;
  // Replace these with your actual local asset paths: require('../../assets/audio/filename.mp3')
  audioUrl: string;
}

export interface Album {
  id: string;
  title: string;
  type: string;
  category: 'Deity' | 'Festival' | 'Popular';
  image: string;
  accentColor: string;
  description: string;
  tracks: Track[];
}

const ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Lord Shiva',
    type: 'Mantras',
    category: 'Deity',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80',
    accentColor: '#1E3A5F',
    description: 'Sacred chants for peace and power',
    tracks: [
      {
        id: 't1-1',
        title: 'Om Namah Shivaya',
        subtitle: 'Panchakshara Mantra',
        duration: '05:20',
        durationSecs: 320,
        audioUrl: 'https://archive.org/download/MantrasAndChants/om-namah-shivaya.mp3',
      },
      {
        id: 't1-2',
        title: 'Shiv Tandav Stotram',
        subtitle: 'Ravana Krutham',
        duration: '09:12',
        durationSecs: 552,
        audioUrl: 'https://archive.org/download/MantrasAndChants/shiv-tandav.mp3',
      },
      {
        id: 't1-3',
        title: 'Maha Mrityunjaya Mantra',
        subtitle: 'Healing Chant · 108 Repetitions',
        duration: '18:30',
        durationSecs: 1110,
        audioUrl: 'https://archive.org/download/MantrasAndChants/mahamrityunjaya.mp3',
      },
      {
        id: 't1-4',
        title: 'Lingashtakam',
        subtitle: 'Eight stanzas on Shivalinga',
        duration: '07:45',
        durationSecs: 465,
        audioUrl: 'https://archive.org/download/MantrasAndChants/lingashtakam.mp3',
      },
      {
        id: 't1-5',
        title: 'Shiva Chalisa',
        subtitle: 'Forty Verses',
        duration: '12:30',
        durationSecs: 750,
        audioUrl: 'https://archive.org/download/MantrasAndChants/shiva-chalisa.mp3',
      },
      {
        id: 't1-6',
        title: 'Rudrashtakam',
        subtitle: 'Eight Verses to Rudra',
        duration: '08:15',
        durationSecs: 495,
        audioUrl: 'https://archive.org/download/MantrasAndChants/rudrashtakam.mp3',
      },
    ],
  },
  {
    id: '2',
    title: 'Laxmi Mata',
    type: 'Aarti',
    category: 'Deity',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80',
    accentColor: '#7B3F00',
    description: 'Invocations for wealth and prosperity',
    tracks: [
      {
        id: 't2-1',
        title: 'Jai Laxmi Mata',
        subtitle: 'Morning Aarti',
        duration: '06:10',
        durationSecs: 370,
        audioUrl: 'https://archive.org/download/MantrasAndChants/laxmi-aarti.mp3',
      },
      {
        id: 't2-2',
        title: 'Shri Sukta',
        subtitle: 'Vedic Hymn · Rigveda',
        duration: '11:20',
        durationSecs: 680,
        audioUrl: 'https://archive.org/download/MantrasAndChants/shri-sukta.mp3',
      },
      {
        id: 't2-3',
        title: 'Laxmi Gayatri Mantra',
        subtitle: '108 Repetitions',
        duration: '14:00',
        durationSecs: 840,
        audioUrl: 'https://archive.org/download/MantrasAndChants/laxmi-gayatri.mp3',
      },
      {
        id: 't2-4',
        title: 'Kanakdhara Stotram',
        subtitle: 'By Adi Shankaracharya',
        duration: '09:30',
        durationSecs: 570,
        audioUrl: 'https://archive.org/download/MantrasAndChants/kanakdhara.mp3',
      },
      {
        id: 't2-5',
        title: 'Mahalaxmi Ashtakam',
        subtitle: 'Eight Verses',
        duration: '05:45',
        durationSecs: 345,
        audioUrl: 'https://archive.org/download/MantrasAndChants/mahalaxmi-ashtakam.mp3',
      },
    ],
  },
  {
    id: '3',
    title: 'Hanuman Ji',
    type: 'Chants',
    category: 'Deity',
    image: 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=400&q=80',
    accentColor: '#8B0000',
    description: 'Powerful chants for strength & devotion',
    tracks: [
      {
        id: 't3-1',
        title: 'Hanuman Chalisa',
        subtitle: 'By Tulsidas',
        duration: '13:45',
        durationSecs: 825,
        audioUrl: 'https://archive.org/download/MantrasAndChants/hanuman-chalisa.mp3',
      },
      {
        id: 't3-2',
        title: 'Bajrang Baan',
        subtitle: 'Protective Chant',
        duration: '10:20',
        durationSecs: 620,
        audioUrl: 'https://archive.org/download/MantrasAndChants/bajrang-baan.mp3',
      },
      {
        id: 't3-3',
        title: 'Sankat Mochan',
        subtitle: 'Remover of Difficulties',
        duration: '08:00',
        durationSecs: 480,
        audioUrl: 'https://archive.org/download/MantrasAndChants/sankat-mochan.mp3',
      },
      {
        id: 't3-4',
        title: 'Jai Hanuman',
        subtitle: 'Morning Aarti',
        duration: '05:30',
        durationSecs: 330,
        audioUrl: 'https://archive.org/download/MantrasAndChants/jai-hanuman.mp3',
      },
    ],
  },
  {
    id: '4',
    title: 'Navratri Special',
    type: 'Garba',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80',
    accentColor: '#6B21A8',
    description: 'Nine nights of divine feminine energy',
    tracks: [
      {
        id: 't4-1',
        title: 'Jai Mata Di',
        subtitle: 'Festival Chant',
        duration: '07:15',
        durationSecs: 435,
        audioUrl: 'https://archive.org/download/MantrasAndChants/jai-mata-di.mp3',
      },
      {
        id: 't4-2',
        title: 'Durga Chalisa',
        subtitle: 'Forty Verses',
        duration: '12:00',
        durationSecs: 720,
        audioUrl: 'https://archive.org/download/MantrasAndChants/durga-chalisa.mp3',
      },
      {
        id: 't4-3',
        title: 'Mahishasura Mardini',
        subtitle: 'Stotram',
        duration: '15:30',
        durationSecs: 930,
        audioUrl: 'https://archive.org/download/MantrasAndChants/mahishasura-mardini.mp3',
      },
      {
        id: 't4-4',
        title: 'Aigiri Nandini',
        subtitle: 'Classical Rendition',
        duration: '09:45',
        durationSecs: 585,
        audioUrl: 'https://archive.org/download/MantrasAndChants/aigiri-nandini.mp3',
      },
    ],
  },
  {
    id: '5',
    title: 'Diwali Aarti',
    type: 'Festival',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=400&q=80',
    accentColor: '#92400E',
    description: 'Festival of lights and blessings',
    tracks: [
      {
        id: 't5-1',
        title: 'Om Jai Jagdish Hare',
        subtitle: 'Universal Aarti',
        duration: '08:30',
        durationSecs: 510,
        audioUrl: 'https://archive.org/download/MantrasAndChants/om-jai-jagdish.mp3',
      },
      {
        id: 't5-2',
        title: 'Laxmi Puja Mantra',
        subtitle: 'Diwali Special',
        duration: '10:00',
        durationSecs: 600,
        audioUrl: 'https://archive.org/download/MantrasAndChants/laxmi-puja.mp3',
      },
      {
        id: 't5-3',
        title: 'Ganesh Vandana',
        subtitle: 'Opening Invocation',
        duration: '06:20',
        durationSecs: 380,
        audioUrl: 'https://archive.org/download/MantrasAndChants/ganesh-vandana.mp3',
      },
    ],
  },
  {
    id: '6',
    title: 'Ganesh Utsav',
    type: 'Bhakti',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1567591370429-c3b1ba5bab69?w=400&q=80',
    accentColor: '#065F46',
    description: 'Celebrations of the elephant god',
    tracks: [
      {
        id: 't6-1',
        title: 'Ganesh Chaturthi Aarti',
        subtitle: 'Festival Special',
        duration: '07:00',
        durationSecs: 420,
        audioUrl: 'https://archive.org/download/MantrasAndChants/ganesh-chaturthi.mp3',
      },
      {
        id: 't6-2',
        title: 'Vakratunda Mahakaya',
        subtitle: 'Classical Mantra',
        duration: '05:10',
        durationSecs: 310,
        audioUrl: 'https://archive.org/download/MantrasAndChants/vakratunda.mp3',
      },
      {
        id: 't6-3',
        title: 'Ganesh Chalisa',
        subtitle: 'Forty Verses',
        duration: '11:45',
        durationSecs: 705,
        audioUrl: 'https://archive.org/download/MantrasAndChants/ganesh-chalisa.mp3',
      },
      {
        id: 't6-4',
        title: 'Sukhkarta Dukhaharta',
        subtitle: 'Traditional Aarti',
        duration: '06:55',
        durationSecs: 415,
        audioUrl: 'https://archive.org/download/MantrasAndChants/sukhkarta.mp3',
      },
    ],
  },
];
export default ALBUMS;

export const getAlbumById = (id: string) => ALBUMS.find((a) => a.id === id);