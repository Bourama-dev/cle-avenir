import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobDetailCompanyInfo = ({ job }) => {
  if (!job.company) return null;

  return (
    <Card className="border border-slate-200 shadow-md rounded-2xl overflow-hidden sticky top-24">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
          <Building className="w-5 h-5 mr-2 text-slate-400" />
          Entreprise
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain" />
            ) : (
              <span className="text-2xl font-bold text-slate-300">{job.company.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{job.company}</h3>
            {job.location && (
              <div className="flex items-center text-slate-500 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1" /> {job.location}
              </div>
            )}
          </div>
        </div>

        {job.company_description && (
          <div className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            {job.company_description}
          </div>
        )}

        {/* Since we might not have a dedicated company website URL in the job object often, 
            we usually just rely on the job URL or generic info. 
            If website exists in job data, show it. */}
        {job.company_website && (
           <Button variant="outline" className="w-full justify-between" onClick={() => window.open(job.company_website, '_blank')}>
             Visiter le site web <Globe className="w-4 h-4 ml-2" />
           </Button>
        )}
        
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
           <p className="text-xs font-medium text-blue-800 mb-2">Pourquoi nous rejoindre ?</p>
           <ul className="space-y-2">
              <li className="flex items-start text-sm text-blue-700">
                 <span className="mr-2">•</span> Environnement innovant
              </li>
              <li className="flex items-start text-sm text-blue-700">
                 <span className="mr-2">•</span> Opportunités de carrière
              </li>
           </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailCompanyInfo;