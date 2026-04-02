import React, { createContext, useContext, useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DrillDownContext = createContext();

export const DrillDownProvider = ({ children }) => {
  const [history, setHistory] = useState([{ id: 'root', name: 'Vue Générale', component: null }]);

  const push = (id, name, component, props = {}) => {
    setHistory(prev => [...prev, { id, name, component, props }]);
  };

  const pop = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const reset = () => {
    setHistory([history[0]]);
  };

  return (
    <DrillDownContext.Provider value={{ history, push, pop, reset, current: history[history.length - 1] }}>
      {children}
    </DrillDownContext.Provider>
  );
};

export const useDrillDown = () => useContext(DrillDownContext);

export const DrillDownBreadcrumbs = () => {
  const { history, pop, reset } = useDrillDown();

  if (history.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={reset}>
        <Home className="h-4 w-4 text-slate-500" />
      </Button>
      {history.map((level, idx) => (
        <React.Fragment key={level.id}>
          {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
          <span className={idx === history.length - 1 ? "font-semibold text-slate-900" : "text-slate-500 cursor-pointer hover:underline"} onClick={() => {
             // simplified rollback
             if (idx === 0) reset();
          }}>
            {level.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};