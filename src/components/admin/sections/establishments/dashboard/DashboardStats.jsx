import React from 'react';
import { Users, BookOpen, Link as LinkIcon, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="est-card">
    <div className="flex items-start justify-between">
      <div>
        <div className="est-card-title">{title}</div>
        <div className="est-stat-value">{value}</div>
      </div>
      <div className={`p-3 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  // Task 3: Add defensive checks for undefined data props
  const safeStats = stats || {};

  return (
    <div className="est-stats-grid">
      <StatCard 
        title="Étudiants Inscrits" 
        value={safeStats.studentCount || 0} 
        icon={Users} 
        colorClass="text-indigo"
        bgClass="bg-indigo-light"
      />
      <StatCard 
        title="Formations" 
        value={safeStats.formationCount || 0} 
        icon={BookOpen} 
        colorClass="text-purple"
        bgClass="bg-purple-light"
      />
      <StatCard 
        title="Connexions (30j)" 
        value={safeStats.connectionCount || 0} 
        icon={LinkIcon} 
        colorClass="text-amber"
        bgClass="bg-amber-light"
      />
      <StatCard 
        title="Taux d'Activité" 
        value={`${safeStats.activityRate || 0}%`} 
        icon={Activity} 
        colorClass="text-pink"
        bgClass="bg-pink-light"
      />
    </div>
  );
};

export default DashboardStats;