import React, { useEffect, useState } from 'react';
import { Building2, Briefcase } from 'lucide-react';
import { getFeaturedEmployers, getEmployerLogo } from '@/lib/employerSummary';

const departmentOf = (zipcode) => {
  const z = String(zipcode ?? '');
  if (!/^\d{5}$/.test(z)) return null;
  if (z.startsWith('97') || z.startsWith('98')) return z.slice(0, 3);
  if (z.startsWith('20')) return z < '20200' ? '2A' : '2B';
  return z.slice(0, 2);
};

const EmployerTile = ({ employer }) => {
  const [logo, setLogo] = useState(null);
  useEffect(() => {
    let alive = true;
    if (employer.has_logo && employer.id_rce) {
      getEmployerLogo(employer.id_rce, employer.logo_type).then((u) => alive && setLogo(u));
    }
    return () => { alive = false; };
  }, [employer.id_rce, employer.has_logo, employer.logo_type]);

  return (
    <div className="snap-start shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 flex gap-3">
      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
        {logo ? <img src={logo} alt="" className="w-full h-full object-contain" /> : <Building2 className="w-5 h-5 text-slate-300" />}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{employer.name}</p>
        {employer.tagline && <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{employer.tagline}</p>}
        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
          <Briefcase className="w-3 h-3" />
          {employer.offers_count} offre{employer.offers_count > 1 ? 's' : ''} en cours
        </p>
      </div>
    </div>
  );
};

// "Employeurs qui recrutent" strip: employers with an active France Travail page
// and several open offers, near the selected location (nationwide otherwise).
const FeaturedEmployers = ({ location }) => {
  const [employers, setEmployers] = useState([]);
  const where = departmentOf(location?.zipcode);

  useEffect(() => {
    let alive = true;
    getFeaturedEmployers({ where: where ?? undefined, limit: 8 }).then((list) => alive && setEmployers(list));
    return () => { alive = false; };
  }, [where]);

  if (!employers.length) return null;

  return (
    <section className="mb-5" aria-label="Employeurs qui recrutent">
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
        Employeurs qui recrutent{where ? ' près de chez vous' : ''}
      </h2>
      <div className="snap-feed flex gap-3 overflow-x-auto -mx-4 px-4 pb-1">
        {employers.map((e) => <EmployerTile key={e.siren ?? e.name} employer={e} />)}
      </div>
    </section>
  );
};

export default FeaturedEmployers;
