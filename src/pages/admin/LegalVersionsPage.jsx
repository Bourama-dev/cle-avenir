import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Clock, FileText } from 'lucide-react';

const LegalVersionsPage = () => {
  const documents = [
    { id: 1, name: "Politique de Confidentialité", version: "v2.1.0", date: "04 Mars 2026", status: "Active", author: "Admin" },
    { id: 2, name: "Conditions Générales", version: "v1.5.2", date: "15 Janvier 2026", status: "Active", author: "Admin" },
    { id: 3, name: "Politique des Cookies", version: "v3.0.0", date: "04 Mars 2026", status: "Brouillon", author: "DPO" },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Versions Légales</h1>
          <p className="text-slate-600 mt-1">Gestion du versioning des documents légaux.</p>
        </div>
        <img 
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/6cfb25a9b3a069a3bd77fd822530e63f.png" 
          alt="Versions Reference" 
          className="w-16 h-16 object-contain hidden md:block opacity-40 mix-blend-multiply"
        />
      </div>

      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Dernière Modif.</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Auteur</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    {doc.name}
                  </td>
                  <td className="px-6 py-4"><Badge variant="outline" className="font-mono">{doc.version}</Badge></td>
                  <td className="px-6 py-4 text-slate-600">{doc.date}</td>
                  <td className="px-6 py-4">
                    {doc.status === 'Active' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Publié</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Brouillon</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.author}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-indigo-600"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-slate-400"><Clock className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LegalVersionsPage;