import React, { useEffect, useState } from 'react';
import { Building2, Briefcase } from 'lucide-react';
import { getEmployer, getEmployerLogo } from '@/lib/employerSummary';

// Small employer strip shown under a card when the company has a France Travail
// employer page (logo, tagline, number of open offers). Renders nothing otherwise.
const EmployerInfo = ({ siret, className = '' }) => {
  const [employer, setEmployer] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    let alive = true;
    setEmployer(null);
    setLogo(null);
    getEmployer(siret).then((e) => {
      if (!alive || !e) return;
      setEmployer(e);
      if (e.id_rce) {
        getEmployerLogo(e.id_rce, e.logo_type).then((url) => alive && setLogo(url));
      }
    });
    return () => { alive = false; };
  }, [siret]);

  if (!employer) return null;

  return (
    <div className={`flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 px-3 py-2 ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
        {logo
          ? <img src={logo} alt="" className="w-full h-full object-contain" />
          : <Building2 className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="min-w-0 flex-1">
        {employer.tagline && (
          <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">« {employer.tagline} »</p>
        )}
        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <Briefcase className="w-3 h-3" />
          {employer.offers_count > 0
            ? `${employer.offers_count} offre${employer.offers_count > 1 ? 's' : ''} en cours · Page employeur France Travail`
            : 'Page employeur France Travail'}
        </p>
      </div>
    </div>
  );
};

export default EmployerInfo;
