import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, AlertTriangle, X } from 'lucide-react';

const ParentalConsentModal = ({ isOpen, childFirstName, onConfirm, onClose }) => {
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!parentEmail.trim()) {
      setError("L'email du parent est requis");
      return;
    }
    if (!emailRegex.test(parentEmail)) {
      setError("Format d'email invalide");
      return;
    }
    onConfirm(parentEmail.trim());
  };

  if (!isOpen) return null;

  const name = childFirstName || 'Vous avez';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Autorisation parentale</h2>
              <p className="text-xs text-slate-500">RGPD Article 8 — Loi française</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              {childFirstName ? `${childFirstName} a` : 'Vous avez'} moins de 15 ans.
              La loi impose d'obtenir l'accord d'un parent ou tuteur légal avant de créer ce compte.
            </p>
          </div>
        </div>

        {/* Data listed */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Données qui seront traitées :</p>
          <ul className="text-sm text-slate-600 space-y-1.5">
            {[
              'Prénom, nom, date de naissance',
              'Région et ville de résidence',
              "Niveau d'études et centres d'intérêt",
              "Résultats du test d'orientation",
            ].map(item => (
              <li key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-2">
            Ces données ne sont jamais vendues.{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>

        {/* Parent email */}
        <div className="space-y-2">
          <Label htmlFor="parentEmail" className="font-semibold">
            Email du parent ou tuteur légal
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="parentEmail"
              type="email"
              value={parentEmail}
              onChange={(e) => { setParentEmail(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              placeholder="parent@exemple.com"
              className={`pl-10 ${error ? 'border-red-500 bg-red-50' : ''}`}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <p className="text-xs text-slate-400">
            Un email sera envoyé à cette adresse pour demander l'autorisation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={handleConfirm} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Envoyer la demande d'autorisation
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-slate-500 hover:text-slate-700">
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentalConsentModal;
