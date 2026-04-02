import React, { useState } from 'react';
import { fetchFormations } from '@/services/parcoursup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin, School, GraduationCap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ParcoursupTestPage = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    q: '',
    ville: '',
    codePostal: '',
    type: ''
  });
  const { toast } = useToast();

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetchFormations(filters);
      if (res.success) {
        setResults(res.results);
        setTotal(res.total || res.count || 0);
        toast({ title: "Recherche terminée", description: `${res.count} résultats trouvés.` });
      } else {
        setResults([]);
        toast({ variant: "destructive", title: "Erreur", description: res.error || "Erreur inconnue" });
      }
    } catch (error) {
      setResults([]);
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-primary" /> 
                    Parcoursup API Explorer
                </h1>
                <p className="text-slate-500">Interface de test et d'exploration des données Parcoursup</p>
            </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
            <CardHeader><CardTitle className="text-lg">Filtres de recherche</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mots-clés</label>
                        <Input 
                            placeholder="ex: Informatique" 
                            value={filters.q}
                            onChange={(e) => setFilters({...filters, q: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ville</label>
                        <Input 
                            placeholder="ex: Lyon" 
                            value={filters.ville}
                            onChange={(e) => setFilters({...filters, ville: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Code Postal</label>
                        <Input 
                            placeholder="ex: 69000" 
                            maxLength={5}
                            value={filters.codePostal}
                            onChange={(e) => setFilters({...filters, codePostal: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select onValueChange={(val) => setFilters({...filters, type: val === 'all' ? '' : val})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="BTS">BTS</SelectItem>
                                <SelectItem value="BUT">BUT</SelectItem>
                                <SelectItem value="Licence">Licence</SelectItem>
                                <SelectItem value="Master">Master</SelectItem>
                                <SelectItem value="CPGE">CPGE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={() => {
                            setFilters({ q: '', ville: '', codePostal: '', type: '' });
                            setResults([]);
                        }}>Réinitialiser</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                            Rechercher
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-semibold">Résultats</h2>
                <Badge variant="secondary">{total} formations trouvées</Badge>
            </div>

            {results.length === 0 && !loading && (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed rounded-xl">
                    Aucun résultat à afficher. Lancez une recherche.
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            <div className="grid gap-4">
                {results.map((item, idx) => (
                    <Card key={`${item.id_formation}-${idx}`} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-primary mb-1">{item.libelle_formation}</h3>
                                    <div className="flex gap-2">
                                        <Badge variant="outline">{item.type_formation}</Badge>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{item.niveau}</Badge>
                                    </div>
                                </div>
                                {item.rncp && (
                                    <Badge variant="secondary" className="font-mono text-xs">RNCP: {item.rncp}</Badge>
                                )}
                            </div>
                            
                            {item.etablissements && item.etablissements.map((etab, eIdx) => (
                                <div key={eIdx} className="p-4 text-sm flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="font-semibold flex items-center gap-2">
                                            <School className="h-4 w-4 text-slate-500"/> 
                                            {etab.nom}
                                        </div>
                                        <div className="text-slate-500 flex items-center gap-2 ml-6">
                                            <MapPin className="h-3 w-3"/> 
                                            {etab.ville} ({etab.code_postal}) - {etab.departement}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-xs text-slate-400">
                                        <span>UAI: {etab.uai}</span>
                                        {item.domaines && item.domaines.length > 0 && (
                                            <span className="max-w-[200px] truncate text-right">
                                                {item.domaines.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ParcoursupTestPage;