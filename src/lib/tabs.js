import { Coffee, Home, Ticket, Calendar } from 'lucide-react';

export const TABS = [
  { key: 'layanan', label: 'Tiket & Fasilitas', Icon: Ticket },
  { key: 'events', label: 'Event', Icon: Calendar },
  { key: 'umkm', label: 'UMKM Lokal', Icon: Coffee },
  { key: 'homestay', label: 'Homestay', Icon: Home },
];

export const TAB_LABELS = Object.fromEntries(TABS.map(({ key, label }) => [key, label]));

export const FILTER_OPTIONS = {
  layanan: ['Semua', 'Tiket', 'Sewa', 'Fasilitas'],
  events: ['Semua', 'Akan Datang', 'Rutin', 'Selesai'],
  umkm: ['Semua', 'Kuliner', 'Kerajinan', 'Lainnya'],
  homestay: ['Semua', 'Kamar', 'Villa'],
};

export const TAB_DESCRIPTIONS = {
  layanan: {
    title: 'Tiket & Fasilitas Teras Merapi',
    subtitle: 'Akses Mudah dan Fasilitas Nyaman untuk Pengalaman Wisata Terbaik',
    p1: 'Teras Merapi menghadirkan berbagai layanan wisata serta fasilitas pendukung yang dirancang untuk kenyamanan seluruh pengunjung. Mulai dari tiket masuk kawasan, sewa jeep untuk lava tour yang menantang, hingga area camping dengan pemandangan terbuka menghadap langsung ke puncak Gunung Merapi.',
    p2: 'Dengan pengelolaan profesional oleh warga desa, setiap fasilitas dipastikan ramah keluarga, aman, serta terawat demi memberikan pengalaman berlibur yang berkesan di sejuknya lereng Merapi.',
  },
  events: {
    title: 'Event & Kegiatan Teras Merapi',
    subtitle: 'Rayakan Kehangatan Budaya dan Tradisi Bersama Masyarakat Desa',
    p1: 'Sebagai pusat kebudayaan dan aktivitas warga, Teras Merapi secara rutin menjadi ruang penyelenggaraan berbagai acara menarik, mulai dari festival budaya tahunan, pertunjukan seni tradisional, hingga tradisi panen raya kopi bersama petani lokal.',
    p2: 'Setiap event dirancang untuk memperkenalkan kearifan lokal sekaligus memberi kesempatan bagi wisatawan untuk berinteraksi langsung dan merasakan keramahan serta semangat gotong royong warga Desa Glagaharjo.',
  },
  umkm: {
    title: 'UMKM Teras Merapi',
    subtitle: 'Dukung Produk Lokal, Rasakan Cita Rasa dan Karya Warga Lereng Merapi',
    p1: 'Teras Merapi tidak hanya menawarkan keindahan alam, tetapi juga menjadi ruang bagi masyarakat sekitar untuk mengembangkan usaha mikro, kecil, dan menengah (UMKM). Berbagai produk yang dijual merupakan hasil karya dan olahan warga lokal sebagai bentuk pemberdayaan ekonomi masyarakat di kawasan lereng Gunung Merapi.',
    p2: 'Dengan membeli produk UMKM, pengunjung turut berkontribusi dalam mendukung pertumbuhan ekonomi masyarakat sekaligus melestarikan potensi lokal yang dimiliki Desa Glagaharjo.',
  },
  homestay: {
    title: 'Homestay Teras Merapi',
    subtitle: 'Istirahat Nyaman dalam Dekapan Suasana Asri Desa Lereng Merapi',
    p1: 'Nikmati pengalaman menginap yang tenang dan otentik dengan memilih ragam penginapan yang dikelola oleh warga lokal di sekitar kawasan Teras Merapi. Tersedia pilihan kamar homestay yang hangat hingga villa privat dengan fasilitas lengkap untuk keluarga dan rombongan.',
    p2: 'Bermalam di kawasan Teras Merapi memberi Anda kesempatan menyapa pagi dengan udara pegunungan yang sejuk, pemandangan matahari terbit, serta keramahan khas masyarakat desa yang bersahaja.',
  },
};