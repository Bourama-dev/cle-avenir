import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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
          Découvre CléAvenir en 60 secondes
        </h2>
        <p
          style={{
            color: '#667eea',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 500,
            marginBottom: 40,
          }}
        >
          La plateforme d'orientation IA qui change tout
        </p>

        {/* Responsive 16:9 wrapper */}
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/z6SXP8BO15M?rel=0&modestbranding=1"
            title="CléAvenir - Présentation officielle"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
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
