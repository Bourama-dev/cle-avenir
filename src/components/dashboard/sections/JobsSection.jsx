import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobsSection = ({ userProfile, match }) => {
  const navigate = useNavigate();
  // Mock Data
  const jobs = [
    { id: 1, title: match?.title || 'Développeur', company: 'TechCorp', location: 'Paris', contract: 'CDI', salary: '42k€' },
    { id: 2, title: 'Junior Frontend Dev', company: 'StartupStudio', location: 'Remote', contract: 'CDI', salary: '38k€' },
    { id: 3, title: 'Alternant Web', company: 'BigGroup', location: 'Lyon', contract: 'Alternance', salary: '1200€/mois' },
  ];

  const plan = userProfile?.subscription_tier || 'free';
  const isPremium = plan !== 'free';

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Offres d'Emploi</h2>
          <Button onClick={() => navigate('/offres-emploi')}>Voir tout</Button>
       </div>

       <div className="space-y-4">
          {jobs.map(job => (
             <Card key={job.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xl">
                         {job.company[0]}
                      </div>
                      <div>
                         <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                         <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center"><Building className="w-3 h-3 mr-1"/> {job.company}</span>
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {job.location}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                         <Badge variant="outline" className="mb-1">{job.contract}</Badge>
                         <div className="font-bold text-slate-900">
                            {isPremium ? job.salary : <span className="flex items-center text-slate-400 text-sm"><Lock className="w-3 h-3 mr-1"/> Masqué</span>}
                         </div>
                      </div>
                      <Button onClick={() => navigate(`/job/${job.id}`)}>Voir</Button>
                   </div>
                </CardContent>
             </Card>
          ))}
       </div>
    </div>
  );
};

export default JobsSection;