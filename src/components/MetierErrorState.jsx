import React from 'react';
import { AlertTriangle, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const MetierErrorState = ({ error, onRetry, showBack = false }) => {
  const navigate = useNavigate();
  const isRateLimit = error?.status === 429 || error?.message?.includes('Trop de requêtes');
  
  const title = isRateLimit ? 'Trop de requêtes' : 'Erreur de chargement';
  const message = isRateLimit 
    ? 'Nous recevons trop de requêtes actuellement. Veuillez patienter quelques secondes avant de réessayer.'
    : error?.message || 'Une erreur inattendue est survenue lors du chargement des données.';

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full animate-in fade-in duration-300">
      <Alert variant="destructive" className="max-w-xl shadow-lg border-red-200 bg-white rounded-2xl">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <AlertTitle className="text-lg font-bold text-slate-900 ml-2">{title}</AlertTitle>
        <AlertDescription className="mt-4 text-slate-600 ml-2 text-base">
          <p className="mb-6">{message}</p>
          <div className="flex flex-wrap gap-3">
            {showBack && (
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Retour
              </Button>
            )}
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white transition-colors" 
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MetierErrorState;