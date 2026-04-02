import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const SignupStep12 = ({ formData, onPrev, onSubmit, isLoading }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Tout est prêt !</h2>
        <p className="text-slate-500">Vérifiez vos informations avant de valider.</p>
      </div>

      <Card className="p-6 bg-slate-50 border-slate-200 text-sm space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <div>
                <span className="text-slate-500 block">Identité</span>
                <span className="font-medium text-slate-900">{formData.firstName} {formData.lastName}</span>
            </div>
            <div>
                <span className="text-slate-500 block">Email</span>
                <span className="font-medium text-slate-900 truncate">{formData.email}</span>
            </div>
            <div>
                <span className="text-slate-500 block">Situation</span>
                <span className="font-medium text-slate-900 capitalize">{formData.status}</span>
            </div>
            <div>
                <span className="text-slate-500 block">Ville</span>
                <span className="font-medium text-slate-900">{formData.city}</span>
            </div>
         </div>
         <div className="pt-4 border-t border-slate-200">
            <span className="text-slate-500 block mb-1">Intérêts</span>
            <div className="flex flex-wrap gap-1">
                {formData.interests?.map((i, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-600">{i}</span>
                ))}
            </div>
         </div>
      </Card>

      <div className="text-xs text-center text-slate-400">
        En cliquant sur "Créer mon compte", vous acceptez nos Conditions Générales d'Utilisation et notre Politique de Confidentialité.
      </div>

      <div className="flex gap-4 pt-2">
        <Button variant="outline" onClick={onPrev} disabled={isLoading} className="flex-1 border-slate-200">
          <ArrowLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button 
            onClick={onSubmit} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg font-bold"
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
        </Button>
      </div>
    </div>
  );
};

export default SignupStep12;