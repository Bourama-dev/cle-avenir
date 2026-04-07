import React from 'react';
import { Briefcase, Clock, Building2 } from 'lucide-react';

export const getJobIcon = (type, className = 'w-4 h-4') => {
  switch (type) {
    case 'contract': return <Briefcase className={className} />;
    case 'experience': return <Clock className={className} />;
    case 'sector': return <Building2 className={className} />;
    default: return <Briefcase className={className} />;
  }
};
