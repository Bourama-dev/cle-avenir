import React, { useState, useEffect } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Play, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sortable Item Component
const SortableItem = ({ activity, onStart }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn("mb-3", isDragging && "opacity-50")}>
      <Card className={cn(
        "group p-3 flex items-center gap-3 border-slate-200 hover:border-violet-300 hover:shadow-md transition-all bg-white",
        activity.status === 'completed' && "bg-slate-50 opacity-80"
      )}>
        {/* Drag Handle */}
        <div {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500 p-1">
          <GripVertical size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <Badge variant="outline" className={cn(
               "text-[10px] h-5 px-1.5 border-0",
               activity.type === 'simulation' ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
             )}>
                {activity.type}
             </Badge>
             {activity.status === 'completed' && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <h4 className="font-semibold text-sm text-slate-800 truncate">{activity.title}</h4>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
             <span className="flex items-center gap-1"><Clock size={10} /> {activity.duration_minutes} min</span>
             <span>•</span>
             <span>{activity.xp_reward} XP</span>
          </div>
        </div>

        {/* Action */}
        {activity.status !== 'completed' && (
           <Button 
             size="sm" 
             onClick={() => onStart(activity)}
             className="h-8 w-8 p-0 rounded-full bg-slate-100 text-slate-600 hover:bg-violet-600 hover:text-white"
           >
              <Play size={12} className="ml-0.5" />
           </Button>
        )}
      </Card>
      
      {/* Connector Line visual trick */}
      <div className="absolute left-6 -bottom-4 w-0.5 h-4 bg-slate-200 -z-10 group-last:hidden"></div>
    </div>
  );
};

const LearningRoadmap = ({ activities, onStart }) => {
  // Local state for sorting
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (activities.length > 0) {
      // Sort logic: In-progress/Available first, Completed last.
      // But allow user to override via DnD.
      const sorted = [...activities].sort((a, b) => {
         if (a.status === 'completed' && b.status !== 'completed') return 1;
         if (a.status !== 'completed' && b.status === 'completed') return -1;
         return 0;
      });
      setItems(sorted);
    }
  }, [activities]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="py-2 px-1">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-violet-200">
            1
         </div>
         <div>
            <h3 className="font-bold text-slate-800">Votre Parcours d'Apprentissage</h3>
            <p className="text-xs text-slate-500">Organisez vos priorités par glisser-déposer</p>
         </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative pl-2 pb-10">
            {/* Timeline Vertical Line Background */}
            <div className="absolute left-8 top-2 bottom-0 w-0.5 bg-slate-100 -z-10"></div>
            
            {items.map((activity) => (
              <SortableItem key={activity.id} activity={activity} onStart={onStart} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
         <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
            Aucune activité planifiée.
         </div>
      )}
    </div>
  );
};

export default LearningRoadmap;