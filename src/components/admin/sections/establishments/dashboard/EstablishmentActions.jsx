import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  RefreshCw, 
  KeyRound, 
  UserPlus, 
  Power, 
  Download, 
  FileText,
  Trash2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const ActionButton = ({ icon: Icon, label, onClick, variant = "outline", colorClass, tooltip }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={variant} 
          onClick={onClick}
          className={cn("flex flex-col h-auto py-4 px-2 gap-2 hover:shadow-md transition-all", colorClass)}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs font-medium">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip || label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const EstablishmentActions = ({ onAction, establishment }) => {
  return (
    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <ActionButton 
            icon={Settings} 
            label="Modifier" 
            onClick={() => onAction('edit')}
            colorClass="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
            tooltip="Modifier les informations générales"
          />
          <ActionButton 
            icon={RefreshCw} 
            label="Nouveau Code" 
            onClick={() => onAction('regenerate_code')}
            colorClass="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
            tooltip="Régénérer le code d'établissement"
          />
          <ActionButton 
            icon={KeyRound} 
            label="Mot de passe" 
            onClick={() => onAction('regenerate_password')}
            colorClass="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
            tooltip="Régénérer le mot de passe admin"
          />
          <ActionButton 
            icon={UserPlus} 
            label="Ajouter Email" 
            onClick={() => onAction('add_email')}
            colorClass="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            tooltip="Autoriser un nouveau domaine/email"
          />
           <ActionButton 
            icon={Download} 
            label="Exporter" 
            onClick={() => onAction('export')}
            colorClass="hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200"
            tooltip="Exporter les données de l'établissement"
          />
           <ActionButton 
            icon={FileText} 
            label="Voir les Logs" 
            onClick={() => onAction('view_logs')}
            colorClass="hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200"
            tooltip="Historique d'activité"
          />
          <ActionButton 
            icon={Power} 
            label={establishment?.status === 'active' ? "Désactiver" : "Activer"} 
            onClick={() => onAction('toggle_status')}
            colorClass={establishment?.status === 'active' ? "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200" : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"}
            tooltip="Changer le statut du compte"
          />
           <ActionButton 
            icon={Trash2} 
            label="Supprimer" 
            onClick={() => onAction('delete')}
            colorClass="hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-red-600 border-red-100"
            tooltip="Supprimer définitivement"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EstablishmentActions;