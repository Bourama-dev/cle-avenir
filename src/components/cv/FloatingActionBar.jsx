import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionBar = ({ onSave, onDownload, saving, isVisible = true }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50 pb-safe"
        >
          <div className="flex items-center gap-3 p-4">
            <Button 
              onClick={onSave} 
              disabled={saving} 
              variant="outline" 
              className="flex-1 h-12 rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 touch-target"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {saving ? 'Enregistrement' : 'Sauvegarder'}
            </Button>
            <Button 
              onClick={onDownload} 
              className="flex-1 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white touch-target"
            >
              <Download className="w-5 h-5 mr-2" /> 
              PDF
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionBar;