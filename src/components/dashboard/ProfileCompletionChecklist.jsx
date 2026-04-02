import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionChecklist = ({ userProfile }) => {
  const navigate = useNavigate();

  if (!userProfile) return null;

  const checks = [
    { 
      id: 'basic', 
      label: "Informations de base", 
      isComplete: !!(userProfile.first_name && userProfile.last_name && userProfile.email),
      action: "/account" 
    },
    { 
      id: 'skills', 
      label: "Compétences (min. 3)", 
      isComplete: !!(userProfile.skills && userProfile.skills.length >= 3),
      action: "/account" 
    },
    { 
      id: 'location', 
      label: "Préférence de localisation", 
      isComplete: !!(userProfile.location || userProfile.city),
      action: "/account" 
    },
    { 
      id: 'experience', 
      label: "Niveau d'expérience", 
      isComplete: !!userProfile.experience_level,
      action: "/account" 
    },
    { 
      id: 'salary', 
      label: "Attentes salariales", 
      isComplete: !!userProfile.salary_min,
      action: "/account" 
    },
  ];

  const completedCount = checks.filter(c => c.isComplete).length;
  const totalCount = checks.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  if (percentage === 100) return null; // Don't show if complete

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-1">
          <CardTitle className="text-base font-semibold text-indigo-900">
            Optimisez vos résultats
          </CardTitle>
          <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-2 bg-indigo-100" indicatorClassName="bg-indigo-600" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Complétez votre profil pour obtenir des recommandations plus précises et augmenter votre score de match.
        </p>
        <div className="space-y-2.5">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 text-sm">
              {check.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 flex justify-between items-center">
                <span className={check.isComplete ? "text-muted-foreground line-through" : "text-foreground font-medium"}>
                  {check.label}
                </span>
                {!check.isComplete && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-indigo-600 hover:text-indigo-700"
                    onClick={() => navigate(check.action)}
                  >
                    Ajouter
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionChecklist;