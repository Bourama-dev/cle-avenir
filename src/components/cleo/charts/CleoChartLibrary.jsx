import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, PolarGrid, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============ SKILLS RADAR CHART ============
export const SkillsRadarChart = ({ data = [], title = "Compétences requises" }) => {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <Card className="w-full border-blue-100 bg-gradient-to-br from-blue-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Radar name="Niveau requis" dataKey="required" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Radar name="Votre niveau" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============ SALARY COMPARISON CHART ============
export const SalaryComparisonChart = ({ data = [], title = "Comparaison des salaires" }) => {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <Card className="w-full border-emerald-100 bg-gradient-to-br from-emerald-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              formatter={(value) => `${value}k€`}
            />
            <Legend />
            <Bar dataKey="min" fill="#3b82f6" name="Salaire minimum" />
            <Bar dataKey="avg" fill="#10b981" name="Salaire moyen" />
            <Bar dataKey="max" fill="#f59e0b" name="Salaire maximum" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============ JOB MARKET TRENDS ============
export const JobMarketTrends = ({ data = [], title = "Tendances du marché" }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="w-full border-violet-100 bg-gradient-to-br from-violet-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <Area
              type="monotone"
              dataKey="offers"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorOffers)"
              name="Offres d'emploi"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============ SKILLS DISTRIBUTION PIE ============
export const SkillsDistributionPie = ({ data = [], title = "Distribution des compétences" }) => {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <Card className="w-full border-orange-100 bg-gradient-to-br from-orange-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-orange-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============ CAREER PROGRESSION TIMELINE ============
export const CareerProgressionChart = ({ data = [], title = "Progression de carrière" }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="w-full border-rose-100 bg-gradient-to-br from-rose-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-rose-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="salary"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
              name="Salaire (k€)"
            />
            <Line
              type="monotone"
              dataKey="seniority"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Niveau de séniorité"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============ EDUCATION REQUIREMENTS ============
export const EducationRequirements = ({ data = [], title = "Formations recommandées" }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="w-full border-indigo-100 bg-gradient-to-br from-indigo-50 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">{item.duration}</p>
                {item.skills && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.skills.map((skill, i) => (
                      <span key={i} className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============ SUMMARY STATS CARDS ============
export const StatsGrid = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {stats.map((stat, idx) => (
        <Card key={idx} className={cn(
          "border",
          stat.trend === 'up' ? 'border-green-100 bg-green-50' :
          stat.trend === 'down' ? 'border-red-100 bg-red-50' :
          'border-slate-100 bg-slate-50'
        )}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">{stat.label}</p>
              {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
              {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            {stat.subtitle && <p className="text-xs text-slate-600 mt-1">{stat.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
