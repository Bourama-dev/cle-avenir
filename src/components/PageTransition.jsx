import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.985,
    filter: 'blur(5px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 1.008,
    filter: 'blur(3px)',
  },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const PageTransition = ({ children }) => {
  const reduce = useReducedMotion();
  const v = reduce ? reducedVariants : variants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={v}
      transition={{
        duration: reduce ? 0.2 : 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
