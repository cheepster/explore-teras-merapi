'use client';

import { useState, useEffect, useLayoutEffect, useRef, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionNavDots from './SectionNavDots';
import {
  Camera, ArrowRight,
  Quote, ChevronDown, MapPin, Mountain,
  Phone, Mail, Search, Volume2, VolumeX,
  Clock, Compass, Flame, Sparkles
} from 'lucide-react';
import { FiInstagram } from 'react-icons/fi';
import { getDriveUrl, toSlug, placeholderImage } from '@/lib/sheets';
import { TABS, FILTER_OPTIONS, TAB_DESCRIPTIONS } from '@/lib/tabs';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


// Utils

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) {
    h = (h << 5) - h + String(str).charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}



// Internal components (Restrained, Atmospheric)

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let t;
    if (!deleting && displayed.length < text.length) {
      t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === text.length) {
      t = setTimeout(() => setDeleting(true), 5000);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      t = setTimeout(() => setDeleting(false), 600);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, text]);
  return (
    <p className="font-mono text-xs text-[#C97B3A]/90 italic text-center leading-relaxed cursor-blink">
      {displayed}
    </p>
  );
}

function Counter({ target, suffix = '' }) {
  const [ref, inView] = useInView(0.5);
  const [count, setCount] = useState(0);
  const numTarget = parseFloat(target);
  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const inc = numTarget / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += inc;
      if (current >= numTarget) { setCount(numTarget); clearInterval(interval); }
      else setCount(current);
    }, 1800 / steps);
    return () => clearInterval(interval);
  }, [inView, numTarget]);
  const display = Number.isInteger(numTarget) ? Math.round(count) : count.toFixed(1);
  return (
    <span ref={ref} className="font-serif text-4xl md:text-5xl font-semibold text-[#F0E6D3]">
      {display}{suffix}
    </span>
  );
}

function ImagesBadge({ text, images }) {
  const hoverStyles = [
    'group-hover:-translate-x-3 group-hover:-translate-y-1.5 group-hover:-rotate-12 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(201,123,58,0.4)] group-hover:z-40',
    'group-hover:-translate-y-2.5 group-hover:scale-115 group-hover:shadow-[0_4px_12px_rgba(201,123,58,0.5)] group-hover:z-50',
    'group-hover:translate-x-3 group-hover:-translate-y-1.5 group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(201,123,58,0.4)] group-hover:z-40'
  ];
  return (
    <div className="pointer-events-auto group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#17120D]/85 border border-[#5B4838]/40 backdrop-blur-md mb-8 hover:bg-[#17120D] hover:border-[#C97B3A]/80 hover:shadow-[0_0_25px_rgba(201,123,58,0.25)] transition-all duration-500 cursor-pointer shadow-xl">
      <div className="flex -space-x-2.5 group-hover:space-x-1 ml-0.5 transition-all duration-500 ease-out py-1">
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`badge-${idx}`}
            className={`w-6 h-6 rounded-full border border-[#120E0A] object-cover relative transition-all duration-500 ease-out ${hoverStyles[idx] || ''}`}
            style={{ zIndex: [30, 20, 10][idx] }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 pr-2">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F0E6D3]/95 font-medium">{text}</span>
        <ArrowRight size={11} className="text-[#C97B3A]/80 group-hover:translate-x-1.5 transition-transform duration-300" />
      </div>
    </div>
  );
}

function ArtsyEyebrow({ text }) {
  return (
    <div className="flex items-center gap-3 mb-6 w-fit">
      <span className="text-[#C97B3A] text-xs opacity-75">✧</span>
      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C97B3A] relative font-medium">
        {text}
      </span>
      <span className="text-[#C97B3A] text-xs opacity-75">✧</span>
    </div>
  );
}

