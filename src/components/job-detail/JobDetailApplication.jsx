import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Info } from 'lucide-react';

const JobDetailApplication = ({ job, onApply }) => {
  return (
    <Card className="bg-slate-900 text-white border-none shadow-xl rounded-2xl overflow-hidden relative">
      {/* Abstract bg shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      
      <CardContent className="p-6 relative z-10">
        <h3 className="text-lg font-bold mb-4">Prêt à postuler ?</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 text-slate-300 text-sm">
            <Clock className="w-5 h-5 shrink-0 text-rose-400" />
            <p>Ne tardez pas ! Les offres expirent généralement après 30 jours.</p>
          </div>
          <div className="flex items-start gap-3 text-slate-300 text-sm">
            <Info className="w-5 h-5 shrink-0 text-blue-400" />
            <p>Vous serez redirigé vers le site du recruteur pour finaliser votre candidature.</p>
          </div>
        </div>

        <Button 
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 shadow-lg shadow-rose-900/20"
          onClick={onApply}
        >
          Postuler maintenant <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobDetailApplication;