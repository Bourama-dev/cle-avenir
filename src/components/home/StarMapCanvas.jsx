import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { constellationNodes } from '@/data/constellationNodes';

/**
 * Interactive constellation of métiers/formations for the "Cartographie"
 * landing direction. Nodes are procedurally laid out (deterministic seed,
 * stable across renders) and drawn on a raw <canvas> — no Three.js/r3f,
 * see the landing rebuild plan for why. Hover/click hit-testing is done
 * by distance-to-node on pointer coordinates, no DOM node per star.
 */

const PALETTE = {
  light: {
    goldLine: 'rgba(138, 106, 47, 0.16)',
    gold: '#8a6a2f',
    route: '#e8459a',
    metier: '#8a6a2f',
    formation: '#147a68',
  },
  dark: {
    goldLine: 'rgba(201, 161, 90, 0.18)',
    gold: '#c9a15a',
    route: '#f472b6',
    metier: '#c9a15a',
    formation: '#4fd6b8',
  },
};

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function layoutNodes(nodes, width, height) {
  const rand = seededRandom(1337);
  const margin = 0.08;
  return nodes.map((n, i) => ({
    ...n,
    x: (margin + rand() * (1 - margin * 2)) * width,
    y: (margin + rand() * (1 - margin * 2)) * height,
    r: n.type === 'metier' ? 3.4 : 2.4,
    phase: rand() * Math.PI * 2,
    speed: 0.4 + rand() * 0.3,
    index: i,
  }));
}

function buildRoute(laidOut) {
  const metiers = laidOut.filter((n) => n.type === 'metier');
  const formations = laidOut.filter((n) => n.type === 'formation');
  // Alternate a métier and a compatible-looking formation to trace one
  // plausible "path" across the map — purely illustrative, not a real
  // recommendation engine.
  const route = [];
  const count = Math.min(4, metiers.length);
  for (let i = 0; i < count; i++) {
    route.push(metiers[Math.floor((i / count) * metiers.length)]);
    if (formations[i]) route.push(formations[i]);
  }
  return route;
}

export default function StarMapCanvas({ className = '', onNodeSelect }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const layoutRef = useRef({ nodes: [], route: [], w: 0, h: 0 });
  const rafRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const active = pinned || hovered;

  const draw = useCallback(
    (t) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { nodes, route, w, h } = layoutRef.current;
      const colors = isDark ? PALETTE.dark : PALETTE.light;

      ctx.clearRect(0, 0, w, h);

      const maxDist = Math.max(w, h) * 0.18;
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.goldLine;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.strokeStyle = colors.route;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      route.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.globalAlpha = 1;

      nodes.forEach((n) => {
        const isActive = active && active.id === n.id;
        const twinkle = reducedMotionRef.current
          ? 1
          : 0.55 + 0.45 * Math.sin((t / 1000) * n.speed + n.phase);
        ctx.globalAlpha = isActive ? 1 : twinkle;
        ctx.fillStyle = n.type === 'metier' ? colors.metier : colors.formation;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isActive ? n.r + 2.5 : n.r, 0, Math.PI * 2);
        ctx.fill();
        if (isActive) {
          ctx.strokeStyle = n.type === 'metier' ? colors.metier : colors.formation;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      if (!reducedMotionRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    },
    [isDark, active]
  );

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const laidOut = layoutNodes(constellationNodes, rect.width, rect.height);
      layoutRef.current = { nodes: laidOut, route: buildRoute(laidOut), w: rect.width, h: rect.height };
    }

    resize();
    window.addEventListener('resize', resize);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  useEffect(() => {
    // redraw once immediately when hover/pin changes, in case rAF loop is
    // paused (reduced motion) or between frames.
    const canvas = canvasRef.current;
    if (canvas && reducedMotionRef.current) draw(performance.now());
  }, [active, draw]);

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { nodes } = layoutRef.current;
    let closest = null;
    let closestDist = 14; // hit radius in px
    for (const n of nodes) {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < closestDist) {
        closest = n;
        closestDist = d;
      }
    }
    setHovered(closest);
    if (closest) setTooltipPos({ x, y });
  };

  const handleClick = () => {
    if (hovered) {
      setPinned((prev) => (prev && prev.id === hovered.id ? null : hovered));
      onNodeSelect?.(hovered);
    } else {
      setPinned(null);
    }
  };

  const handleKeyActivate = (node) => {
    setPinned((prev) => (prev && prev.id === node.id ? null : node));
    onNodeSelect?.(node);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHovered(null)}
        onClick={handleClick}
        className="block w-full h-full cursor-crosshair"
      />

      {active && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 max-w-[220px] -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-sm border border-amber-800/20 bg-white px-3 py-2 shadow-lg dark:border-amber-300/20 dark:bg-slate-900"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-wider opacity-70">
            {active.type === 'metier' ? 'Métier' : 'Formation'}
          </p>
          <p className="font-semibold text-sm leading-snug">{active.label}</p>
          {active.meta && <p className="text-xs opacity-70 mt-0.5">{active.meta}</p>}
        </div>
      )}

      {/* Accessible fallback: every node is also a real, focusable, keyboard-
          activatable button, invisibly positioned over the canvas — screen
          reader and keyboard users get the same content without depending
          on canvas rendering or pointer events. */}
      <div className="sr-only">
        <h2>Métiers et formations représentés sur la carte</h2>
        <ul>
          {constellationNodes.map((n) => (
            <li key={n.id}>
              <button type="button" onClick={() => handleKeyActivate(n)}>
                {n.type === 'metier' ? 'Métier' : 'Formation'} — {n.label}
                {n.meta ? ` (${n.meta})` : ''}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
