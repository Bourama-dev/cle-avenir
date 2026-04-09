import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Sparkles } from 'lucide-react';

export default function HeroScene3D() {
  useEffect(() => {
    if (document.querySelector('script[data-spline-viewer]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.80/build/spline-viewer.js';
    script.setAttribute('data-spline-viewer', '');
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '520px' }}>
      {/* Scène Spline */}
      <spline-viewer
        loading-anim-type="spinner-big-light"
        url="https://prod.spline.design/mfXXkr2lJo4oVp6n/scene.splinecode"
        style={{ width: '100%', height: '100%', minHeight: '520px', display: 'block' }}
      />

      {/* Labels UI flottants */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute left-0 top-1/4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-violet-100 z-20 max-w-[180px] pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 bg-violet-100 rounded-lg text-violet-600"><Target size={16} /></div>
          <span className="font-bold text-slate-800 text-sm">Profil détecté</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-rose-500 w-[92%]" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1 }}
        className="absolute right-0 bottom-1/3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-cyan-100 z-20 pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600"><Zap size={16} /></div>
          <div>
            <div className="font-bold text-slate-800 text-sm">+250 XP</div>
            <div className="text-xs text-slate-500">Activité complétée</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
        className="absolute right-6 top-1/4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-amber-100 z-20 pointer-events-none"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">Niveau 3 atteint !</span>
        </div>
      </motion.div>
    </div>
  );
}
