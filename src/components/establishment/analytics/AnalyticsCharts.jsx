import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const ResultsLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

export const ProfilePieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const SkillsRadarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar name="Classe" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
      <Radar name="Moyenne" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
      <Legend />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>
);

export const ComparisonBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="current" fill="#8b5cf6" name="Période actuelle" radius={[4, 4, 0, 0]} />
      <Bar dataKey="previous" fill="#cbd5e1" name="Période précédente" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);