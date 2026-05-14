import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * TextReveal — animates text word by word as it enters the viewport.
 *
 * @param {string} text - the text to animate
 * @param {string} as - HTML tag to render (default "span")
 * @param {number} delay - base delay before the first word (seconds)
 * @param {number} stagger - delay between each word (seconds)
 * @param {string} className - className applied to the wrapper tag
 */
const TextReveal = ({
  text,
  as: Tag = 'span',
  delay = 0,
  stagger = 0.055,
  className,
}) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.45,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {/* Preserve inter-word space */}
          {i < words.length - 1 && <span aria-hidden> </span>}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default TextReveal;
