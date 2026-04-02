import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartAnswerSuggestions = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100"
    >
      <div className="flex items-center gap-2 mb-3 text-violet-700 font-bold">
        <Sparkles className="w-4 h-4" />
        Suggestions Intelligentes
      </div>
      
      <div className="space-y-3">
        {suggestions.map((sugg, idx) => (
          <Card key={idx} className="p-3 hover:shadow-md transition-shadow cursor-pointer bg-white" onClick={() => onSelect(sugg.id)}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-800 text-sm">{sugg.text}</p>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className={`text-xs ${
                     sugg.score > 0.8 ? 'bg-green-50 text-green-700 border-green-200' : 
                     sugg.score > 0.5 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                     'bg-slate-50 text-slate-600'
                   }`}>
                      {Math.round(sugg.score * 100)}% Pertinence
                   </Badge>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Lightbulb className="w-4 h-4 text-violet-400" />
              </Button>
            </div>
            {/* Expandable Why section could go here */}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartAnswerSuggestions;