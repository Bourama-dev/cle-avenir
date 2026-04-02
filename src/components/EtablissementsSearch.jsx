import React, { useState } from 'react';
import { educationApi } from '@/services/educationApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EtablissementsSearch = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        
        setLoading(true);
        setError(null);
        
        // Simple search by commune for demo
        const response = await educationApi.fetchEtablissements({ commune: query, limit: 10 });
        
        if (response.success) {
            setResults(response.results);
        } else {
            setError(response.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <School className="w-6 h-6 text-primary" />
                            Recherche Établissements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                            <Input 
                                placeholder="Entrez une ville (ex: Bordeaux)" 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin w-4 h-4"/> : <Search className="w-4 h-4"/>}
                            </Button>
                        </form>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm">
                                Erreur: {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {results.map((etab) => (
                                <div key={etab.uai} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{etab.nom}</div>
                                        <div className="text-sm text-slate-500">{etab.adresse}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant="outline">{etab.type}</Badge>
                                        <span className="text-xs text-slate-400">UAI: {etab.uai}</span>
                                    </div>
                                </div>
                            ))}
                            {results.length === 0 && !loading && !error && (
                                <div className="text-center text-slate-400 py-8">
                                    Entrez une ville pour voir les résultats.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EtablissementsSearch;