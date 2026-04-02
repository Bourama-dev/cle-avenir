import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Paiement annulé</h1>
          <p className="text-slate-600 mb-8">
            Le processus de paiement a été interrompu. Aucun montant n'a été débité de votre compte.
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate('/forfaits')} className="w-full h-12">
              Réessayer
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-full">
              Retour au Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutCancel;