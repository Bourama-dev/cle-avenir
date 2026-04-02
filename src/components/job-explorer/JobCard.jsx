import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building, Clock, Ruler, ChevronDown, ChevronUp, ExternalLink, Briefcase, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContractBadge, ExperienceBadge } from './JobBadges';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isValidUUID } from '@/lib/utils';

const JobCard = ({ job, isSaved, onToggleSave, onClick, onViewOffer }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback for logo
  const logoLetter = job.company ? job.company.charAt(0).toUpperCase() : 'E';
  
  // Format date relative (e.g., "il y a 2 jours")
  const timeAgo = job.published_at 
    ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: fr })
    : 'Récemment';

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    // Ensure we have a valid ID or at least a string ID before navigating
    if (job.id) {
        onViewOffer && onViewOffer();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card 
        className="h-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden cursor-pointer group flex flex-col"
        onClick={onClick}
      >
        <CardContent className="p-5 flex-grow">
          <div className="flex items-start gap-4">
            {/* Logo Section */}
            <div className="w-14 h-14 rounded-lg border border-slate-100 bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.company_logo ? (
                <img 
                  src={job.company_logo} 
                  alt={job.company} 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-xl" style={{ display: job.company_logo ? 'none' : 'flex' }}>
                {logoLetter}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-tight mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 font-medium">
                    <Building className="w-3.5 h-3.5 mr-1.5" />
                    <span className="truncate">{job.company}</span>
                  </div>
                </div>
              </div>

              {/* Badges Row - Enhanced display as requested */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Location Badge */}
                {job.location && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 font-normal px-2.5 py-1">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {job.location}
                  </Badge>
                )}
                
                {/* Distance Badge (Orange as requested) */}
                {job.distanceToUser !== undefined && job.distanceToUser !== null && (
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200 font-medium px-2.5 py-1">
                    <Ruler className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                    {job.distanceToUser} km
                  </Badge>
                )}

                {/* Contract Type & Duration */}
                {(job.contract_type || job.contract_duration) && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 font-normal px-2.5 py-1">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {job.contract_type} {job.contract_duration ? `- ${job.contract_duration}` : ''}
                  </Badge>
                )}

                {/* Experience Level */}
                {job.experience_level && (
                   <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 font-normal px-2.5 py-1">
                     <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                     {job.experience_level}
                   </Badge>
                )}
              </div>

              {/* Description Preview */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                      {job.description || "Aucune description disponible."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        {/* Footer Action Row */}
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {timeAgo}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs font-medium text-slate-600 hover:text-slate-900"
              onClick={handleToggleExpand}
            >
              {isExpanded ? (
                <>Moins <ChevronUp className="w-3 h-3 ml-1" /></>
              ) : (
                <>Détails <ChevronDown className="w-3 h-3 ml-1" /></>
              )}
            </Button>
            
            <Button 
              size="sm" 
              className="h-8 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 gap-1.5"
              onClick={handleViewClick}
            >
              Voir l'offre <ExternalLink className="w-3 h-3 opacity-90" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCard;