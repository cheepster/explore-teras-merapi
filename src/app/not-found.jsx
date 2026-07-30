import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Halaman Tidak Ditemukan',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="grain min-h-screen bg-[#0D0A08] flex items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(13,10,8,0.85) 100%)' }}
      />

      <div className="relative z-10 max-w-lg text-center animate-tab-fade">
        <div className="flex items-center justify-center gap-3 mb-8 w-fit mx-auto">
          <span className="text-[#C97B3A] text-xs opacity-75">✧</span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C97B3A] font-medium">
            Teras Merapi
          </span>
          <span className="text-[#C97B3A] text-xs opacity-75">✧</span>
        </div>

        <div className="w-14 h-14 rounded-full border border-[#5B4838]/50 flex items-center justify-center mx-auto mb-8 bg-[#17120D]/70">
          <Compass size={24} className="text-[#C97B3A]" />
        </div>

        <h1 className="font-serif text-5xl md:text-6xl text-[#F0E6D3] italic leading-tight mb-4">
          Jejaknya Hilang di Kabut
        </h1>

        <p className="font-serif text-lg text-[#A89070] leading-relaxed mb-10">
          Halaman yang kamu cari sudah gak ada, pindah, atau memang belum pernah ada.
          Yuk balik lagi ke jalur utama Teras Merapi.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#C97B3A] text-[#120E0A] rounded-full font-mono text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-[#E0A15C] hover:shadow-[0_0_30px_rgba(201,123,58,0.35)]"
        >
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}