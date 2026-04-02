import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const CircularProgress = ({ value, size = 48, strokeWidth = 4, className }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  // Color coding based on score
  let color = "text-emerald-500";
  if (value < 70) color = "text-amber-500";
  if (value < 40) color = "text-rose-500";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", color)}
        />
      </svg>
      <span className={cn("absolute text-xs font-bold", color)}>{value}%</span>
    </div>
  );
};

export const DifficultyStars = ({ difficulty }) => {
  // Map difficulty string to 1-5 rating
  let rating = 3;
  let label = "Moyen";
  let color = "text-amber-400";
  
  const diffStr = (difficulty || '').toLowerCase();
  if (diffStr.includes('facile') || diffStr.includes('cap') || diffStr.includes('bep')) {
    rating = 1; label = "Accessible"; color = "text-emerald-400";
  } else if (diffStr.includes('difficile') || diffStr.includes('bac+5') || diffStr.includes('master')) {
    rating = 5; label = "Exigeant"; color = "text-rose-400";
  } else if (diffStr.includes('bac+3') || diffStr.includes('licence')) {
    rating = 4; label = "Avancé"; color = "text-orange-400";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={cn(
                  "w-3 h-3 transition-colors", 
                  star <= rating ? cn("fill-current", color) : "text-slate-200 fill-transparent"
                )} 
              />
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs font-medium">Niveau d'accès : {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const TrendIndicator = ({ trend }) => {
  const trendStr = (trend || '').toLowerCase();
  let Icon = Minus;
  let color = "text-slate-500";
  let label = "Stable";
  
  if (trendStr.includes('très') || trendStr.includes('forte') || trendStr.includes('croissance') || trendStr.includes('high')) {
    Icon = TrendingUp; color = "text-emerald-500"; label = "Forte demande";
  } else if (trendStr.includes('baisse') || trendStr.includes('déclin') || trendStr.includes('low')) {
    Icon = TrendingDown; color = "text-rose-500"; label = "En baisse";
  } else if (trendStr.includes('moyenne') || trendStr.includes('medium')) {
    Icon = TrendingUp; color = "text-amber-500"; label = "Demande modérée";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1 text-xs font-medium", color)}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Tendance du marché : {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};