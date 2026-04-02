import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Download, Share2, Compass } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RecommendedActionsSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (message) => {
    toast({ title: "Action enregistrée", description: message });
  };

  return (
    <div className="grid grid-cols-1 gap-3 mb-10">
      <Button onClick={() => navigate('/metiers')} className="h-auto py-4 flex items-center justify-start gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm w-full">
         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
           <Compass className="w-5 h-5" />
         </div>
         <div className="text-left">
           <div className="font-bold">Explorer les métiers</div>
           <div className="text-xs text-indigo-500/80 font-normal">Découvrez plus d'opportunités</div>
         </div>
      </Button>

      <Button onClick={() => navigate('/formations')} className="h-auto py-4 flex items-center justify-start gap-3 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 shadow-sm w-full">
         <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
           <GraduationCap className="w-5 h-5" />
         </div>
         <div className="text-left">
           <div className="font-bold">Chercher une formation</div>
           <div className="text-xs text-pink-500/80 font-normal">Trouvez l'école idéale</div>
         </div>
      </Button>

      <Button onClick={() => navigate('/offres-emploi')} className="h-auto py-4 flex items-center justify-start gap-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm w-full">
         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
           <Briefcase className="w-5 h-5" />
         </div>
         <div className="text-left">
           <div className="font-bold">Voir les offres d'emploi</div>
           <div className="text-xs text-emerald-500/80 font-normal">Postulez dès maintenant</div>
         </div>
      </Button>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button variant="outline" onClick={() => handleAction("Le PDF de votre plan est en cours de génération.")} className="w-full text-slate-600 border-slate-200 hover:bg-slate-50">
           <Download className="w-4 h-4 mr-2" /> PDF
        </Button>
        <Button variant="outline" onClick={() => {
           navigator.clipboard.writeText(window.location.href);
           handleAction("Le lien de votre plan a été copié.");
        }} className="w-full text-slate-600 border-slate-200 hover:bg-slate-50">
           <Share2 className="w-4 h-4 mr-2" /> Partager
        </Button>
      </div>
    </div>
  );
};

export default RecommendedActionsSection;