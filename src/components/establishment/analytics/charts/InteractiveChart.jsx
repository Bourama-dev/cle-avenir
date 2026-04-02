import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const InteractiveChart = ({ 
  data, 
  type = 'bar', 
  title, 
  dataKeys = [], 
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300
}) => {
  const { toast } = useToast();

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      toast({
        title: "Détails",
        description: `Valeur: ${data.activePayload[0].value}`,
      });
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      onClick: handleChartClick,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
          <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
          {dataKeys.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
          ))}
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
        <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
        {dataKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={50} />
        ))}
      </BarChart>
    );
  };

  return (
    <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
      {title && <CardHeader className="pb-2"><CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle></CardHeader>}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};