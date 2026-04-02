import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProfileSnapshot = ({ snapshot }) => {
  if (!snapshot || !snapshot.topSectors || snapshot.topSectors.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sticky top-24"
    >
      <div className="flex items-center gap-2 mb-4 text-violet-700 font-bold text-sm uppercase tracking-wide border-b border-slate-50 pb-2">
        <Activity className="w-4 h-4" />
        Profil en direct
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 mb-2 font-medium">Secteurs dominants</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {snapshot.topSectors.map((s, idx) => (
                <motion.div
                  key={s.sector}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                >
                  <Badge 
                    variant="secondary" 
                    className={`
                      ${idx === 0 ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' : 'bg-slate-100 text-slate-600'}
                    `}
                  >
                    {s.sector}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Placeholder for values/style if available */}
        <div className="pt-2 border-t border-slate-50">
             <div className="flex items-center gap-1 text-xs text-slate-400">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Analyse en cours...</span>
             </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSnapshot;