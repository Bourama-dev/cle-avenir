import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Timeline = ({ data }) => {
  return (
    <div className="relative pl-4 border-l-2 border-slate-100 my-3 space-y-4">
      {data.events.map((event, idx) => {
        const isCompleted = event.status === 'completed';
        const isActive = event.status === 'active';
        
        return (
          <div key={idx} className="relative">
            <div className={cn(
              "absolute -left-[21px] top-0 bg-white rounded-full p-0.5 border-2",
              isCompleted ? "border-green-500 text-green-500" : 
              isActive ? "border-indigo-500 text-indigo-500" : "border-slate-300 text-slate-300"
            )}>
              {isCompleted ? <CheckCircle2 size={12} className="fill-green-100" /> : 
               isActive ? <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" /> : 
               <Circle size={12} />}
            </div>
            
            <div className={cn("flex flex-col", isActive ? "opacity-100" : "opacity-80")}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {event.date}
              </span>
              <span className={cn("text-sm font-medium", isActive ? "text-indigo-700 font-bold" : "text-slate-700")}>
                {event.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;