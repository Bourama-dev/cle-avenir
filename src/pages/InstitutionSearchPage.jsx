import React, { useState, useEffect } from 'react';
import { EducationDirectoryService } from '@/services/educationDirectoryService';
import InstitutionCard from '@/components/InstitutionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useDebounce } from '@/hooks/useDebounce';

const InstitutionSearchPage = () => {
  const [query, setQuery] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchInstitutions = async () => {
       setLoading(true);
       try {
          const data = await EducationDirectoryService.searchInstitutions({ 
             query: debouncedQuery,
             limit: 50 
          });
          setInstitutions(data || []);
       } catch (error) {
          console.error("Failed to fetch institutions", error);
       } finally {
          setLoading(false);
       }
    };

    fetchInstitutions();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHead title="Annuaire des Établissements - CléAvenir" description="Trouvez votre école, collège, lycée ou université." />
      
      <div className="bg-white border-b py-8 px-4">
         <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Annuaire des Établissements</h1>
            <div className="relative max-w-lg mx-auto">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par nom, ville..."
                  className="pl-10 h-12 text-lg"
               />
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
         {loading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
         ) : (
            <div className="grid gap-4 md:grid-cols-2">
               {institutions.length > 0 ? (
                  institutions.map(inst => (
                     <InstitutionCard key={inst.id} institution={inst} showActions={true} onSelect={(i) => console.log(i)} />
                  ))
               ) : (
                  <div className="col-span-full text-center py-12 text-slate-500">
                     Aucun établissement trouvé.
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default InstitutionSearchPage;