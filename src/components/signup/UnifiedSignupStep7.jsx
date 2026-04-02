import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Edit3, ShieldCheck, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';

const UnifiedSignupStep7 = ({ formData, handleFieldChange, onPrev, onSubmit, isLoading, errors, setStep }) => {
  
  const SectionSummary = ({ title, stepIndex, children, icon: Icon }) => (
    <div className="relative p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
        <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
            <div className="flex items-center gap-2">
               {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />}
               <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">{title}</h3>
            </div>
            <button 
                onClick={() => setStep(stepIndex)} 
                className="text-slate-300 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                aria-label={`Modifier ${title}`}
            >
                <Edit3 className="w-4 h-4" />
            </button>
        </div>
        <div className="text-sm text-slate-700 space-y-1.5 font-medium">
            {children}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 ring-4 ring-white">
            <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tout est prêt !</h2>
        <p className="text-slate-500">Vérifiez vos informations avant de créer votre compte.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-1">
         <SectionSummary title="Identité" stepIndex={2}>
            <p className="text-lg text-slate-900">{formData.firstName} {formData.lastName}</p>
            <p className="text-slate-500">{formData.email}</p>
            {formData.phone && <p className="text-slate-500">{formData.phone}</p>}
         </SectionSummary>

         <SectionSummary title="Localisation" stepIndex={3}>
            <p>{formData.address}</p>
            <p>{formData.city} <span className="text-slate-400">({formData.postalCode})</span></p>
            <p className="text-slate-500">{formData.country}</p>
         </SectionSummary>

         <SectionSummary title="Profil Pro" stepIndex={4}>
            <div className="flex flex-wrap gap-2 mb-1">
               <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                   {formData.status?.replace('_', ' ')}
               </span>
               <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                   {formData.educationLevel}
               </span>
            </div>
            {formData.interests?.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                    Intérêts: {formData.interests.slice(0, 3).join(', ')}{formData.interests.length > 3 ? '...' : ''}
                </p>
            )}
         </SectionSummary>

         <SectionSummary title="Objectifs & Compétences" stepIndex={5}>
            <div className="flex justify-between items-center">
                <span className="text-slate-600">Salaire visé</span>
                <span className="font-bold text-green-600">{formData.salaryRange?.[0]}k€ - {formData.salaryRange?.[1]}k€</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
               {formData.skills?.slice(0, 4).map(s => (
                   <span key={s} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{s}</span>
               ))}
               {formData.skills?.length > 4 && <span className="text-[10px] text-slate-400">+{formData.skills.length - 4}</span>}
            </div>
            {formData.establishmentName && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-indigo-700 bg-indigo-50 p-2 rounded-lg">
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold truncate">{formData.establishmentName}</span>
                </div>
            )}
         </SectionSummary>
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4 bg-white rounded-xl">
        <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <Checkbox 
                id="terms" 
                checked={formData.termsAccepted || false}
                onCheckedChange={(checked) => handleFieldChange('termsAccepted', checked)}
                className={`mt-0.5 ${errors.termsAccepted ? "border-red-500" : "border-blue-400 data-[state=checked]:bg-blue-600"}`}
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-semibold text-blue-900 leading-none cursor-pointer">
                    J'accepte les conditions générales d'utilisation
                </Label>
                <p className="text-xs text-blue-700/70 leading-relaxed">
                    En créant un compte CléAvenir, vous acceptez notre politique de confidentialité et le traitement de vos données pour vous fournir nos services.
                </p>
                {errors.termsAccepted && <p className="text-xs text-red-500 font-bold mt-1 bg-red-50 p-1 rounded inline-block">{errors.termsAccepted}</p>}
            </div>
        </div>

        <div className="flex gap-4 pt-2">
            <Button variant="ghost" onClick={onPrev} disabled={isLoading} className="flex-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-14 rounded-xl">
               <ArrowLeft className="mr-2 w-4 h-4" /> Retour
            </Button>
            <Button 
                onClick={onSubmit} 
                disabled={isLoading}
                className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-200 font-bold text-lg h-14 rounded-xl transition-all hover:-translate-y-1"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Création du compte...
                    </>
                ) : "Créer mon compte"}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignupStep7;