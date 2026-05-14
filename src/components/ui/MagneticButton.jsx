import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * MagneticButton — wraps any element and pulls it toward the cursor
 * when the pointer hovers nearby.
 *
 * @param {number} strength - translation strength in px (default 0.25 of offset)
 * @param {string} className - className for the wrapper div
 */
const MagneticButton = ({ children, strength = 0.28, className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 200, damping: 18, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    rawX.set(cx * strength);
    rawY.set(cy * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
