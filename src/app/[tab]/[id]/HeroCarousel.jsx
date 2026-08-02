'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import PhotoLightbox from '@/app/PhotoLightbox';

export default function HeroCarousel({ images = [], alt = '' }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  const hasMultiple = images.length > 1;

  const goTo = useCallback((i) => {
    setIndex(((i % images.length) + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (!hasMultiple || lightboxOpen) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [hasMultiple, images.length, lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-serif text-[#3D2E1E] text-2xl italic">Foto segera hadir</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onClick={() => setLightboxOpen(true)}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`${alt} — foto ${i + 1}`}
          fill
          sizes="100vw"
          priority={i === 0}
          unoptimized
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          onError={(e) => { e.currentTarget.style.opacity = 0; }}
        />
      ))}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Foto sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0D0A08]/50 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Foto berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0D0A08]/50 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-24 md:bottom-28 inset-x-0 z-20 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`Ke foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-[#C97B3A]' : 'w-1.5 bg-[#F0E6D3]/30 hover:bg-[#F0E6D3]/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
        aria-label="Lihat foto penuh layar"
        className="absolute bottom-6 right-6 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0D0A08]/50 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/80 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300"
      >
        <Maximize2 size={15} />
      </button>

      {lightboxOpen && (
        <PhotoLightbox
          images={images}
          alt={alt}
          index={index}
          onIndexChange={goTo}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}