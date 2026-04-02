import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SectionManager = ({ items, onAdd, onRemove, renderItem, itemName = "Élément" }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 pt-10"
          >
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-8 h-8 rounded-lg opacity-80 hover:opacity-100"
              onClick={() => onRemove(index)}
              title={`Supprimer ${itemName}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
      
      <Button 
        type="button"
        variant="outline" 
        onClick={onAdd}
        className="w-full border-dashed border-2 h-14 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200 touch-target"
      >
        <Plus className="w-5 h-5 mr-2" /> Ajouter un(e) {itemName}
      </Button>
    </div>
  );
};

export default SectionManager;