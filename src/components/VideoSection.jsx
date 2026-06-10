import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const VIDEOS = [
  {
    id: 'z6SXP8BO15M',
    title: 'CléAvenir - Présentation officielle',
    label: 'Présentation',
  },
  {
    id: 'QedCSeYSDe8',
    title: 'CléAvenir - Présentation du fondateur',
    label: 'Le fondateur',
  },
];

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => goTo((current - 1 + VIDEOS.length) % VIDEOS.length);
  const next = () => goTo((current + 1) % VIDEOS.length);

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        padding: '80px 20px',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}
      >
        {/* Titles */}
        <h2
          style={{
            color: '#E91E8C',
            fontWeight: 800,
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Découvre CléAvenir en vidéo
        </h2>
        <p
          style={{
            color: '#667eea',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          La plateforme d'orientation IA qui change tout
        </p>

        {/* Tab indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
          {VIDEOS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => goTo(i)}
              style={{
                padding: '8px 22px',
                borderRadius: 50,
                border: '2px solid',
                borderColor: i === current ? '#E91E8C' : '#e2e8f0',
                background: i === current ? '#E91E8C' : 'white',
                color: i === current ? 'white' : '#64748b',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative' }}>
          {/* Prev / Next arrows */}
          {['prev', 'next'].map((dir) => (
            <button
              key={dir}
              onClick={dir === 'prev' ? prev : next}
              aria-label={dir === 'prev' ? 'Vidéo précédente' : 'Vidéo suivante'}
              style={{
                position: 'absolute',
                top: '50%',
                [dir === 'prev' ? 'left' : 'right']: -20,
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'white',
                border: '2px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: '#E91E8C',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(233,30,140,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            >
              {dir === 'prev' ? '‹' : '›'}
            </button>
          ))}

          {/* Slide wrapper */}
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEOS[current].id}?rel=0&modestbranding=1`}
                  title={VIDEOS[current].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Vidéo ${i + 1}`}
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  borderRadius: 50,
                  background: i === current ? '#E91E8C' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40 }}>
          <Link
            to="/test-orientation"
            style={{
              display: 'inline-block',
              backgroundColor: '#E91E8C',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 50,
              padding: '14px 40px',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.88';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Faire le test gratuit →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
