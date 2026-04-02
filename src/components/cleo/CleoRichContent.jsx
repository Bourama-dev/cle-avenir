import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const COLORS = ['#8b5cf6', '#d946ef', '#0ea5e9', '#10b981', '#f59e0b'];

export const CleoChart = ({ data }) => {
  if (!data || !data.data) return null;

  const renderChart = () => {
    switch (data.type) {
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <RechartsTooltip />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        );
      case 'radar':
        return (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar name="Compétences" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <RechartsTooltip />
            </RadarChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full my-4 border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 py-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-700">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const CleoActionPlan = ({ data, onStart }) => {
  if (!data || !data.steps) return null;

  return (
    <Card className="w-full my-4 border-violet-100 shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-white py-4 border-b border-violet-100">
        <CardTitle className="text-base font-bold text-violet-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {data.steps.map((step, index) => (
            <div key={index} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
              <div className="mt-1">
                <Circle className="h-4 w-4 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800 font-medium">{step.text}</p>
                {step.deadline_days && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Dans {step.deadline_days} jours</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <Button onClick={onStart} className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm h-9">
            Commencer ce plan <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};