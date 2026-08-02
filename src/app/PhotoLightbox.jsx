'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoLightbox({ images = [], alt = '', index = 0, onClose, onIndexChange }) {
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const hasMultiple = images.length > 1;

  const goTo = useCallback((i) => {
    onIndexChange(((i % images.length) + images.length) % images.length);
  }, [images.length, onIndexChange]);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Keyboard nav + body scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, next, prev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current > 0) prev();
      else next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (typeof document === 'undefined' || images.length === 0) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri foto ${alt}`}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      className="fixed inset-0 z-100 bg-[#0D0A08]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-tab-fade"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Tutup galeri"
        className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#17120D]/80 border border-[#5B4838]/40 text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#C97B3A]/60 backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <X size={18} />
      </button>

      {hasMultiple && (
        <span className="absolute top-6 left-6 z-20 font-mono text-[10px] tracking-[0.2em] uppercase text-[#F0E6D3]/70">
          {index + 1} / {images.length}
        </span>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[index]}
          alt={`${alt} — foto ${index + 1}`}
          draggable={false}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg select-none shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Foto sebelumnya"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#0D0A08]/60 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Foto berikutnya"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#0D0A08]/60 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Ke foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? 'w-6 bg-[#C97B3A]' : 'w-1.5 bg-[#F0E6D3]/30 hover:bg-[#F0E6D3]/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}