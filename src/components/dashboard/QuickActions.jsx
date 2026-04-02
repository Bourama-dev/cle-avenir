import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, GraduationCap, Briefcase, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QuickActions = () => {
  const actions = [
    { label: 'Mettre à jour profil', icon: Edit, path: '/profil', variant: 'outline', color: 'text-slate-700' },
    { label: 'Voir formations', icon: GraduationCap, path: '/formations', variant: 'outline', color: 'text-purple-600' },
    { label: 'Consulter offres', icon: Briefcase, path: '/offres-emploi', variant: 'outline', color: 'text-blue-600' },
    { label: 'Lancer test', icon: PlayCircle, path: '/test-orientation', variant: 'default', className: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent' }
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button 
            key={index} 
            asChild 
            variant={action.variant} 
            className={`w-full justify-start h-10 ${action.className || ''}`}
          >
            <Link to={action.path} className="flex items-center gap-3">
              <action.icon className={`h-4 w-4 ${action.color || ''}`} />
              <span>{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;