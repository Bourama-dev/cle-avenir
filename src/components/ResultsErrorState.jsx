import React from 'react';
import { AlertCircle, RefreshCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ResultsErrorState = ({ onRetry, error }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-red-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Une petite erreur est survenue
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Nous n'avons pas pu générer vos résultats complets. Ne vous inquiétez pas, vos réponses sont sauvegardées.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={onRetry} 
            className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Réessayer l'analyse
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12"
            onClick={() => window.location.href = 'mailto:support@cleavenir.com'}
          >
            <Mail className="w-4 h-4 mr-2" /> Contacter le support
          </Button>
        </div>
        
        {error && (
            <div className="mt-8 p-3 bg-slate-100 rounded text-xs text-slate-500 font-mono text-left overflow-auto max-h-20">
                Error details: {error.message || "Unknown error"}
            </div>
        )}
      </Card>
    </div>
  );
};

export default ResultsErrorState;