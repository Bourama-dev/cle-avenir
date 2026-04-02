import React from 'react';
import { Euro, Briefcase, GraduationCap, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatSalary } from '@/utils/jobFormatters';

const SummaryItem = ({ icon: Icon, label, value, colorClass = "text-slate-500" }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-rose-100 transition-all duration-300">
      <div className={`p-2.5 rounded-lg bg-white shadow-sm border border-slate-100 mr-4 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-semibold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
};

const JobDetailSummary = ({ job }) => {
  return (
    <Card className="border-none shadow-lg shadow-slate-200/50 overflow-hidden bg-white rounded-2xl mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryItem 
            icon={Briefcase} 
            label="Type de contrat" 
            value={job.contract_type} 
            colorClass="text-purple-600 bg-purple-50"
          />
          <SummaryItem 
            icon={Euro} 
            label="Salaire" 
            value={formatSalary(job.salary_range)} 
            colorClass="text-green-600 bg-green-50"
          />
          <SummaryItem 
            icon={MapPin} 
            label="Localisation" 
            value={job.location} 
            colorClass="text-rose-600 bg-rose-50"
          />
          <SummaryItem 
            icon={Clock} 
            label="Expérience" 
            value={job.experience} 
            colorClass="text-blue-600 bg-blue-50"
          />
          {job.education && (
             <SummaryItem 
               icon={GraduationCap} 
               label="Niveau d'études" 
               value={job.education} 
               colorClass="text-indigo-600 bg-indigo-50"
             />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailSummary;