import React from 'react';
import { User, Trophy, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const UserProfilePreview = ({ 
  firstName = "Vous", 
  profileType = "Explorateur", 
  percentile = 92, 
  questionCount = 18 
}) => {
  return (
    <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl">
       <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
               👤
           </div>
           <div>
               <h3 className="font-bold text-slate-900">Votre profil unique</h3>
               <p className="text-sm text-slate-500">Basé sur vos réponses</p>
           </div>
       </div>

       <div className="space-y-4">
           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
               <div className="flex items-center gap-3">
                   <div className="bg-purple-100 p-2 rounded-md text-purple-600">
                       <User className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-medium text-slate-700">Type</span>
               </div>
               <span className="font-bold text-slate-900">{profileType}</span>
           </div>

           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
               <div className="flex items-center gap-3">
                   <div className="bg-yellow-100 p-2 rounded-md text-yellow-700">
                       <Trophy className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-medium text-slate-700">Potentiel</span>
               </div>
               <span className="font-bold text-slate-900">Top {100 - percentile}%</span>
           </div>

           <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
               <div className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                       <BarChart2 className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-medium text-slate-700">Analyse</span>
               </div>
               <span className="font-bold text-slate-900">{questionCount} Q.</span>
           </div>
           
           <div className="pt-2">
               <div className="text-xs text-slate-400 text-center mb-1">Complétion du profil</div>
               <div className="w-full bg-slate-100 rounded-full h-1.5">
                   <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
               </div>
           </div>
       </div>
    </Card>
  );
};

export default UserProfilePreview;