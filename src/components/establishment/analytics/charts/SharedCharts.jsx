import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const LevelComparisonChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="level" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="avgScore" fill="#3b82f6" name="Score Moyen" />
      <Bar dataKey="successRate" fill="#10b981" name="Taux Réussite" />
    </BarChart>
  </ResponsiveContainer>
);

export const EvolutionChart = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      {lines.map((key, i) => (
        <Line type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} key={key} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export const ProfileDistributionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
        {data?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const ComparisonSideBySideChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="metric" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="entityA" fill="#8884d8" />
      <Bar dataKey="entityB" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);