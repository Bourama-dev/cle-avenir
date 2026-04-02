import React from 'react';
import { Map, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyPlanPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-slate-50">
    {/* Header removed */}
    <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 relative">
        <Map className="w-12 h-12 text-slate-500" />
        <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full"><Lock className="w-4 h-4" /></div>
      </div>
      <h1 className="text-3xl font-bold mb-4">Mon Plan d'Action</h1>
      <p className="text-slate-600 max-w-md mb-8">Votre feuille de route étape par étape vers votre nouveau métier.</p>
      <Button onClick={() => onNavigate('/premium')}>Voir mon plan</Button>
    </div>
  </div>
);
export default MyPlanPage;