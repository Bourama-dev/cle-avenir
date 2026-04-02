import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const mockActivityData = [
  { name: 'Lun', logins: 4 },
  { name: 'Mar', logins: 12 },
  { name: 'Mer', logins: 8 },
  { name: 'Jeu', logins: 15 },
  { name: 'Ven', logins: 10 },
  { name: 'Sam', logins: 2 },
  { name: 'Dim', logins: 1 },
];

const mockFormationData = [
  { name: 'Licence', value: 45 },
  { name: 'Master', value: 30 },
  { name: 'BTS', value: 15 },
  { name: 'Autre', value: 10 },
];

const mockGrowthData = [
  { month: 'Jan', students: 10 },
  { month: 'Fev', students: 25 },
  { month: 'Mar', students: 40 },
  { month: 'Avr', students: 55 },
  { month: 'Mai', students: 80 },
  { month: 'Juin', students: 120 },
];

const EstablishmentCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-700">Activité de Connexion (Semaine)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="logins" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-700">Croissance des Inscriptions</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockGrowthData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Area type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-white lg:col-span-2">
         <div className="grid grid-cols-1 md:grid-cols-3">
             <div className="col-span-2 p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-6">Répartition par Niveau</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={mockFormationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {mockFormationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
             </div>
             <div className="border-l border-slate-100 p-6 flex flex-col justify-center gap-4 bg-slate-50/50">
                 <div className="text-center">
                     <p className="text-sm text-slate-500 mb-1">Total Formations</p>
                     <p className="text-3xl font-bold text-slate-800">12</p>
                 </div>
                 <div className="text-center">
                     <p className="text-sm text-slate-500 mb-1">Niveau Principal</p>
                     <p className="text-xl font-bold text-purple-600">Licence</p>
                 </div>
             </div>
         </div>
      </Card>
    </div>
  );
};

export default EstablishmentCharts;