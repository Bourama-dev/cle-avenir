import React from 'react';
import { Medal } from 'lucide-react';

const CertificationsPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-slate-50">
    {/* Header removed */}
    <div className="container mx-auto px-4 py-20 text-center">
      <Medal className="w-16 h-16 text-slate-300 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Micro-Certifications</h1>
      <p className="text-slate-600">Validez vos soft skills et obtenez des badges certifiés CléAvenir. (V1)</p>
    </div>
  </div>
);
export default CertificationsPage;