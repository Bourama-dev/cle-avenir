import React, { useState, useEffect } from 'react';
import { CheckCircle2, Play, Clock, Star, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TYPE_ICON = {
  'Cours interactif':    '📖',
  'Réflexion guidée':   '💭',
  'Simulation entretien':'🎭',
  'Quiz':               '🧩',
  'Flashcards':         '🃏',
  'Workshop':           '🛠️',
  'Challenge':          '⚡',
};

const STATUS_NODE = {
  completed: { ring: 'bg-green-500 border-green-300',   text: 'text-white' },
  started:   { ring: 'bg-violet-500 border-violet-200', text: 'text-white' },
  available: { ring: 'bg-white border-slate-300',        text: 'text-slate-500' },
  locked:    { ring: 'bg-slate-100 border-slate-200',    text: 'text-slate-300' },
};

function getStatus(activity, index, items) {
  if (activity.status === 'completed') return 'completed';
  if (activity.status === 'started')   return 'started';
  // First non-completed is available, rest are locked
  const firstIncomplete = items.findIndex(a => a.status !== 'completed');
  return index === firstIncomplete ? 'available' : 'locked';
}

const RoadmapNode = ({ activity, index, total, onStart, status }) => {
  const isLast      = index === total - 1;
  const isCompleted = status === 'completed';
  const isStarted   = status === 'started';
  const isLocked    = status === 'locked';
  const nodeStyle   = STATUS_NODE[status] ?? STATUS_NODE.available;

  return (
    <div className="flex gap-0">
      {/* ── Left column: node + connector ── */}
      <div className="flex flex-col items-center w-14 shrink-0">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.07 }}
          className={cn(
            'w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm shadow-md shrink-0 z-10',
            nodeStyle.ring, nodeStyle.text,
            isStarted && 'ring-4 ring-violet-200 ring-offset-1',
          )}
        >
          {isCompleted ? (
            <CheckCircle2 size={22} />
          ) : isLocked ? (
            <Lock size={16} className="text-slate-300" />
          ) : (
            <span>{index + 1}</span>
          )}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div className={cn(
            'w-0.5 flex-1 min-h-[32px] rounded-full',
            isCompleted ? 'bg-green-300' : 'bg-slate-200',
          )} />
        )}
      </div>

      {/* ── Right column: card ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07 + 0.05 }}
        className={cn(
          'flex-1 mb-4 ml-3',
          isLast ? 'mb-0' : '',
        )}
      >
        <div className={cn(
          'group bg-white rounded-2xl border-2 p-4 transition-all',
          isCompleted ? 'border-green-200 bg-green-50/30' :
          isStarted   ? 'border-violet-300 shadow-md shadow-violet-100' :
          isLocked    ? 'border-slate-100 opacity-60' :
          'border-slate-200 hover:border-violet-300 hover:shadow-md cursor-pointer',
        )}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">
              {TYPE_ICON[activity.type] ?? '📖'}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <Badge variant="outline" className={cn(
                  'text-[9px] font-bold border-0 px-1.5',
                  isCompleted ? 'bg-green-100 text-green-700' :
                  isStarted   ? 'bg-violet-100 text-violet-700' :
                  'bg-slate-100 text-slate-500',
                )}>
                  {activity.type}
                </Badge>
                {isStarted && (
                  <Badge className="text-[9px] bg-violet-100 text-violet-700 border-0 px-1.5">
                    En cours
                  </Badge>
                )}
              </div>

              <h4 className="font-bold text-sm text-slate-800 leading-tight mb-2">
                {activity.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {activity.duration_minutes} min
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={10} fill="currentColor" /> {activity.xp_reward} XP
                </span>
              </div>
            </div>

            <div className="shrink-0 ml-1">
              {isCompleted ? (
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
              ) : isLocked ? (
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock size={14} className="text-slate-300" />
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onStart(activity)}
                  className={cn(
                    'w-9 h-9 p-0 rounded-full transition-all',
                    isStarted
                      ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200'
                      : 'bg-slate-900 hover:bg-violet-600 text-white',
                  )}
                >
                  <Play size={13} className="ml-0.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LearningRoadmap = ({ activities, onStart }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Completed first to show progression, then by natural order
    const sorted = [...activities].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      return 0;
    });
    setItems(sorted);
  }, [activities]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-2xl">
        <Zap size={32} className="mx-auto mb-3 text-slate-200" />
        Aucune activité planifiée pour le moment.
      </div>
    );
  }

  const completed = items.filter(a => a.status === 'completed').length;
  const progressPct = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="py-2">
      {/* Progress banner */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-violet-900">Progression du parcours</span>
          <span className="text-sm font-bold text-violet-700">{completed}/{items.length}</span>
        </div>
        <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-violet-600 mt-1.5 font-medium">{progressPct}% complété</p>
      </div>

      {/* Path */}
      <div className="pl-1 pr-2">
        {items.map((activity, index) => (
          <RoadmapNode
            key={activity.id}
            activity={activity}
            index={index}
            total={items.length}
            onStart={onStart}
            status={getStatus(activity, index, items)}
          />
        ))}
      </div>
    </div>
  );
};

export default LearningRoadmap;
