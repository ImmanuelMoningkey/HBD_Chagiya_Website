import { asset } from '../utils/helpers.js';

export const MEDIA_CONFIG = {
  // Opening photo animation (2-3 photos)
  introPhotos: [
    {
      id: 'intro-1',
      src: asset('photos/photo-01.jpg'),
      caption: 'When smiles happen effortlessly...',
      rotation: -4,
    },
    {
      id: 'intro-2',
      src: asset('photos/photo-02.jpg'),
      caption: 'Every sweet little moment with you.',
      rotation: 3,
    },
    {
      id: 'intro-3',
      src: asset('photos/photo-04.jpg'),
      caption: 'Pure warmth and laughter.',
      rotation: -2,
    },
  ],

  // 3 Mystery Investigation objects
  mysteryObjects: [
    {
      id: 'matcha',
      title: 'Matcha McFlurry',
      shortLabel: 'Matcha',
      icon: asset('objects/matcha-mcflurry.png'),
      color: '#95C59C',
      tagline: 'A little treat of pure delight',
      note: 'One little thing that always makes my day a little brighter. ♡',
      description: 'Sama kamu, hal sesimpel es krim matcha pun terasa sepuluh kali lebih manis.',
      // Media to show in this investigation page
      media: [
        {
          type: 'video',
          src: asset('videos/video-01.mp4'),
          poster: asset('videos/posters/video-01.jpg'),
          caption: 'Our McFlurry and sweet dessert date ♡',
        },
        {
          type: 'image',
          src: asset('photos/photo-03.jpg'),
          caption: 'Candid and happy moments together',
        },
        {
          type: 'image',
          src: asset('photos/photo-08.jpg'),
          caption: 'Always finding reasons to enjoy the moment',
        },
      ],
    },
    {
      id: 'shades',
      title: 'Stylish Sunglasses',
      shortLabel: 'Shades',
      icon: asset('objects/black-sunglasses.png'),
      color: '#55424D',
      tagline: 'Cool memories & sunny adventures',
      note: 'Some memories are too precious to be forgotten.',
      description: 'Mau secerah apa pun harinya, kehadiranmu yang selalu bikin suasana jadi hangat dan tenang.',
      media: [
        {
          type: 'image',
          src: asset('photos/photo-05.jpg'),
          caption: 'Breeze, ocean, and your warmth ♡',
        },
        {
          type: 'image',
          src: asset('photos/photo-06.jpg'),
          caption: 'Dressing up, mirror selfies, and giggles',
        },
        {
          type: 'image',
          src: asset('photos/photo-10.jpg'),
          caption: 'Matching vibes everywhere we go',
        },
      ],
    },
    {
      id: 'time',
      title: 'Pink Wristwatch',
      shortLabel: 'Time',
      icon: asset('objects/pink-wristwatch.png'),
      color: '#E995B0',
      tagline: 'Every second spent by your side',
      note: 'Here\'s another little piece of happiness that I want to keep forever.',
      description: 'Waktu selalu berjalan begitu cepat kalau lagi bareng kamu, tapi setiap detiknya selalu berharga.',
      media: [
        {
          type: 'video',
          src: asset('videos/video-02.mp4'),
          poster: asset('videos/posters/video-02.jpg'),
          caption: 'Cute funny filters and goofy laughter ♡',
        },
        {
          type: 'image',
          src: asset('photos/photo-07.jpg'),
          caption: 'Late night chats and comfy silences',
        },
        {
          type: 'image',
          src: asset('photos/photo-11.jpg'),
          caption: 'Mirror memories captured in time',
        },
        {
          type: 'image',
          src: asset('photos/photo-12.jpg'),
          caption: 'Little moments, endless memories',
        },
      ],
    },
  ],

  // Final Birthday Surprise
  // In natural sorting, photo-13.jpg is the last photo in the collection
  finalGift: {
    photo: asset('photos/photo-13.jpg'),
    title: 'Happy Birthday Chagiya! 🎀',
    bodyParagraphs: [
      'Another year of you being you, and that\'s already something worth celebrating.',
      'I hope your days are filled with happiness, your dreams slowly come true, and you always find little reasons to smile.',
      'Thank you for being someone so special. You deserve all the beautiful things in this world.',
      'Happy Birthday, Chagiya! ♡',
    ],
  },
};