function ResponsiveMasonry({ items, activeTab }) {
  const getColumns = (numCols) => {
    const cols = Array.from({ length: numCols }, () => []);
    items.forEach((item, i) => {
      cols[i % numCols].push({ item, originalIndex: i });
    });
    return cols;
  };

  const cols4 = getColumns(4);
  const cols3 = getColumns(3);
  const cols2 = getColumns(2);

  return (
    <div className="pb-24 w-full" style={{ minHeight: '50vh' }}>
      {/* Mobile: 1 Column */}
      <div className="flex sm:hidden flex-col gap-6 w-full">
        {items.map((item, i) => (
          <ItemCard key={`${activeTab}-${item.id || i}`} item={item} index={i} />
        ))}
      </div>

      {/* Tablet (sm to lg): 2 Columns */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 items-start w-full">
        {cols2.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-6 w-full">
            {col.map(({ item, originalIndex }) => (
              <ItemCard key={`${activeTab}-${item.id || originalIndex}`} item={item} index={originalIndex} />
            ))}
          </div>
        ))}
      </div>

      {/* Laptop (lg to xl): 3 Columns */}
      <div className="hidden lg:grid xl:hidden grid-cols-3 gap-6 items-start w-full">
        {cols3.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-6 w-full">
            {col.map(({ item, originalIndex }) => (
              <ItemCard key={`${activeTab}-${item.id || originalIndex}`} item={item} index={originalIndex} />
            ))}
          </div>
        ))}
      </div>

      {/* Desktop (xl and up): 4 Columns */}
      <div className="hidden xl:grid grid-cols-4 gap-6 items-start w-full">
        {cols4.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-6 w-full">
            {col.map(({ item, originalIndex }) => (
              <ItemCard key={`${activeTab}-${item.id || originalIndex}`} item={item} index={originalIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item, index }) {
  const cardRef = useRef(null);
  const PLACEHOLDER = placeholderImage('Foto Segera Hadir');
  const imgSrc = getDriveUrl(item.gambar) || item.gambar || PLACEHOLDER;
  const isPlaceholder = imgSrc.includes('placehold.co');
  const slug = item.id || toSlug(item.nama);

  const seed = hashSeed(slug || String(index));
  const randomDelay = 0.03 + (seed % 50) / 1000;

  useGSAP(() => {
    const isEven = index % 2 === 0;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, x: isEven ? -25 : 25, scale: 0.92, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        delay: (index % 4) * randomDelay,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: cardRef });

  const pinterestAspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[5/4]', 'aspect-[4/3]'];
  const aspectClass = pinterestAspects[seed % pinterestAspects.length];

  const descClampByAspect = {
    'aspect-[3/4]': 'line-clamp-5',
    'aspect-[4/5]': 'line-clamp-4',
    'aspect-square': 'line-clamp-3',
    'aspect-[5/4]': 'line-clamp-2',
    'aspect-[4/3]': 'line-clamp-2',
  };
  const descClampClass = descClampByAspect[aspectClass] || 'line-clamp-3';

  return (
    <div ref={cardRef} className="w-full">
      <Link href={`/${item.tab}/${slug}`} className="block w-full">
        <div className="group rounded-xl bg-[#17120D] border border-[#5B4838]/25 overflow-hidden relative cursor-pointer transition-all duration-700 hover:border-[#C97B3A]/50 hover:shadow-[0_16px_48px_rgba(201,123,58,0.12)] w-full">
          <div className={`w-full relative overflow-hidden bg-[#1C1611] ${aspectClass} flex items-center justify-center`}>
            <Image
              src={imgSrc}
              alt={item.nama}
              fill
              unoptimized
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              className="object-cover transition-transform duration-1400ms ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#120E0A]/95 via-[#120E0A]/15 to-transparent transition-opacity duration-700" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(18,14,10,0.4) 100%)' }} />

            <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-in-out group-hover:translate-y-full">
              {item.kategori && (
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#C97B3A] border border-[#C97B3A]/40 px-2.5 py-0.5 rounded-sm mb-2.5 inline-block bg-[#120E0A]/70 backdrop-blur-xs">
                  {item.kategori}
                </span>
              )}
              <h3 className="font-serif text-xl md:text-2xl text-[#F0E6D3] leading-snug">{item.nama}</h3>
            </div>

            <div className="absolute inset-0 p-5 flex flex-col justify-end bg-[#120E0A]/92 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-10 border-t border-[#C97B3A]/30">
              {item.harga && (
                <span className="shrink-0 font-mono text-[9px] tracking-[0.18em] uppercase text-[#C97B3A] mb-3 inline-block font-medium">
                  {item.harga}
                </span>
              )}
              <h3 className="shrink-0 font-serif text-xl md:text-2xl text-[#F0E6D3] mb-2 line-clamp-2">{item.nama}</h3>
              <p className={`shrink-0 font-serif text-sm text-[#A89070] leading-relaxed mb-5 ${descClampClass}`}>{item.deskripsi}</p>
              <div className="shrink-0 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#C97B3A] font-medium">
                <span>Selengkapnya</span>
                <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}



// Main
export default function TerasMerapiHome({ initialData }) {
  const data = initialData;
  const [activeTab, setActiveTab] = useState('layanan');
  const [activeFilter, setActive] = useState('Semua');
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const handleVideoProgress = (e) => {
    const video = e.target;
    if (video.duration && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setVideoProgress(Math.min(100, Math.round((bufferedEnd / video.duration) * 100)));
    }
  };

  // GSAP Refs
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroHeadRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const heroFloatRef = useRef(null);
  const heroParticlesRef = useRef(null);
  const floatTweensRef = useRef([]);
  const orbRef = useRef(null);

  const storyRef = useRef(null);
  const storyFrameRef = useRef(null);
  const storyImgRef = useRef(null);

  const sambutanRef = useRef(null);
  const sambutanHeadRef = useRef(null);
  const sambutanRow1Img = useRef(null);
  const sambutanRow1Txt = useRef(null);
  const sambutanRow2Img = useRef(null);
  const sambutanRow2Txt = useRef(null);
  const contourRef = useRef(null);

  const exploreHeadRef = useRef(null);
  const mapRef = useRef(null);
  const footerRef = useRef(null);

  const dataWithTab = Object.fromEntries(
    Object.entries(data).map(([tab, items]) => [
      tab,
      items.map(item => ({ ...item, tab: item.tab || tab }))
    ])
  );

  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem('tm-active-tab');
      if (saved && saved !== activeTab) setActiveTab(saved);
    } catch {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabSwitch = (key) => {
    startTransition(() => {
      setActiveTab(key);
      setActive('Semua');
    });
    try { sessionStorage.setItem('tm-active-tab', key); } catch {}
  };

  const handleFilterChange = (opt) => {
    startTransition(() => {
      setActive(opt);
    });
  };

  const filteredItems = (dataWithTab[activeTab] || []).filter(
    item => activeFilter === 'Semua' || item.kategori?.toLowerCase() === activeFilter.toLowerCase()
  );

  const ambientImg = getDriveUrl(dataWithTab[activeTab]?.[0]?.gambar) || dataWithTab[activeTab]?.[0]?.gambar || null;

  const toggleMute = () => {
    if (videoRef.current) { videoRef.current.muted = !muted; setMuted(!muted); }
  };

  const customIcons = [
    "/assets/icons/person-1.svg",
    "/assets/icons/person-2.svg",
    "/assets/icons/person-3.svg",
  ];

  // Hero
  const spawnFloatLoop = (card, idx) => {
    if (!card) return;
    floatTweensRef.current[idx] = gsap.to(card, {
      y: idx % 2 === 0 ? '-=25' : '+=25',
      rotationZ: idx % 2 === 0 ? '+=4' : '-=4',
      scale: 1.04,
      duration: 3.5 + idx * 0.4,
      yoyo: true, repeat: -1, ease: 'sine.inOut'
    });
  };

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    floatTweensRef.current.forEach((t) => { if (t && t.isActive()) t.kill(); });

    if (orbRef.current) {
      gsap.to(orbRef.current, { x: x * 0.15, y: y * 0.15, duration: 1.2, ease: 'power2.out' });
    }
    if (heroFloatRef.current) {
      const cards = heroFloatRef.current.children;
      // Animate each scattered abstract card in 3D perspective with rotation and scale responsiveness
      if (cards[0]) floatTweensRef.current[0] = gsap.to(cards[0], { x: x * -0.08, y: y * -0.08, rotationZ: -14 + x * 0.02, rotationY: x * 0.03, scale: 1.05, duration: 1.0, ease: 'power2.out' });
      if (cards[1]) floatTweensRef.current[1] = gsap.to(cards[1], { x: x * 0.07, y: y * 0.07, rotationZ: 10 + x * -0.02, rotationX: -y * 0.03, scale: 1.04, duration: 1.2, ease: 'power2.out' });
      if (cards[2]) floatTweensRef.current[2] = gsap.to(cards[2], { x: x * -0.06, y: y * 0.06, rotationZ: -8 + y * 0.02, duration: 1.1, ease: 'power2.out' });
      if (cards[3]) floatTweensRef.current[3] = gsap.to(cards[3], { x: x * 0.09, y: y * -0.09, rotationZ: 14 + x * 0.02, rotationY: -x * 0.03, scale: 1.06, duration: 1.0, ease: 'power2.out' });
      if (cards[4]) floatTweensRef.current[4] = gsap.to(cards[4], { x: x * -0.05, y: y * -0.05, rotationZ: -6 + x * 0.01, duration: 1.3, ease: 'power2.out' });
      if (cards[5]) floatTweensRef.current[5] = gsap.to(cards[5], { x: x * 0.05, y: y * 0.05, rotationZ: 8 + y * -0.01, duration: 1.3, ease: 'power2.out' });
    }
    if (heroHeadRef.current) {
      gsap.to(heroHeadRef.current, { x: x * 0.02, y: y * 0.02, duration: 1.0, ease: 'power2.out' });
    }
  };

  const handleHeroMouseLeave = () => {
    if (orbRef.current) gsap.to(orbRef.current, { x: 0, y: 0, duration: 1.5, ease: 'power3.out' });
    if (heroFloatRef.current) {
      const cards = heroFloatRef.current.children;

      floatTweensRef.current.forEach((t) => { if (t && t.isActive()) t.kill(); });
      if (cards[0]) floatTweensRef.current[0] = gsap.to(cards[0], { x: 0, y: 0, rotationZ: -14, rotationY: 0, scale: 1, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[0], 0) });
      if (cards[1]) floatTweensRef.current[1] = gsap.to(cards[1], { x: 0, y: 0, rotationZ: 10, rotationX: 0, scale: 1, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[1], 1) });
      if (cards[2]) floatTweensRef.current[2] = gsap.to(cards[2], { x: 0, y: 0, rotationZ: -8, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[2], 2) });
      if (cards[3]) floatTweensRef.current[3] = gsap.to(cards[3], { x: 0, y: 0, rotationZ: 14, rotationY: 0, scale: 1, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[3], 3) });
      if (cards[4]) floatTweensRef.current[4] = gsap.to(cards[4], { x: 0, y: 0, rotationZ: -6, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[4], 4) });
      if (cards[5]) floatTweensRef.current[5] = gsap.to(cards[5], { x: 0, y: 0, rotationZ: 8, duration: 1.5, ease: 'power3.out', onComplete: () => spawnFloatLoop(cards[5], 5) });
    }
    if (heroHeadRef.current) gsap.to(heroHeadRef.current, { x: 0, y: 0, duration: 1.5, ease: 'power3.out' });
  };

  useGSAP(() => {

    /* ACT I: HERO + Story
      Scattered Abstract Collage Entry & Floating Loops
    */
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl
      .fromTo(heroBadgeRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.2)
      .fromTo(heroHeadRef.current, { y: 30, opacity: 0, filter: 'blur(14px)', scale: 0.96 }, { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.8 }, 0.4)
      .fromTo(heroSubRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.8)
      .fromTo(heroBtnRef.current, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 1.1);

    // Dramatic 3D scale and rotate entry for the scattered abstract cards
    if (heroFloatRef.current) {
      const cards = heroFloatRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.7, y: 80, filter: 'blur(12px)' },
        {
          opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
          duration: 2.2, ease: 'power3.out', stagger: 0.15, delay: 0.5,
          onComplete: () => {
            floatTweensRef.current = Array.from(cards).map((c, idx) =>
              gsap.to(c, {
                y: idx % 2 === 0 ? '-=25' : '+=25',
                rotationZ: idx % 2 === 0 ? '+=4' : '-=4',
                scale: 1.04,
                duration: 3.5 + idx * 0.4,
                yoyo: true, repeat: -1, ease: 'sine.inOut'
              })
            );
          }
        }
      );
    }

    // Smooth Dolly out on scroll
    gsap.to(heroContentRef.current, {
      y: -100, scale: 0.88, opacity: 0, filter: 'blur(12px)',
      scrollTrigger: { trigger: heroRef.current, start: '30% top', end: '90% top', scrub: 1 },
    });
    if (heroFloatRef.current) {
      gsap.to(heroFloatRef.current.children, {
        y: -140, scale: 1.15, opacity: 0, filter: 'blur(16px)',
        stagger: 0.05,
        scrollTrigger: { trigger: heroRef.current, start: '20% top', end: '85% top', scrub: 1.2 },
      });
    }

    if (storyFrameRef.current) {
      gsap.fromTo(storyFrameRef.current,
        { scale: 0.94, filter: 'blur(10px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
      );
    }
    if (storyImgRef.current) {
      gsap.to(storyImgRef.current, {
        y: '-14%', scale: 1.05,
        scrollTrigger: { trigger: storyRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }


    /* ACT II: SAMBUTAN
      TITLE ANIMATION RESTORED + CHAPTER SCENES
    */
    if (contourRef.current) {
      gsap.fromTo(contourRef.current,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: sambutanRef.current, start: 'top 80%', end: 'bottom 20%', scrub: 0.8 } }
      );
    }

    if (sambutanHeadRef.current) {
      gsap.fromTo(sambutanHeadRef.current,
        { opacity: 0, y: 45, filter: 'blur(12px)', scale: 0.96 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: sambutanHeadRef.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }

    if (sambutanRow1Img.current) {
      gsap.fromTo(sambutanRow1Img.current,
        { x: -70, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: sambutanRow1Img.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }
    if (sambutanRow1Txt.current) {
      gsap.fromTo(sambutanRow1Txt.current,
        { x: 70, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: sambutanRow1Txt.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }

    if (sambutanRow2Txt.current) {
      gsap.fromTo(sambutanRow2Txt.current,
        { x: -70, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: sambutanRow2Txt.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }
    if (sambutanRow2Img.current) {
      gsap.fromTo(sambutanRow2Img.current,
        { x: 70, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: sambutanRow2Img.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }


    /* ACT III: CATALOG
      3D Exhibition Gallery 
    */
    if (exploreHeadRef.current) {
      gsap.fromTo(exploreHeadRef.current,
        { opacity: 0, y: 35, filter: 'blur(8px)', scale: 0.96 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: exploreHeadRef.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }

    if (mapRef.current) {
      gsap.fromTo(mapRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: 'power2.out',
          scrollTrigger: { trigger: mapRef.current, start: 'top 88%', toggleActions: 'play none none none' } }
      );
    }

    if (footerRef.current) {
      gsap.fromTo(footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.inOut',
          scrollTrigger: { trigger: footerRef.current, start: 'top 92%', toggleActions: 'play none none none' } }
      );
    }

  }, { scope: mainRef });

  useEffect(() => {
    if (!heroRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        floatTweensRef.current.forEach((tween) => {
          if (entry.isIntersecting) tween.play(); else tween.pause();
        });
        heroParticlesRef.current?.classList.toggle('paused-offscreen', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);


  /* 
    JSX Widescreen Cinematic Documentary Tableau
  */

  return (
    <div ref={mainRef} className="grain">

      <div
        ref={heroRef}
        id="hero"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full h-screen flex flex-col items-center justify-center bg-[#120E0A] overflow-hidden cursor-default"
      >
        <video ref={videoRef} className="hero-video"
          style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 1.5s ease' }}
          autoPlay loop muted playsInline preload="metadata" onCanPlay={() => setVideoReady(true)}
          onProgress={handleVideoProgress}
          poster="/assets/hero-poster.webp"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        {!videoReady && (
          <div className="absolute inset-0 bg-linear-to-br from-[#1C1611] via-[#120E0A] to-[#120E0A]">
            <div className="absolute inset-0 opacity-25"
              style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #7A3F12 0%, transparent 70%)' }} />
          </div>
        )}

        <div ref={orbRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 linear-to-tr from-[#C97B3A]/25 via-[#E0A15C]/15 to-transparent rounded-full filter blur-[95px] pointer-events-none z-11 transition-opacity duration-700 opacity-80" />

        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(18,14,10,0.3) 0%, rgba(18,14,10,0.1) 40%, rgba(18,14,10,0.65) 80%, rgba(18,14,10,1) 100%)' }} />
        <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(18,14,10,0.5) 100%)' }} />

        <div ref={heroParticlesRef} className="absolute inset-0 z-13 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="tm-particle" style={{
              width: 2 + (i % 2), height: 2 + (i % 2),
              left: `${8 + i * 9}%`,
              bottom: '-10px',
              opacity: 0,
              animationDuration: `${12 + (i % 3) * 3}s`,
              animationDelay: `${i * 1.1}s`,
            }} />
          ))}
        </div>

        <div ref={heroFloatRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
          
          <div className="absolute left-[4%] top-[14%] xl:left-[8%] xl:top-[16%] pointer-events-auto group -rotate-14">
            <div className="w-40 h-52 md:w-48 md:h-64 bg-[#17120D] p-2.5 rounded-xl border border-[#5B4838]/50 group-hover:border-[#C97B3A]/80 transition-all duration-500 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <div className="relative w-full h-36 md:h-48 rounded-lg overflow-hidden">
                <Image src="/assets/blurry-merapi.jpg" alt="Merapi"
                  fill sizes="200px"
                  className="object-cover transition-transform duration-1400ms group-hover:scale-110" />
              </div>
              <div className="hidden lg:flex mt-2 items-center justify-between px-1 font-mono text-[8px] uppercase tracking-widest text-[#A89070]">
                <span>REC 01</span><span className="text-[#C97B3A]">●</span>
              </div>
            </div>
          </div>

          <div className="absolute right-[5%] top-[12%] xl:right-[9%] xl:top-[18%] pointer-events-auto group rotate-10">
            <div className="w-44 h-56 md:w-56 md:h-72 rounded-2xl overflow-hidden border border-[#5B4838]/50 group-hover:border-[#C97B3A]/80 transition-all duration-500 relative shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <Image src="/assets/night-vibe.jpeg" alt="Suasana Malam"
                fill sizes="230px" priority
                className="object-cover transition-transform duration-1400ms group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-[#120E0A]/80 via-transparent to-transparent" />
              <div className="hidden lg:block absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-[#F0E6D3] uppercase font-medium">Suasana Malam</div>
            </div>
          </div>

          <div className="absolute left-[6%] bottom-[16%] xl:left-[12%] xl:bottom-[18%] pointer-events-auto group -rotate-8 hidden sm:block">
            <div className="w-44 h-40 md:w-52 md:h-48 rounded-2xl overflow-hidden border border-[#5B4838]/50 group-hover:border-[#C97B3A]/80 transition-all duration-500 relative bg-[#17120D] shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <Image src="/assets/teras-merapi.jpeg" alt="Spot Foto Teras Merapi"
                fill sizes="210px"
                className="object-cover transition-transform duration-1400ms group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-[#120E0A]/90 via-transparent to-transparent" />
              <div className="hidden lg:flex absolute bottom-3 left-3 items-center gap-2 font-mono text-[8px] tracking-widest text-[#C97B3A] uppercase">
                <Camera size={11} /><span>Spot Foto</span>
              </div>
            </div>
          </div>

          <div className="absolute right-[6%] bottom-[10%] xl:right-[11%] xl:bottom-[17%] pointer-events-auto group rotate-14 hidden sm:block">
            <div className="w-40 h-48 md:w-48 md:h-56 bg-[#17120D] p-2.5 rounded-xl border border-[#5B4838]/50 group-hover:border-[#C97B3A]/80 transition-all duration-500 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <div className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden">
                <Image src="/assets/us.jpg" alt="Behind This Wall"
                  fill sizes="200px"
                  className="object-cover transition-transform duration-1400ms group-hover:scale-110" />
              </div>
              <div className="hidden lg:flex mt-2.5 items-center justify-between px-1 font-mono text-[8px] uppercase tracking-widest text-[#A89070]">
                <span>Angan Cangkringan</span><span className="text-[#C97B3A] font-bold">US.</span>
              </div>
            </div>
          </div>

          <div className="absolute left-[22%] top-[24%] pointer-events-auto -rotate-6 hidden lg:flex">
            <div className="px-3.5 py-1.5 rounded-full bg-[#17120D]/85 border border-[#C97B3A]/40 backdrop-blur-md shadow-xl flex items-center gap-2 font-mono text-[9px] tracking-widest text-[#F0E6D3] uppercase">
              <Sparkles size={11} className="text-[#C97B3A]" /><span>1.200 Mdpl</span>
            </div>
          </div>

          <div className="absolute right-[22%] top-[28%] pointer-events-auto rotate-8 hidden lg:flex">
            <div className="w-48 bg-[#17120D]/90 backdrop-blur-xl border border-[#5B4838]/45 rounded-xl p-3.5 shadow-2xl">
              <p className="font-serif text-xs text-[#F0E6D3]/90 italic leading-relaxed">"Harmoni alam dan kehangatan warga lereng Merapi."</p>
              <span className="font-mono text-[8px] uppercase tracking-widest text-[#C97B3A] block text-right mt-2 font-medium">- Teras Merapi</span>
            </div>
          </div>

        </div>

        {/* Foreground title */}
        <div ref={heroContentRef} className="relative z-30 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pointer-events-none">
          <div ref={heroBadgeRef} className="pointer-events-auto">
            <ImagesBadge text="1.000+ Wisatawan Terpesona" images={customIcons} />
          </div>
          <h1 ref={heroHeadRef} className="font-serif text-6xl md:text-8xl font-medium text-[#F0E6D3] tracking-tight leading-[1.05] mb-6">
            Teras<br /><span className="shimmer-text">Merapi</span>
          </h1>
          <p ref={heroSubRef} className="font-serif text-lg md:text-xl text-[#A89070] max-w-xl mb-12 leading-relaxed">
            Di mana tradisi bertemu langit, dan kopi tumbuh di bawah bayang sang penjaga.
          </p>
          <div ref={heroBtnRef} className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4">
            <a href="#explore" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#C97B3A] text-[#120E0A] rounded-full font-mono text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-[#E0A15C] hover:shadow-[0_0_30px_rgba(201,123,58,0.35)]">
              Mulai Jelajahi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#cerita" className="group inline-flex items-center gap-2 px-6 py-3.5 border border-[#5B4838]/50 text-[#F0E6D3]/90 rounded-full font-mono text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:border-[#F0E6D3]/80 hover:text-[#F0E6D3]">
              Baca Cerita
            </a>
          </div>
        </div>

        <button onClick={toggleMute} className="absolute bottom-8 right-8 z-30 p-2.5 rounded-full border border-[#5B4838]/40 backdrop-blur-md text-[#F0E6D3]/70 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/60 transition-all duration-300">
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <div className="absolute bottom-8 left-1/2 z-30 flex flex-col items-center gap-2">
          {videoReady ? (
            <div className="flex flex-col items-center gap-2 animate-bounce-subtle opacity-50">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F0E6D3]">Scroll</span>
              <ChevronDown size={14} className="text-[#F0E6D3]" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-70">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#A89070]">Menyiapkan Video</span>
              <div className="w-32 h-0.5 bg-[#5B4838]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C97B3A] transition-all duration-300 ease-out"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>


      {/*
        MARQUEE: Title Card
      */}

      <div className="border-b border-[#5B4838]/20 py-3.5 overflow-hidden bg-[#120E0A]">
        <div className="flex gap-8 whitespace-nowrap font-mono text-[10px] tracking-[0.22em] uppercase text-[#C97B3A]/70 animate-marquee" style={{ width: 'max-content' }}>
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>UMKM Lokal</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Homestay</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Events</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Sunset & Sunrise</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Outbond</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Festival Budaya</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Area Camping</span><span className="text-[#C97B3A]/40">◆</span>
              <span>Teras Merapi</span><span className="text-[#C97B3A]/40">◆</span>
            </span>
          ))}
        </div>
      </div>


      {/* 
        STORY Widescreen Cinematic Tableau
       */}

      <section ref={storyRef} id="cerita" className="py-28 md:py-44 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 pb-10 border-b border-[#5B4838]/25">
          <div className="max-w-3xl">
            <ArtsyEyebrow text="Bab I · Jejak Penjaga" />
            <h2 className="font-serif text-5xl md:text-7xl text-[#F0E6D3] tracking-tight leading-[1.08] mt-2">
              Napas Kehidupan di <br /><span className="text-[#A89070] italic font-normal">Pangkuan Merapi</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[#A89070]/70 font-mono text-xs tracking-widest uppercase">
            <span>\\ Dokumenter · Lereng Merapi</span>
          </div>
        </div>

        <div ref={storyFrameRef} className="relative w-full h-[55vh] md:h-[72vh] rounded-2xl overflow-hidden border border-[#5B4838]/30 shadow-[0_25px_80px_rgba(0,0,0,0.8)] mb-16 group">
          <Image
            ref={storyImgRef}
            src="/assets/merapi-from-drone.png"
            alt="Suasana Desa Teras Merapi"
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            onError={(e) => { e.currentTarget.src = placeholderImage('Suasana Desa Teras Merapi', { w: 1600, h: 900 }); }}
            className="object-cover scale-110 transition-transform duration-2000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#120E0A] via-[#120E0A]/30 to-transparent" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(18,14,10,0.6) 100%)' }} />
  
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 max-w-lg">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#C97B3A] uppercase block mb-1 font-medium">Lokasi Pengambilan Gambar</span>
            <p className="font-serif text-xl md:text-2xl text-[#F0E6D3]">Kalitengah Kidul (dengan drone).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6 space-y-6">
            <p className="font-serif text-2xl md:text-3xl text-[#F0E6D3] leading-[1.6] font-normal">
              <span className="text-[#C97B3A] text-7xl md:text-8xl float-left mr-4 leading-none font-serif">T</span>
              eras Merapi bukan sekadar destinasi, melainkan sebuah ruang pameran hidup—tempat masyarakat menyulam tradisi di bawah bayang-bayang gunung berapi paling aktif di Indonesia.
            </p>
            <p className="font-serif text-lg md:text-xl text-[#A89070] leading-[1.9]">
              Berdiri di lahan yang pernah disapu erupsi, kawasan ini bangkit menjadi simbol resiliensi.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-8 lg:pl-8 lg:border-l border-[#5B4838]/30">
            <p className="font-serif text-lg md:text-xl text-[#A89070] leading-[1.9]">
              Kini, setiap jengkal tanahnya menawarkan kehangatan kopi lokal, karya tangan terampil, hingga ruang hening bagi jiwa yang mencari pelarian dari bisingnya kota.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#5B4838]/25">
              {[
                { target: '1.2', suffix: 'K+', label: 'Ketinggian (Mdpl)' },
                { target: String(data.umkm.length), suffix: '+', label: 'UMKM Aktif' },
                { target: '24', suffix: '/7', label: 'Kehangatan' }
              ].map(({ target, suffix, label }) => (
                <div key={label}>
                  <Counter target={target} suffix={suffix} />
                  <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#A89070]/70 mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/*
        SAMBUTAN
       */}

      <section ref={sambutanRef} id="sambutan" className="relative py-36 md:py-48 px-6 md:px-12 max-w-7xl mx-auto border-t border-b border-[#5B4838]/25 overflow-hidden">
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-56 md:h-72 opacity-[0.2]"
          aria-hidden="true"
        >
          <path
            ref={contourRef}
            d="M-10,170 L90,90 L150,130 L230,40 L300,115 L380,55 L470,150 L610,80"
            fill="none"
            stroke="#C97B3A"
            strokeWidth="1.5"
            pathLength="1"
            strokeDasharray="1"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C97B3A]/5 rounded-full filter blur-[90px] pointer-events-none" />

        <div ref={sambutanHeadRef} className="relative max-w-3xl mb-24 md:mb-32">
          <div>
            <ArtsyEyebrow text="Bab II · Sugeng Rawuh" />
          </div>

          <div className="overflow-hidden">
            <h2 className="font-serif text-4xl md:text-6xl text-[#F0E6D3] leading-[1.1]">
              Selamat Datang di <span className="text-[#A89070] italic font-normal">Teras Merapi</span>
            </h2>
          </div>

          <p className="font-serif text-lg text-[#A89070] leading-[2.2] mt-6">
            Nikmati pengalaman wisata alam yang memadukan keindahan panorama Gunung Merapi, udara pegunungan yang sejuk, serta berbagai wahana rekreasi yang cocok untuk keluarga, sahabat, maupun rombongan. Terletak di lereng selatan Gunung Merapi, Teras Merapi menjadi salah satu destinasi favorit di kawasan Cangkringan, Sleman, yang menawarkan perpaduan wisata alam, edukasi, dan spot foto yang menarik.
          </p>

          <div className="inline-flex items-center gap-2.5 mt-8 px-4 py-2 rounded-full bg-[#17120D] border border-[#5B4838]/35 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <Clock size={13} className="text-[#C97B3A]" />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#A89070]">Buka Setiap Hari · 08.00–19.00 WIB</span>
          </div>
        </div>

        {/* Seputar Teras Merapi (Scene 01) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28 md:mb-36">
          <div ref={sambutanRow1Img} className="lg:col-span-7 relative h-80 md:h-105 rounded-2xl overflow-hidden border border-[#5B4838]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7)] group">
            <Image
              src="/assets/merapi.jpeg"
              alt="Panorama Gunung Merapi dari Teras Merapi"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              onError={(e) => { e.currentTarget.src = placeholderImage('Panorama Merapi', { w: 1200, h: 800 }); }}
              className="object-cover transition-transform duration-1400ms group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#120E0A]/60 via-transparent to-transparent" />
            <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.25em] uppercase text-[#C97B3A] bg-[#120E0A]/75 px-3 py-1.5 rounded-full border border-[#5B4838]/40">
              Kalitengah Kidul
            </div>
          </div>

          <div ref={sambutanRow1Txt} className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-[#C97B3A]" />
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C97B3A] font-medium">Seputar Teras Merapi</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-[#F0E6D3] leading-snug">
              Berpijak di <br /><span className="text-[#A89070] italic font-normal">Kalitengah Kidul</span>
            </h3>
            <p className="font-serif text-lg text-[#A89070] leading-[2.1]">
              Teras Merapi merupakan destinasi wisata alam yang berada di Kalitengah Kidul, Glagaharjo, Cangkringan, Kabupaten Sleman, Daerah Istimewa Yogyakarta. Tak jauh dari Bukit Klangon dan kawasan wisata Merapi lainnya, tempat ini menyuguhkan pemandangan langsung ke arah sang gunung sehingga menjadi lokasi ideal untuk menikmati keindahan alam maupun berfoto, dengan ragam wahana rekreasi untuk semua kalangan, dari anak-anak hingga dewasa.
            </p>
          </div>
        </div>

        {/* Sejarah Singkat/Bangkit dari Bayang Erupsi (Scene 02) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div ref={sambutanRow2Txt} className="order-2 lg:order-1 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-[#C97B3A]" />
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C97B3A] font-medium">Sejarah Singkat</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-[#F0E6D3] leading-snug">
              Bangkit dari <br /><span className="text-[#A89070] italic font-normal">Bayang Erupsi</span>
            </h3>
            <p className="font-serif text-lg text-[#A89070] leading-[2.1]">
              Teras Merapi dibangun sebagai upaya menghidupkan kembali potensi wisata di lereng Merapi pasca berbagai aktivitas erupsi yang pernah terjadi. Kehadirannya bertujuan menggerakkan kembali sektor pariwisata sekaligus meningkatkan perekonomian warga sekitar, lewat wisata yang mengedepankan keindahan alam, edukasi, dan rekreasi keluarga. Kini, Teras Merapi tumbuh menjadi destinasi yang banyak dikunjungi wisatawan lokal maupun luar daerah.
            </p>
          </div>

          <div ref={sambutanRow2Img} className="order-1 lg:order-2 lg:col-span-7 relative h-80 md:h-105 rounded-2xl overflow-hidden border border-[#5B4838]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7)] group">
            <Image
              src="/assets/Ibu Warung Bawah.jpeg"
              alt="Pemulihan kawasan lereng Merapi pasca erupsi"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              onError={(e) => { e.currentTarget.src = placeholderImage('Sejarah Teras Merapi', { w: 1200, h: 800 }); }}
              className="object-cover transition-transform duration-1400ms group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#120E0A]/60 via-transparent to-transparent" />
            <div className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.25em] uppercase text-[#C97B3A] bg-[#120E0A]/75 px-3 py-1.5 rounded-full border border-[#5B4838]/40">
              Resiliensi
            </div>
          </div>
        </div>
      </section>


      {/* 
        EXPLORE/CATALOG
       */}

      <section id="explore" className="relative py-24 min-h-screen">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ambientImg && (
            <Image
              key={ambientImg}
              src={ambientImg}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="object-cover scale-125 blur-3xl animate-ambient-fade"
            />
          )}
          <div className="absolute inset-0 bg-[#120E0A]/55" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(18,14,10,0.65) 100%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">

        <div ref={exploreHeadRef} className="mb-10">
          <ArtsyEyebrow text="Bab III · Katalog Desa" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-16">
            <h2 className="font-serif text-4xl md:text-6xl text-[#F0E6D3] leading-tight shrink-0">
              Potensi <span className="text-[#A89070] italic font-normal">Teras Merapi</span>
            </h2>
            <p className="font-serif text-lg text-[#A89070] lg:mb-1.5 lg:max-w-xs">\\ Dikelola oleh warga desa.</p>
          </div>
        </div>

        <div
          key={`desc-${activeTab}`}
          className="animate-tab-fade border-t border-[#5B4838]/30 pt-8 mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start"
        >
          <div className="md:col-span-3">
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#C97B3A] font-medium flex items-center gap-1.5 mb-3">
              <span className="text-xs">✧</span> {TAB_DESCRIPTIONS[activeTab]?.title}
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-[#F0E6D3] font-normal italic leading-snug">
              "{TAB_DESCRIPTIONS[activeTab]?.subtitle}"
            </h3>
          </div>

          <div className="hidden md:block md:col-span-1 self-stretch">
            <div className="w-px h-full bg-linear-to-b from-[#C97B3A]/40 via-[#5B4838]/30 to-transparent mx-auto" />
          </div>

          <div className="md:col-span-8 space-y-3 font-serif text-base md:text-lg text-[#A89070] leading-[1.9]">
            <p>{TAB_DESCRIPTIONS[activeTab]?.p1}</p>
            <p className="text-[#A89070]/70">{TAB_DESCRIPTIONS[activeTab]?.p2}</p>
          </div>
        </div>

        <div className="sticky top-6 md:top-8 z-60 mt-6 mb-14 flex flex-col items-end gap-3 pointer-events-none w-full">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#17120D]/92 border border-[#5B4838]/45 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl max-w-full overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => handleTabSwitch(key)}
                className={`group relative flex items-center justify-center py-2.5 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-500 ease-out whitespace-nowrap cursor-pointer ${
                  activeTab === key
                    ? 'px-4 md:px-5 bg-[#C97B3A] text-[#120E0A] shadow-[0_0_20px_rgba(201,123,58,0.4)] font-semibold scale-[1.02]'
                    : 'px-3.5 md:px-5 text-[#A89070] hover:text-[#F0E6D3] hover:bg-[#5B4838]/30'
                }`}>
                <Icon size={14} className="shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <span className={`overflow-hidden transition-all duration-500 ease-out flex items-center ${
                  activeTab === key
                    ? 'max-w-xs opacity-100 ml-2'
                    : 'max-w-0 opacity-0 ml-0 md:max-w-xs md:opacity-100 md:ml-2'
                }`}>
                  <span className="whitespace-nowrap">{label}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="pointer-events-auto inline-flex flex-wrap items-center justify-end gap-1.5 max-w-full no-scrollbar">
            {(FILTER_OPTIONS[activeTab] || ['Semua']).map(opt => (
              <button key={opt} onClick={() => handleFilterChange(opt)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 shadow-md cursor-pointer ${
                  opt === activeFilter
                    ? 'bg-[#C97B3A] text-[#120E0A] font-semibold shadow-[0_0_15px_rgba(201,123,58,0.3)]'
                    : 'bg-[#17120D]/90 text-[#A89070]/80 border border-[#5B4838]/35 hover:border-[#C97B3A]/50 hover:text-[#F0E6D3]'
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div key={`catalog-${activeTab}`}>
          {filteredItems.length > 0 ? (
            <ResponsiveMasonry items={filteredItems} activeTab={activeTab} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <Search size={40} className="text-[#5B4838] mb-4" />
              <p className="font-serif text-[#A89070]/60 text-lg">Belum ada data untuk kategori ini.</p>
            </div>
          )}
        </div>

        <div className="sr-only">
          {TABS.map(({ key: tabKey, label }) => {
            if (tabKey === activeTab) return null;
            const items = dataWithTab[tabKey] || [];
            if (items.length === 0) return null;
            return (
              <div key={tabKey}>
                <h3>{TAB_DESCRIPTIONS[tabKey]?.title || label}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={`${tabKey}-${item.id}`}>
                      <Link href={`/${tabKey}/${item.id}`}>{item.nama}</Link>
                      {item.kategori ? ` — ${item.kategori}` : ''}
                      {item.deskripsi ? `. ${item.deskripsi}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>


        <div ref={mapRef}>
          <div className="mt-8 rounded-2xl overflow-hidden border border-[#5B4838]/25 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="px-6 py-5 border-b border-[#5B4838]/25 flex items-center gap-3 bg-[#17120D]">
              <MapPin size={16} className="text-[#C97B3A]" />
              <div>
                <h3 className="font-serif text-lg text-[#F0E6D3]">Peta Kawasan</h3>
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/60 mt-0.5">Teras Merapi, Lereng Merapi, Sleman</p>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.8849329290483!2d110.45598269999996!3d-7.587501799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a67890295f307%3A0x57397a1c14d58629!2sTeras%20Merapi!5e0!3m2!1sen!2sid!4v1782659560987!5m2!1sen!2sid"
              width="100%" height="380"
              style={{ border: 0, filter: 'sepia(25%) contrast(1.05) brightness(0.88)' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        </div>
      </section>

      <footer ref={footerRef} id="footer" className="bg-[#120E0A] py-16 px-8 border-t border-[#5B4838]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#5B4838]/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mountain size={18} className="text-[#C97B3A]" />
                <span className="font-serif text-xl text-[#F0E6D3]">Teras Merapi</span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89070]/60">Desa Wisata · KKN-PPM UGM Angan Cangkringan 2026</span>
            </div>
            <div className="flex items-center gap-6">
              {[
                { Icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/wisata.terasmerapi', target: '_blank' },
                { Icon: Phone, label: 'WhatsApp', href: 'https://wa.me/6285290125106', target: '_blank' },
                { Icon: Mail, label: 'Email', href: 'mailto:wisataterasmerapi@gmail.com', target: '_blank' },
              ].map(({ Icon, label, href, target }) => (
                <a key={label} href={href} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[#A89070]/60 hover:text-[#C97B3A] transition-colors duration-300" target={target}>
                  <Icon size={13} />{label}
                </a>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/50">© 2026 Desa Wisata Teras Merapi</p>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/50">
              Salam hangat dari <a href="https://www.tiktok.com/@angan.cangkringan" target="_blank" rel="noopener noreferrer" className="no-underline hover:text-[#A89070] transition-colors duration-300">Angan ♥</a>
            </p>
          </div>
        </div>
      </footer>

      <SectionNavDots />

    </div>
  );
}