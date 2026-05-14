import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * AnimatedSection — scroll-triggered container that staggers its AnimatedItem children.
 * @param {number} delay - initial delay before stagger starts (seconds)
 * @param {string} margin - viewport intersection margin (e.g. "-80px")
 */
export function AnimatedSection({ children, className, delay = 0, margin = '-60px' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.09,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedItem — individual child of AnimatedSection.
 * Inherits stagger timing from the parent container.
 */
export function AnimatedItem({ children, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? reducedItemVariants : itemVariants}
    >
      {children}
    </motion.div>
  );
}
