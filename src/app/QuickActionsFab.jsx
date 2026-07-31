'use client';

import { useState } from 'react';
import { MessageCircle, MapPin, Mail, X, Phone } from 'lucide-react';

const WA_NUMBER = '6285290125106';
const WA_MESSAGE = 'Halo, saya ingin tanya-tanya soal Teras Merapi.';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=-7.587501799999998,110.45598269999996';

const ACTIONS = [
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    color: '#25D366',
    modalTitle: 'Ingin informasi lebih lanjut lewat WhatsApp?',
    modalDesc: 'Kamu bakal diarahkan ke WhatsApp buat ngobrol langsung sama admin Teras Merapi.',
    confirmLabel: 'Ya, Lanjutkan',
    run: () => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`, '_blank', 'noopener,noreferrer'),
  },
  {
    id: 'maps',
    icon: MapPin,
    label: 'Lihat Peta',
    color: '#C97B3A',
    modalTitle: 'Buka lokasi Teras Merapi di Google Maps?',
    modalDesc: 'Kamu bakal diarahkan keluar situs, ke aplikasi atau website Google Maps.',
    confirmLabel: 'Ya, Buka Peta',
    run: () => window.open(MAPS_URL, '_blank', 'noopener,noreferrer'),
  },
  {
    id: 'kontak',
    icon: Mail,
    label: 'Kontak',
    color: '#A89070',
    run: () => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }),
  },
];

export default function QuickActionsFab() {
  const [open, setOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleActionClick = (action) => {
    setOpen(false);
    if (action.modalTitle) {
      setConfirmAction(action);
    } else {
      action.run();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-200 flex flex-col items-end gap-3">
        {open && ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="group flex items-center gap-3 animate-fab-in cursor-pointer"
            >
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#F0E6D3] bg-[#17120D]/95 border border-[#5B4838]/50 px-2.5 py-1.5 rounded-full whitespace-nowrap">
                {action.label}
              </span>
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: action.color }}
              >
                <Icon size={19} className="text-[#120E0A]" strokeWidth={2.2} />
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tutup menu kontak' : 'Buka menu kontak'}
          aria-expanded={open}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C97B3A] text-[#120E0A] shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {open ? <X size={24} /> : <Phone size={22} strokeWidth={2.2} />}
        </button>
      </div>

      {confirmAction && (
        <div
          className="fixed inset-0 z-201 flex items-center justify-center bg-[#120E0A]/80 backdrop-blur-sm px-6"
          onClick={() => setConfirmAction(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-[#17120D] border border-[#5B4838]/50 rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
          >
            <button
              onClick={() => setConfirmAction(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 text-[#A89070] hover:text-[#F0E6D3] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${confirmAction.color}26` }}
            >
              <confirmAction.icon size={22} style={{ color: confirmAction.color }} />
            </div>

            <h3 className="font-serif text-xl text-[#F0E6D3] mb-2 leading-snug">
              {confirmAction.modalTitle}
            </h3>
            <p className="font-serif text-sm text-[#A89070] leading-relaxed mb-6">
              {confirmAction.modalDesc}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase border border-[#5B4838]/50 text-[#A89070] hover:text-[#F0E6D3] hover:border-[#C97B3A]/50 transition-all duration-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => { confirmAction.run(); setConfirmAction(null); }}
                className="flex-1 py-2.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: confirmAction.color, color: '#120E0A' }}
              >
                {confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}