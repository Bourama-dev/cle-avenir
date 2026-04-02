import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, Calendar, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPublicationDate, formatContractType, getContractColor } from '@/utils/jobFormatters';
import { cn } from '@/lib/utils';

const JobDetailHero = ({ job, isSaved, onToggleSave, onShare, saveLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200 pt-8 pb-12 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="pl-0 text-slate-500 hover:text-rose-600 hover:bg-transparent transition-colors group" 
            onClick={() => navigate('/offres-emploi')}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Retour aux offres
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1 space-y-6">
            {/* Badges Row */}
            <div className="flex flex-wrap gap-3">
              <Badge className={cn("px-3 py-1 font-medium", getContractColor(job.contract_type))}>
                {formatContractType(job.contract_type)}
              </Badge>
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 px-3 py-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                {job.location}
              </Badge>
              <span className="text-sm text-slate-500 flex items-center bg-white/50 px-2 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Publiée {formatPublicationDate(job.published_at)}
              </span>
            </div>

            {/* Title & Company */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {job.title}
              </h1>
              <div className="flex items-center gap-4 text-lg text-slate-600">
                <div className="flex items-center font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 text-slate-500 font-bold shrink-0">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      job.company?.charAt(0) || 'E'
                    )}
                  </div>
                  {job.company}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Desktop/Tablet) */}
          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 lg:mt-0">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-12 border-slate-200 hover:bg-white hover:border-rose-200 transition-all",
                isSaved && "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              )}
              onClick={onToggleSave}
              disabled={saveLoading}
            >
              <Heart className={cn("w-5 h-5 mr-2", isSaved && "fill-current")} />
              {isSaved ? 'Sauvegardée' : 'Sauvegarder'}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-slate-200 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all"
              onClick={() => onShare('copy')}
              title="Partager"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailHero;