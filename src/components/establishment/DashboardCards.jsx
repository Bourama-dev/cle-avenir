import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-slate-500"
  };

  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl", colors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <p className={cn("text-xs flex items-center mt-1 font-medium", trendColors[trend])}>
            <TrendIcon className="mr-1 h-3 w-3" />
            {trendValue}
            <span className="text-slate-400 ml-1 font-normal">vs mois dernier</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;