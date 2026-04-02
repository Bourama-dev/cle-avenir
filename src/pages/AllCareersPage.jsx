import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Briefcase, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CareerModal from '@/components/test-results/CareerModal';

const AllCareersPage = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const { toast } = useToast();
  const PAGE_SIZE = 20;

  const fetchCareers = async (isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      const currentPage = isNewSearch ? 0 : page;
      
      let query = supabase
        .from('rome_metiers')
        .select('code, libelle, description, niveau_etudes, riasecMajeur')
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (searchTerm) {
        query = query.ilike('libelle', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setCareers(prev => isNewSearch ? data : [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        if (!isNewSearch) setPage(currentPage + 1);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les métiers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCareers(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Annuaire des Métiers ROME</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explorez plus de 10 000 fiches métiers issues du référentiel officiel.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Rechercher un métier par nom..." 
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8">Rechercher</Button>
        </form>

        {loading && careers.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <Card 
                  key={career.code} 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-slate-200"
                  onClick={() => setSelectedCareer(career)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-slate-500 font-mono">{career.code}</Badge>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2" title={career.libelle}>
                      {career.libelle}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                      {career.description || "Aucune description disponible pour ce métier."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {career.riasecMajeur && (
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                          Profil {career.riasecMajeur}
                        </Badge>
                      )}
                      {career.niveau_etudes && (
                        <Badge variant="secondary" className="text-xs">
                          {career.niveau_etudes.substring(0, 15)}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && !loading && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" onClick={() => fetchCareers(false)}>
                  Charger plus de métiers
                </Button>
              </div>
            )}
            
            {!hasMore && careers.length > 0 && (
              <p className="text-center text-slate-500 mt-8">Tous les résultats ont été chargés.</p>
            )}

            {careers.length === 0 && !loading && (
              <div className="text-center py-20 text-slate-500">
                Aucun métier trouvé pour "{searchTerm}"
              </div>
            )}
          </>
        )}
      </div>

      <CareerModal 
        career={selectedCareer}
        isOpen={!!selectedCareer}
        onClose={() => setSelectedCareer(null)}
      />
    </div>
  );
};

export default AllCareersPage;