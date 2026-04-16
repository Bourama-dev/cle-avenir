import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ArrowRight, Clock, Award, Info, MapPin, Building, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusContext, isFormationAccessible, EDUCATION_LABELS } from '@/utils/educationUtils';
import { extractFormationKeywords } from '@/utils/formationKeywords';

const FormationPathSection = ({ formations, isLoading, userProfile }) => {
  const navigate = useNavigate();
  const statusCtx = getStatusContext(userProfile?.user_status);
  const sectionTitle = statusCtx.formationTitle;

  /* ── Loading skeleton ─────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-600" />
          {sectionTitle}
        </h2>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i} className="overflow-hidden border-slate-200">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="bg-slate-50 p-6 md:w-1/4 flex flex-col justify-center items-center">
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <Skeleton className="h-4 w-20 mb-1" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-6" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  if (!formations || formations.length === 0) {
    return (
      <div className="mb-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-600" />
          {sectionTitle}
        </h2>
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <Info className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-slate-600 font-medium mb-2">
              Sélectionnez un métier cible ou explorez les formations.
            </p>
            <p className="text-slate-500 text-sm mb-6 max-w-md">
              {userProfile?.education_level
                ? `Formations adaptées à votre niveau (${EDUCATION_LABELS[userProfile.education_level] || userProfile.education_level}) seront affichées ici.`
                : 'Découvrez les parcours académiques et professionnels qui mènent aux métiers recommandés.'}
            </p>
            <Button
              variant="default"
              onClick={() => navigate('/formations')}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Rechercher des formations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── Formation list ──────────────────────────────────────────────────── */
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-600" />
          {sectionTitle}
        </h2>
        {userProfile?.education_level && (
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Niveau : {EDUCATION_LABELS[userProfile.education_level] || userProfile.education_level}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {formations.slice(0, 4).map((form, idx) => {
          // Accessibility check
          const accessible = isFormationAccessible(form, userProfile);
          const isLocked = userProfile?.education_level && !accessible;

          return (
            <Card
              key={form.id || idx}
              className={`overflow-hidden border-slate-200 hover-lift shadow-sm transition-opacity ${
                isLocked ? 'opacity-70' : ''
              }`}
            >
              <CardContent className="p-0 flex flex-col md:flex-row">
                {/* Left panel — level + duration */}
                <div className={`p-6 md:w-1/4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r ${
                  isLocked ? 'bg-slate-100 border-slate-200' : 'bg-pink-50/70 border-pink-100'
                }`}>
                  <Award className={`w-8 h-8 mb-3 ${isLocked ? 'text-slate-400' : 'text-pink-600'}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider text-center md:text-left ${
                    isLocked ? 'text-slate-500' : 'text-pink-900'
                  }`}>
                    {form.level || form.required_education_level || 'Diplôme'}
                  </span>
                  <span className={`text-xs mt-2 flex items-center font-medium ${
                    isLocked ? 'text-slate-400' : 'text-pink-700'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {form.duration || form.total_duration || (form.duration_hours ? `${form.duration_hours}h` : 'Durée variable')}
                  </span>

                  {/* Accessibility badge */}
                  {userProfile?.education_level && (
                    <div className="mt-3">
                      {!isLocked ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Accessible
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1">
                          <Lock className="w-3 h-3" /> Niveau requis +
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Right panel — details */}
                <div className="p-6 flex-1 flex flex-col justify-center bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">
                    {form.title || form.name || 'Formation'}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600 mb-5">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{form.provider || form.provider_name || 'Institut de formation'}</span>
                    </div>
                    {(form.location_city || userProfile?.region) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{form.location_city || userProfile.region}</span>
                      </div>
                    )}
                  </div>

                  {form.description && (
                    <p className="text-sm text-slate-500 mb-5 line-clamp-2">{form.description}</p>
                  )}

                  {isLocked && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      Cette formation nécessite un niveau supérieur à votre niveau actuel.
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const q = encodeURIComponent(form.title || '');
                        navigate(`/formations${q ? `?q=${q}` : ''}`);
                      }}
                      className="w-full text-sm border-pink-200 bg-pink-50/50 hover:bg-pink-100 text-pink-800 shadow-sm"
                    >
                      Voir la formation <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {/* Cross-links */}
                    {(() => {
                      const { metierKeyword, offresKeyword } = extractFormationKeywords(form.title || '');
                      return (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2"
                            onClick={() => navigate(`/metiers?q=${encodeURIComponent(metierKeyword)}`)}
                            title={metierKeyword}
                          >
                            Métiers associés →
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2"
                            onClick={() => navigate(`/offres-emploi?q=${encodeURIComponent(offresKeyword)}`)}
                            title={offresKeyword}
                          >
                            Offres d'emploi →
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FormationPathSection;
