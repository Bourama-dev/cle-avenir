import React from 'react';
import { cn } from '@/lib/utils';
import { Edit3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const PreviewToggle = ({ viewMode, setViewMode, className }) => {
  return (
    <div className={cn("flex md:hidden w-full bg-white border-b sticky top-0 z-40 p-2 shadow-sm", className)}>
      <div className="flex w-full bg-slate-100 p-1 rounded-xl relative">
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
          initial={false}
          animate={{
            x: viewMode === 'edit' ? 0 : '100%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        <button
          onClick={() => setViewMode('edit')}
          className={cn(
            "flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-medium rounded-lg z-10 transition-colors touch-target",
            viewMode === 'edit' ? "text-purple-700" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Edit3 className="w-4 h-4" /> Édition
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={cn(
            "flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-medium rounded-lg z-10 transition-colors touch-target",
            viewMode === 'preview' ? "text-purple-700" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Eye className="w-4 h-4" /> Aperçu
        </button>
      </div>
    </div>
  );
};

export default PreviewToggle;