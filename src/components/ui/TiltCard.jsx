import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * TiltCard — wraps any content with a 3D perspective tilt on mouse hover.
 * Automatically disables when the user prefers reduced motion.
 *
 * @param {number} intensity - max tilt degrees (default 8)
 * @param {number} glare - 0–1 intensity of the specular glare overlay (default 0.15)
 */
const TiltCard = ({ children, className, intensity = 8, glare = 0.15, onClick, style }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 160, damping: 22, mass: 0.6 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  if (reduce) {
    return (
      <div className={className} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: '1000px', ...style }}>
      <motion.div
        ref={ref}
        className={`relative overflow-hidden ${className ?? ''}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
      >
        {children}

        {/* Specular glare overlay */}
        {glare > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,${glare}) 0%, transparent 60%)`
              ),
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;
