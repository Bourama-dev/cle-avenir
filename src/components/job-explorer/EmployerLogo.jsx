import React, { useEffect, useState } from 'react';
import { getEmployer, getEmployerLogo } from '@/lib/employerSummary';

// Company logo from the France Travail employer page, looked up by SIRET.
// Renders `fallback` (icon/initial) until a real logo is available or when there is none.
const EmployerLogo = ({ siret, name, fallback = null, className = '' }) => {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    let alive = true;
    setLogo(null);
    getEmployer(siret).then((e) => {
      if (!alive || !e?.id_rce) return;
      getEmployerLogo(e.id_rce, e.logo_type).then((url) => alive && setLogo(url));
    });
    return () => { alive = false; };
  }, [siret]);

  if (!logo) return fallback;
  return <img src={logo} alt={name ? `Logo ${name}` : ''} className={`w-full h-full object-contain ${className}`} loading="lazy" />;
};

export default EmployerLogo;
