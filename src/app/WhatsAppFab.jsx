'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WA_NUMBER = '6285290125106';
const WA_MESSAGE = 'Halo, saya ingin tanya-tanya soal Teras Merapi.';

export default function WhatsAppFab() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Hubungi via WhatsApp"
        className="fixed bottom-24 right-6 z-200 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-[#0B1F14] shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer"
      >
        <MessageCircle size={26} strokeWidth={2.2} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-201 flex items-center justify-center bg-[#120E0A]/80 backdrop-blur-sm px-6"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-[#17120D] border border-[#5B4838]/50 rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 text-[#A89070] hover:text-[#F0E6D3] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center mb-4">
              <MessageCircle size={22} className="text-[#25D366]" />
            </div>

            <h3 className="font-serif text-xl text-[#F0E6D3] mb-2 leading-snug">
              Ingin informasi lebih lanjut lewat WhatsApp?
            </h3>
            <p className="font-serif text-sm text-[#A89070] leading-relaxed mb-6">
              Kamu bakal diarahkan ke WhatsApp buat ngobrol langsung sama admin Teras Merapi.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase border border-[#5B4838]/50 text-[#A89070] hover:text-[#F0E6D3] hover:border-[#C97B3A]/50 transition-all duration-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase bg-[#25D366] text-[#0B1F14] font-medium hover:brightness-110 transition-all duration-300 cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}