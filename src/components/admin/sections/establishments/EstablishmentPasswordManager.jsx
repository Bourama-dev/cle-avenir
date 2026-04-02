import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Copy, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { EstablishmentCodeGenerator } from '@/utils/EstablishmentCodeGenerator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const EstablishmentPasswordManager = ({ password, onRegenerate, canRegenerate, disabled }) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copié !",
        description: "Mot de passe copié dans le presse-papier.",
        duration: 2000,
        className: "bg-green-50 border-green-200"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le mot de passe.",
      });
    }
  };

  const handleGenerate = () => {
    const newPass = EstablishmentCodeGenerator.generateTemporaryPassword();
    onRegenerate(newPass);
    setIsVisible(true); // Show password after generation so user can see/copy it
    toast({
      title: "Mot de passe généré",
      description: "Mot de passe temporaire sécurisé créé.",
      className: "bg-blue-50 border-blue-200"
    });
  };

  // Determine if we should show placeholder or actual value
  // If it's an existing hash (and we can't reverse it), we show a placeholder unless it's a new generation
  const displayValue = password || '';
  const isHash = displayValue.startsWith('$2a$') || displayValue.startsWith('$2b$');
  const showPlaceholder = isHash && !canRegenerate; // If it's a hash and we haven't just generated a new one

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <Label className="text-base font-semibold flex items-center gap-2">
          Mot de Passe d'Activation
          {password ? (
             isHash ? (
               <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] h-5">
                 <Lock className="w-3 h-3 mr-1" /> Chiffré
               </Badge>
             ) : (
               <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px] h-5">
                 <CheckCircle2 className="w-3 h-3 mr-1" /> Temporaire
               </Badge>
             )
          ) : (
             <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px] h-5">
               Non défini
             </Badge>
          )}
        </Label>
      </div>

      <p className="text-sm text-slate-500 mb-2">
        Mot de passe temporaire pour la première connexion du responsable.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input 
            type={isVisible ? "text" : "password"}
            value={showPlaceholder ? "••••••••••••••••" : displayValue} 
            readOnly 
            placeholder="Non généré"
            className={cn(
              "font-mono pr-20",
              password ? "bg-white" : "bg-slate-100 italic"
            )}
          />
          
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {password && !showPlaceholder && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0 text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                title="Copier"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            
            {password && !showPlaceholder && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                title={isVisible ? "Masquer" : "Afficher"}
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <Button 
          type="button"
          onClick={handleGenerate}
          disabled={disabled}
          variant="outline"
          className="shrink-0 bg-white hover:bg-purple-50 hover:text-purple-700 border-slate-300"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {password ? 'Régénérer' : 'Générer MDP'}
        </Button>
      </div>
      
      {password && !isHash && (
         <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
           <Lock className="w-3 h-3" />
           Ce mot de passe sera chiffré lors de l'enregistrement. Copiez-le maintenant.
         </p>
      )}
    </div>
  );
};

export default EstablishmentPasswordManager;