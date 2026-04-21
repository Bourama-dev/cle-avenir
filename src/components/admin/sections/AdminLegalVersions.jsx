import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Clock, FileText, Plus, RefreshCw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DOC_LABELS = {
  confidentialite: 'Politique de Confidentialité',
  cgu: 'Conditions Générales d\'Utilisation',
  cookies: 'Politique des Cookies',
  mentions: 'Mentions Légales',
  rgpd: 'RGPD — Vos Droits',
};

const DOC_ROUTES = {
  confidentialite: '/privacy',
  cgu: '/terms',
  cookies: '/legal/cookies',
  mentions: '/legal',
  rgpd: '/preferences-rgpd',
};

const AdminLegalVersions = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('id, slug, is_active, created_at, content')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Keep only the latest version per slug
      const seen = new Set();
      const latest = (data || []).filter(d => {
        if (seen.has(d.slug)) return false;
        seen.add(d.slug);
        return true;
      });
      setDocs(latest);
    } catch (err) {
      console.error('Failed to load legal docs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadHistory = async (slug) => {
    setShowHistory(slug);
    setHistoryLoading(true);
    try {
      const { data } = await supabase
        .from('legal_documents')
        .select('id, slug, is_active, created_at')
        .eq('slug', slug)
        .order('created_at', { ascending: false })
        .limit(10);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Versions Légales</h2>
          <p className="text-slate-500 text-sm mt-1">Gestion et historique des documents légaux.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => navigate('/admin/content')}
          >
            <Plus className="w-4 h-4 mr-2" /> Éditer un document
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Document</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Dernière Modif.</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                /* Fallback: display known doc types even if DB is empty */
                Object.keys(DOC_LABELS).map(slug => (
                  <tr key={slug} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        {DOC_LABELS[slug]}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden md:table-cell">—</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="text-slate-400">Non publié</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/admin/content')} title="Éditer">
                        <Edit className="w-4 h-4 text-indigo-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                docs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        {DOC_LABELS[doc.slug] || doc.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(doc.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {doc.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Publié</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Brouillon</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      {DOC_ROUTES[doc.slug] && (
                        <a
                          href={DOC_ROUTES[doc.slug]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Voir la page publique"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/admin/content')}
                        title="Éditer"
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadHistory(doc.slug)}
                        title="Historique"
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* History modal */}
      {showHistory && (
        <Card className="border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">
              Historique — {DOC_LABELS[showHistory] || showHistory}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(null)}>Fermer</Button>
          </div>
          {historyLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Aucun historique disponible.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">
                      {format(new Date(entry.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </span>
                    {i === 0 && <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs">Actuel</Badge>}
                  </div>
                  {entry.is_active ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs">Publié</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 text-xs">Archivé</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminLegalVersions;
