import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Palette de couleurs par section / scroll
const SCROLL_PALETTES = [
  { from: '#fdf2f8', mid: '#fce7f3', to: '#e0f2fe' }, // Hero    — rose→cyan
  { from: '#eff6ff', mid: '#dbeafe', to: '#f0fdf4' }, // Section 2 — bleu→vert
  { from: '#faf5ff', mid: '#ede9fe', to: '#fdf2f8' }, // Section 3 — violet→rose
  { from: '#f0fdf4', mid: '#dcfce7', to: '#eff6ff' }, // Section 4 — vert→bleu
  { from: '#fff7ed', mid: '#ffedd5', to: '#fdf4ff' }, // Section 5 — orange→violet
];

// Orbes flottants
const ORBS = [
  { size: 600, x: '10%',  y: '5%',  color: 'rgba(244,63,94,0.12)',   dur: 18 },
  { size: 500, x: '70%',  y: '15%', color: 'rgba(6,182,212,0.10)',   dur: 22 },
  { size: 400, x: '40%',  y: '60%', color: 'rgba(124,58,237,0.09)',  dur: 16 },
  { size: 350, x: '80%',  y: '70%', color: 'rgba(245,158,11,0.08)',  dur: 25 },
  { size: 300, x: '5%',   y: '75%', color: 'rgba(16,185,129,0.08)',  dur: 20 },
];

export default function DynamicBackground({ children }) {
  const containerRef = useRef(null);
  const [palette, setPalette] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Suivi souris
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 20 });

  // Orbe principal suit la souris
  const orbX = useTransform(mouseX, [0, 1], ['-10%', '10%']);
  const orbY = useTransform(mouseY, [0, 1], ['-8%', '8%']);

  const handleMouseMove = useCallback((e) => {
    rawX.set(e.clientX / window.innerWidth);
    rawY.set(e.clientY / window.innerHeight);
  }, [rawX, rawY]);

  // Touch / swipe
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const dy = touchStart.current - e.touches[0].clientY;
    rawY.set(Math.max(0, Math.min(1, rawY.get() + dy / window.innerHeight * 0.5)));
    touchStart.current = e.touches[0].clientY;
  };

  // Scroll → changement de palette
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
      const idx = Math.min(
        Math.floor(progress * SCROLL_PALETTES.length),
        SCROLL_PALETTES.length - 1
      );
      setPalette(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const p = SCROLL_PALETTES[palette];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Fond dégradé animé qui change au scroll */}
      <motion.div
        className="fixed inset-0 -z-20 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse at 50% 0%, ${p.mid} 0%, ${p.from} 50%, ${p.to} 100%)`,
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Orbes flottants fixes */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="fixed -z-10 rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            x: i === 0 ? orbX : undefined,
            y: i === 1 ? orbY : undefined,
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Orbe curseur (suit la souris directement) */}
      <motion.div
        className="fixed -z-10 rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          left: useTransform(mouseX, [0, 1], ['-150px', `calc(100vw - 150px)`]),
          top:  useTransform(mouseY, [0, 1], ['-150px', `calc(100vh - 150px)`]),
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Grain de texture subtil */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Contenu */}
      {children}
    </div>
  );
}
