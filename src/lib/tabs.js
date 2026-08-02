import { Coffee, Home, Ticket, Calendar } from 'lucide-react';

export const TABS = [
  { key: 'layanan', label: 'Layanan', Icon: Ticket },
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
    title: 'Layanan Teras Merapi',
    subtitle: 'Akses Mudah dan Fasilitas Nyaman untuk Pengalaman Wisata Terbaik',
    p1: 'Teras Merapi menghadirkan berbagai layanan wisata serta fasilitas pendukung yang dirancang untuk kenyamanan seluruh pengunjung.',
    p2: 'Dengan pengelolaan terbaik, setiap fasilitas dipastikan ramah keluarga, aman, serta terawat demi memberikan pengalaman berlibur yang berkesan di sejuknya lereng Merapi.',
  },
  events: {
    title: 'Sewa Tempat & Event Teras Merapi',
    subtitle: 'Ruang Terbuka untuk Berbagai Acara dengan Panorama Merapi',
    p1: 'Teras Merapi menyediakan ruang terbuka yang dapat disewa untuk berbagai acara, mulai dari gathering, acara keluarga, hingga kegiatan komunitas, dengan latar langsung ke Gunung Merapi.',
    p2: 'Selain terbuka untuk disewa, Teras Merapi juga mulai mengadakan event sendiri, dimulai dari perhelatan perdana pada Agustus ini.',
  },
  umkm: {
    title: 'UMKM Teras Merapi',
    subtitle: 'Dukung Produk Lokal, Rasakan Cita Rasa dan Karya Warga Lereng Merapi',
    p1: 'Teras Merapi tidak hanya menawarkan keindahan alam, tetapi juga menjadi ruang bagi masyarakat sekitar untuk mengembangkan usaha mikro, kecil, dan menengah (UMKM).',
    p2: 'Dengan membeli produk UMKM, pengunjung turut berkontribusi dalam mendukung pertumbuhan ekonomi masyarakat sekaligus melestarikan potensi lokal yang dimiliki Desa Kalitengah Kidul.',
  },
  homestay: {
    title: 'Homestay Sekitar Teras Merapi',
    subtitle: 'Mau Lihat Sunrise Tanpa Camping? Coba Menginap di Homestay Sekitar',
    p1: 'Selain camping, pengunjung juga bisa menginap di rumah-rumah warga sekitar kawasan Teras Merapi. Cocok buat yang tetap mau menyapa sunrise Merapi tanpa harus mendirikan tenda.',
    p2: 'Homestay dikelola langsung oleh warga sekitar, jadi menginap di sini juga berarti ikut mendukung masyarakat lereng Merapi.',
  },
};