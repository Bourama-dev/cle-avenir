import React, { useState, useEffect } from 'react';
import { X, Bot, Sliders, Zap, User, Volume2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PREFS_KEY = 'cleo_preferences';

export const DEFAULT_PREFERENCES = {
  defaultMode: 'career_advisor',
  responseStyle: 'balanced',   // 'concise' | 'balanced' | 'detailed'
  autoProfileUpdate: true,
  ttsAutoPlay: true,
  language: 'fr',
};

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : { ...DEFAULT_PREFERENCES };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

// ── Sub-components ─────────────────────────────────────────────────────────

const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="h-4 w-4 text-violet-500" />
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
  </div>
);

const OptionCard = ({ value, current, onChange, label, description, icon }) => (
  <button
    onClick={() => onChange(value)}
    className={cn(
      'w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3',
      current === value
        ? 'border-violet-500 bg-violet-50 shadow-sm'
        : 'border-slate-200 hover:border-slate-300 bg-white'
    )}
  >
    <span className="text-xl mt-0.5">{icon}</span>
    <div>
      <p className={cn('text-sm font-semibold', current === value ? 'text-violet-900' : 'text-slate-700')}>
        {label}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
    {current === value && (
      <span className="ml-auto shrink-0 mt-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
      </span>
    )}
  </button>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

// ── Main Modal ─────────────────────────────────────────────────────────────

const CleoPreferencesModal = ({ isOpen, onClose }) => {
  const [prefs, setPrefs] = useState(loadPreferences);
  const [saved, setSaved] = useState(false);

  // Reset to saved prefs when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrefs(loadPreferences());
      setSaved(false);
    }
  }, [isOpen]);

  const update = (key, value) => setPrefs(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFERENCES });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Préférences IA</h2>
                  <p className="text-xs text-indigo-200">Personnalise le comportement de Cléo</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

              {/* Default Mode */}
              <div>
                <SectionTitle icon={Bot} label="Mode par défaut" />
                <div className="space-y-2">
                  <OptionCard
                    value="career_advisor"
                    current={prefs.defaultMode}
                    onChange={v => update('defaultMode', v)}
                    icon="🎯"
                    label="Coach Carrière"
                    description="Orientation, stratégies, marché de l'emploi"
                  />
                  <OptionCard
                    value="learning_coach"
                    current={prefs.defaultMode}
                    onChange={v => update('defaultMode', v)}
                    icon="📚"
                    label="Coach Apprentissage"
                    description="Révisions, concepts, exercices pédagogiques"
                  />
                  <OptionCard
                    value="interview_coach"
                    current={prefs.defaultMode}
                    onChange={v => update('defaultMode', v)}
                    icon="💼"
                    label="Coach Entretien"
                    description="Simulations d'entretien avec feedback réaliste"
                  />
                </div>
              </div>

              {/* Response Style */}
              <div>
                <SectionTitle icon={Zap} label="Style de réponse" />
                <div className="space-y-2">
                  <OptionCard
                    value="concise"
                    current={prefs.responseStyle}
                    onChange={v => update('responseStyle', v)}
                    icon="⚡"
                    label="Concis"
                    description="Réponses courtes et directes, max 80 mots"
                  />
                  <OptionCard
                    value="balanced"
                    current={prefs.responseStyle}
                    onChange={v => update('responseStyle', v)}
                    icon="⚖️"
                    label="Équilibré"
                    description="Réponses claires avec contexte, max 150 mots"
                  />
                  <OptionCard
                    value="detailed"
                    current={prefs.responseStyle}
                    onChange={v => update('responseStyle', v)}
                    icon="📖"
                    label="Détaillé"
                    description="Réponses complètes avec exemples, max 300 mots"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div>
                <SectionTitle icon={User} label="Fonctionnalités" />
                <div className="bg-slate-50 rounded-xl px-4 divide-y divide-slate-100">
                  <ToggleRow
                    label="Mise à jour profil automatique"
                    description="Cléo enrichit ton profil quand tu mentionnes des infos"
                    checked={prefs.autoProfileUpdate}
                    onChange={v => update('autoProfileUpdate', v)}
                  />
                  <ToggleRow
                    label="Synthèse vocale automatique"
                    description="Lis les réponses de Cléo à voix haute"
                    checked={prefs.ttsAutoPlay}
                    onChange={v => update('ttsAutoPlay', v)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Réinitialiser
              </button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="h-9">
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className={cn(
                    'h-9 min-w-[90px] transition-all',
                    saved
                      ? 'bg-emerald-500 hover:bg-emerald-500 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  )}
                >
                  {saved ? '✓ Enregistré' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CleoPreferencesModal;
