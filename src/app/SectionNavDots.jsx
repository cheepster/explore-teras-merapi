'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'hero', short: 'Beranda' },
  { id: 'cerita', short: 'Kilasan' },
  { id: 'sambutan', short: 'Sambutan' },
  { id: 'explore', short: 'Katalog' },
  { id: 'footer', short: 'Kontak' },
];

const IDLE_DELAY = 1000;

export default function SectionNavDots() {
  const [activeId, setActiveId] = useState('hero');
  const [visible, setVisible] = useState(false);
  const [scrolling, setScrolling] = useState(true);
  const [hovering, setHovering] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    elements.forEach((el) => sectionObserver.observe(el));

    const heroEl = document.getElementById('hero');
    let heroObserver;
    if (heroEl) {
      heroObserver = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { threshold: 0.15 }
      );
      heroObserver.observe(heroEl);
    }

    const handleScroll = () => {
      setScrolling(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setScrolling(false), IDLE_DELAY);

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (nearBottom) setActiveId(SECTIONS[SECTIONS.length - 1].id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    idleTimerRef.current = setTimeout(() => setScrolling(false), IDLE_DELAY);
    handleScroll();

    return () => {
      sectionObserver.disconnect();
      if (heroObserver) heroObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const showLabels = scrolling || hovering;

  return (
    <nav
      aria-label="Navigasi bagian halaman"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`fixed right-3 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-150 flex flex-col items-end gap-3 sm:gap-4 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {SECTIONS.map(({ id, short }) => {
        const isActive = activeId === id;
        return (
          <a key={id} href={`#${id}`} className="flex items-center gap-2">
            <span
              className={`overflow-hidden whitespace-nowrap font-mono text-[8px] sm:text-[9px] tracking-[0.12em] uppercase transition-all duration-300 ${
                showLabels ? 'max-w-25 opacity-100' : 'max-w-0 opacity-0'
              } ${isActive ? 'text-[#F0E6D3] font-medium' : 'text-[#A89070]/40'}`}
            >
              {short}
            </span>
            <span
              className={`block rounded-full border shrink-0 transition-all duration-300 ${
                isActive
                  ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#C97B3A] border-[#C97B3A] shadow-[0_0_10px_rgba(201,123,58,0.7)]'
                  : 'w-1 h-1 sm:w-1.5 sm:h-1.5 bg-transparent border-[#A89070]/50'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}