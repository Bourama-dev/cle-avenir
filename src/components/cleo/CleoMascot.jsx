import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Illustrations transparentes de CLÉO, la mascotte CléAvenir.
 * Fichiers dans public/images/cleo/ — dimensions réelles pour éviter les décalages de mise en page.
 */
export const CLEO_POSES = {
  coucou: { w: 320, h: 462, alt: 'CLÉO, la mascotte CléAvenir, qui fait coucou' },
  presente: { w: 394, h: 466, alt: 'CLÉO, la mascotte CléAvenir, qui présente une information' },
  reflexion: { w: 296, h: 467, alt: 'CLÉO, la mascotte CléAvenir, en pleine réflexion' },
  celebre: { w: 399, h: 503, alt: 'CLÉO, la mascotte CléAvenir, qui célèbre une réussite' },
  ordinateur: { w: 444, h: 468, alt: 'CLÉO, la mascotte CléAvenir, assise avec son ordinateur' },
  bienvenue: { w: 472, h: 497, alt: 'CLÉO, la mascotte CléAvenir, qui ouvre grand les bras' },
  'carnet-idee': { w: 488, h: 515, alt: 'CLÉO, la mascotte CléAvenir, qui prend des notes dans son carnet' },
  'cv-valide': { w: 480, h: 480, alt: 'CLÉO, la mascotte CléAvenir, qui montre un CV validé' },
  'montre-haut': { w: 473, h: 488, alt: 'CLÉO, la mascotte CléAvenir, qui pointe vers le haut' },
  'ordinateur-livres': { w: 476, h: 497, alt: 'CLÉO, la mascotte CléAvenir, assise sur des livres avec son ordinateur' },
  pouce: { w: 340, h: 494, alt: 'CLÉO, la mascotte CléAvenir, qui lève le pouce' },
  'victoire-ordinateur': { w: 407, h: 490, alt: 'CLÉO, la mascotte CléAvenir, qui fête une victoire devant son ordinateur' },
};

/**
 * @param {object} props
 * @param {keyof CLEO_POSES} props.pose   Pose à afficher
 * @param {string} [props.className]      Classes de taille / position (ex. "w-40")
 * @param {boolean} [props.float]         Léger flottement continu (désactivé si mouvement réduit)
 * @param {boolean} [props.decorative]    true = image décorative (alt vide)
 * @param {boolean} [props.eager]         Chargement immédiat (au-dessus de la ligne de flottaison)
 * @param {number} [props.delay]          Délai de l'apparition
 */
export default function CleoMascot({ pose, className = '', float = true, decorative = false, eager = false, delay = 0 }) {
  const reduce = useReducedMotion();
  const p = CLEO_POSES[pose];
  if (!p) return null;

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.img
        src={`/images/cleo/cleo-${pose}.webp`}
        width={p.w}
        height={p.h}
        alt={decorative ? '' : p.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="block h-auto w-full drop-shadow-[0_18px_24px_rgba(76,29,149,0.18)]"
        animate={reduce || !float ? undefined : { y: [0, -10, 0] }}
        transition={reduce || !float ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.8 }}
      />
    </motion.div>
  );
}
