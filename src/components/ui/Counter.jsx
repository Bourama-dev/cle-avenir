import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const Counter = ({ from = 0, to, duration = 2, className }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(from + (to - from) * ease));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef} className={className}>{count}</span>;
};

export default Counter;