import React from 'react';
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  FileText, 
  Building, 
  Zap, 
  Gift, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Globe,
  Clock,
  Target
} from 'lucide-react';

export const getJobIcon = (type, className = "w-4 h-4") => {
  const icons = {
    location: <MapPin className={className} />,
    salary: <DollarSign className={className} />,
    experience: <Briefcase className={className} />,
    contract: <FileText className={className} />,
    sector: <Building className={className} />,
    skills: <Zap className={className} />,
    benefits: <Gift className={className} />,
    applicants: <Users className={className} />,
    date: <Calendar className={className} />,
    status_active: <CheckCircle className={className} />,
    status_closing: <AlertCircle className={className} />,
    status_closed: <XCircle className={className} />,
    website: <Globe className={className} />,
    duration: <Clock className={className} />,
    goal: <Target className={className} />
  };

  return icons[type] || <Briefcase className={className} />;
};

export default getJobIcon;