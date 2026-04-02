import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { EstablishmentCodeGenerator } from '@/utils/EstablishmentCodeGenerator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const EstablishmentCodeManager = ({ code, onRegenerate, disabled }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copié !",
        description: "Code UAI copié dans le presse-papier.",
        duration: 2000,
        className: "bg-green-50 border-green-200"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le code.",
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newCode = await EstablishmentCodeGenerator.generateUniqueUAICode();
      if (newCode) {
        onRegenerate(newCode);
        toast({
          title: "Code généré",
          description: "Nouveau code UAI unique créé.",
          className: "bg-blue-50 border-blue-200"
        });
      } else {
        throw new Error("Impossible de générer un code unique.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de génération",
        description: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <Label className="text-base font-semibold flex items-center gap-2">
          Code d'Établissement (UAI)
          {code ? (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px] h-5">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Généré
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px] h-5">
              En attente
            </Badge>
          )}
        </Label>
      </div>
      
      <p className="text-sm text-slate-500 mb-2">
        Identifiant unique utilisé pour relier les étudiants à cet établissement.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input 
            value={code || ''} 
            readOnly 
            placeholder="Non généré"
            className={cn(
              "font-mono text-center tracking-wider font-bold pr-10",
              code ? "bg-white text-slate-900 border-slate-300" : "bg-slate-100 text-slate-400 border-slate-200 italic"
            )}
          />
          {code && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-slate-400 hover:text-purple-600 hover:bg-purple-50"
              title="Copier"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          type="button"
          onClick={handleGenerate}
          disabled={disabled || isGenerating}
          variant="outline"
          className="shrink-0 bg-white hover:bg-purple-50 hover:text-purple-700 border-slate-300"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
          {code ? 'Régénérer' : 'Générer Code'}
        </Button>
      </div>
    </div>
  );
};

export default EstablishmentCodeManager;