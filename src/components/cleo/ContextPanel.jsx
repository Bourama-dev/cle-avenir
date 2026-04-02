import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, Briefcase, MapPin, 
  Target, TrendingUp, X
} from 'lucide-react';
import GoalEditor from './GoalEditor';

const ContextPanel = ({ userProfile, context, isOpen, onClose, onRefresh }) => {
  if (!isOpen) return null;

  return (
    <div className="w-[320px] h-full bg-white border-l border-slate-200 overflow-y-auto hidden 2xl:block shrink-0 shadow-[-5px_0_20px_-5px_rgba(0,0,0,0.05)] z-20">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">Contexte & Profil</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 lg:hidden">
          <X size={18} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* User Profile Summary */}
        <div className="space-y-6">
           {/* Identity Card */}
           <div className="flex items-start gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-violet-600 font-bold text-lg border-2 border-white shadow-sm shrink-0">
                {userProfile?.first_name?.charAt(0) || <User size={20} />}
             </div>
             <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate">{userProfile?.first_name} {userProfile?.last_name}</div>
                <div className="text-xs text-slate-500 truncate">{userProfile?.email}</div>
                <Badge variant="secondary" className="mt-1 text-[10px] h-5 px-1.5 bg-slate-100 text-slate-600 border-slate-200">
                   {userProfile?.role === 'admin' ? 'Admin' : 'Membre Premium'}
                </Badge>
             </div>
           </div>

           {/* Goals Section (Editable) */}
           <div className="relative group">
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={12} className="text-violet-500" /> Objectifs
                 </h4>
                 <GoalEditor 
                    currentGoal={userProfile?.main_goal} 
                    currentTitle={userProfile?.job_title} 
                    onUpdate={onRefresh}
                 />
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-white p-3 rounded-xl border border-violet-100 shadow-sm">
                 <div className="font-bold text-violet-900 text-sm mb-1">
                    {userProfile?.job_title || "Poste non défini"}
                 </div>
                 <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {userProfile?.main_goal || "Définissez votre objectif pour obtenir des conseils personnalisés."}
                 </p>
              </div>
           </div>

           {/* Skills Section */}
           <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <TrendingUp size={12} className="text-emerald-500" /> Compétences
              </h4>
              <div className="flex flex-wrap gap-1.5">
                 {userProfile?.skills?.slice(0, 8).map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 text-xs py-1 transition-colors">
                       {skill}
                    </Badge>
                 )) || <span className="text-xs text-slate-400 italic pl-1">Aucune compétence listée</span>}
              </div>
           </div>

           {/* Experience Section */}
           <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Briefcase size={12} className="text-blue-500" /> Expérience
              </h4>
              <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                 <span className="font-medium">{userProfile?.experience_level || 'Junior'}</span>
                 <span className="text-slate-400 text-xs">{userProfile?.experience_years ? `${userProfile.experience_years} ans` : ''}</span>
              </div>
           </div>
        </div>

        {/* Active Context Card (If needed) */}
        {context?.data && (
           <Card className="bg-amber-50 border-amber-100 mt-6 animate-in slide-in-from-bottom-2">
              <CardHeader className="p-3 pb-0">
                 <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                    <MapPin size={10} /> Contexte Actuel
                 </div>
              </CardHeader>
              <CardContent className="p-3">
                 <h4 className="font-bold text-slate-900 text-sm mb-1">{context.data.title}</h4>
                 <div className="flex items-center gap-2 text-xs text-slate-600">
                    {context.data.company && <span>{context.data.company}</span>}
                 </div>
              </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
};

export default ContextPanel;