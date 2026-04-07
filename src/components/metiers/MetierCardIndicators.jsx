import React from 'react';

export const CircularProgress = ({ value = 0, size = 42, strokeWidth = 4 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#6366f1" strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className="rotate-90 fill-slate-700 text-xs font-medium" style={{transform:'rotate(90deg)',transformOrigin:'center'}}>
        {Math.round(value)}%
      </text>
    </svg>
  );
};

export const DifficultyStars = ({ difficulty }) => {
  const level = typeof difficulty === 'number' ? difficulty : 3;
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= level ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
      ))}
    </div>
  );
};

export const TrendIndicator = ({ trend }) => {
  const label = trend === 'up' ? '↗ En hausse' : trend === 'down' ? '↘ En baisse' : '→ Stable';
  const color = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500';
  return <span className={`text-xs font-medium ${color}`}>{label}</span>;
};
