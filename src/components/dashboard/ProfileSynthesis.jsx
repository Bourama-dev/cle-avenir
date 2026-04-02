import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, UserCircle } from 'lucide-react';

const ProfileSynthesis = ({ userProfile }) => {
  const calculateCompletion = () => {
    if (!userProfile) return 0;
    
    const fields = [
      'first_name', 'last_name', 'email', // Basic
      'bio', 'job_title', 'location',     // Info
      'skills', 'experience', 'education' // Detailed
    ];
    
    const filledFields = fields.filter(field => {
      const val = userProfile[field];
      return val && (Array.isArray(val) ? val.length > 0 : true);
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2 border-none shadow-sm bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-rose-500" />
            <CardTitle className="text-lg font-bold text-slate-800">Synthèse du Profil</CardTitle>
          </div>
          <span className="text-sm font-semibold text-rose-600">{completion}% complet</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Progress value={completion} className="h-2.5 bg-slate-100" indicatorClassName="bg-gradient-to-r from-rose-500 to-orange-500" />
            <p className="text-xs text-slate-500 mt-2 text-right">
              Complétez votre profil pour de meilleures recommandations
            </p>
          </div>

          {isComplete ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Bravo ! Votre profil est parfaitement optimisé.</span>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-slate-600">
                    <p className="font-medium text-slate-900 mb-1">Prochaines étapes suggérées :</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {!userProfile?.skills?.length && <li>Ajouter vos compétences clés</li>}
                      {!userProfile?.bio && <li>Rédiger une courte biographie</li>}
                      {!userProfile?.experience?.length && <li>Détailler vos expériences</li>}
                    </ul>
                  </div>
                  <Button asChild size="sm" variant="outline" className="shrink-0 group">
                    <Link to="/profil">
                      Compléter mon profil
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
               </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSynthesis;