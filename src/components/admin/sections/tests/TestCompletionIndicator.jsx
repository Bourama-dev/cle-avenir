import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TestCompletionIndicator = ({ status, score }) => {
  let icon;
  let colorClass;
  let label;

  if (status === 'completed' || (score !== undefined && score !== null)) {
    if (score >= 70) {
      icon = <CheckCircle2 className="h-5 w-5" />;
      colorClass = "text-green-500";
      label = "Test réussi (Haut score)";
    } else if (score >= 50) {
      icon = <CheckCircle2 className="h-5 w-5" />;
      colorClass = "text-yellow-500";
      label = "Test complété (Score moyen)";
    } else {
      icon = <CheckCircle2 className="h-5 w-5" />;
      colorClass = "text-orange-500";
      label = "Test complété (Score faible)";
    }
  } else if (status === 'in_progress') {
    icon = <Clock className="h-5 w-5" />;
    colorClass = "text-blue-500";
    label = "En cours";
  } else {
    icon = <AlertCircle className="h-5 w-5" />;
    colorClass = "text-slate-300";
    label = "Incomplet ou inconnu";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${colorClass} hover:scale-110 transition-transform cursor-help`}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TestCompletionIndicator;