import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ArrowRight, Clock, Award, Info, MapPin, Building, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusContext, isFormationAccessible, EDUCATION_LABELS } from '@/utils/educationUtils';
import { extractFormationKeywords } from '@/utils/formationKeywords';

const Title = ({ children, level }) => (
  <div className="mb-3 px-1 flex items-center justify-between gap-3">
    <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
      <GraduationCap className="w-5 h-5 text-pink-600 shrink-0" />
      {children}
    </h2>
    {level && (
      <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
        {EDUCATION_LABELS[level] || level}
      </span>
    )}
  </div>
);

const FormationPathSection = ({ formations, isLoading, userProfile }) => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const statusCtx = getStatusContext(userProfile?.user_status);
  const sectionTitle = statusCtx.formationTitle;

  if (isLoading) {
    return (
      <section>
        <Title>{sectionTitle}</Title>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2].map(i => (
            <div key={i} className="w-[82%] shrink-0 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!formations || formations.length === 0) {
    return (
      <section>
        <Title>{sectionTitle}</Title>
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center flex flex-col items-center">
          <Info className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium mb-1">
            Sélectionnez un métier cible ou explorez les formations.
          </p>
          <p className="text-slate-500 text-sm mb-4 max-w-md">
            {userProfile?.education_level
              ? `Formations adaptées à votre niveau (${EDUCATION_LABELS[userProfile.education_level] || userProfile.education_level}) seront affichées ici.`
              : 'Découvrez les parcours académiques et professionnels qui mènent aux métiers recommandés.'}
          </p>
          <Button onClick={() => navigate('/formations')} className="h-11 rounded-xl bg-pink-600 hover:bg-pink-700 text-white">
            Rechercher des formations
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Title level={userProfile?.education_level}>{sectionTitle}</Title>

      <div className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-4 md:overflow-visible">
        {formations.slice(0, 4).map((form, idx) => {
          const accessible = isFormationAccessible(form, userProfile);
          const isLocked = userProfile?.education_level && !accessible;
          const { metierKeyword, offresKeyword } = extractFormationKeywords(form.title || '');

          return (
            <motion.article
              key={form.id || idx}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : idx * 0.05 }}
              className={`snap-center shrink-0 w-[82%] sm:w-[60%] md:w-auto flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden ${isLocked ? 'opacity-80' : ''}`}
            >
              <div className={`flex items-center gap-3 px-5 py-3 ${isLocked ? 'bg-slate-100' : 'bg-pink-50'}`}>
                <Award className={`w-6 h-6 shrink-0 ${isLocked ? 'text-slate-400' : 'text-pink-600'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold uppercase tracking-wide truncate ${isLocked ? 'text-slate-500' : 'text-pink-900'}`}>
                    {form.level || form.required_education_level || 'Diplôme'}
                  </div>
                  <div className={`text-xs flex items-center font-medium ${isLocked ? 'text-slate-400' : 'text-pink-700'}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {form.duration || form.total_duration || (form.duration_hours ? `${form.duration_hours}h` : 'Durée variable')}
                  </div>
                </div>
                {userProfile?.education_level && (
                  !isLocked ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Accessible
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1 shrink-0">
                      <Lock className="w-3 h-3" /> Niveau +
                    </Badge>
                  )
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-3">
                  {form.title || form.name || 'Formation'}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{form.provider || form.provider_name || 'Institut de formation'}</span>
                  </div>
                  {(form.location_city || userProfile?.region) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{form.location_city || userProfile.region}</span>
                    </div>
                  )}
                </div>

                {form.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{form.description}</p>
                )}

                {isLocked && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 mt-3 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    Nécessite un niveau supérieur à votre niveau actuel.
                  </p>
                )}

                <div className="mt-auto pt-4 space-y-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const q = encodeURIComponent(form.title || '');
                      navigate(`/formations${q ? `?q=${q}` : ''}`);
                    }}
                    className="w-full h-11 rounded-xl border-pink-200 bg-pink-50/50 hover:bg-pink-100 text-pink-800"
                  >
                    Voir la formation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      className="flex-1 h-11 text-xs text-indigo-600 hover:bg-indigo-50 px-2"
                      onClick={() => navigate(`/metiers?q=${encodeURIComponent(metierKeyword)}`)}
                      title={metierKeyword}
                    >
                      Métiers associés
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 h-11 text-xs text-rose-600 hover:bg-rose-50 px-2"
                      onClick={() => navigate(`/offres-emploi?q=${encodeURIComponent(offresKeyword)}`)}
                      title={offresKeyword}
                    >
                      Offres d'emploi
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default FormationPathSection;
