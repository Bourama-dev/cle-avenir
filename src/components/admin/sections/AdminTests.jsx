import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import HelpButton from '@/components/ui/HelpButton';

// Components
import AdminTestsSummaryCards from './tests/AdminTestsSummaryCards';
import AdminTestsVisualization from './tests/AdminTestsVisualization';
import AdminTestsFilters from './tests/AdminTestsFilters';
import AdminTestsTable from './tests/AdminTestsTable';
import AdminTestsDetailModal from './tests/AdminTestsDetailModal';
import AdminTestsExport from './tests/AdminTestsExport';

const AdminTests = () => {
  const { toast } = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    minScore: 0,
    status: 'all'
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          profiles (
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      if (data) setResults(data);
      
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de récupérer les résultats des tests."
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return results.filter(item => {
      // Search Filter
      const searchTerm = filters.search.toLowerCase();
      const userName = item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.toLowerCase() : '';
      const userEmail = item.profiles?.email?.toLowerCase() || '';
      
      if (searchTerm && !userName.includes(searchTerm) && !userEmail.includes(searchTerm)) {
        return false;
      }

      // Date Range Filter
      if (filters.dateFrom) {
        if (new Date(item.created_at) < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo) {
        // End of day
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(item.created_at) > endDate) return false;
      }

      // Score Filter
      const score = item.results?.baseResults?.confidence || 0;
      if (score < filters.minScore) return false;

      // Status Filter
      if (filters.status !== 'all') {
         const isCompleted = !!item.results; 
         if (filters.status === 'completed' && !isCompleted) return false;
         if (filters.status === 'in_progress' && isCompleted) return false;
      }

      return true;
    });
  }, [results, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      minScore: 0,
      status: 'all'
    });
  };

  if (loading && results.length === 0) {
     return <div className="flex h-96 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tests & Résultats</h2>
             <HelpButton section="TESTS" />
          </div>
          <p className="text-slate-500 mt-1">Gérez et analysez les tests d'orientation de la plateforme.</p>
        </div>
        <AdminTestsExport data={filteredData} />
      </div>

      <AdminTestsSummaryCards data={filteredData} />
      
      <AdminTestsVisualization data={filteredData} loading={loading} />

      <AdminTestsFilters 
        filters={filters} 
        setFilters={setFilters} 
        onReset={handleResetFilters} 
      />

      <AdminTestsTable 
        data={filteredData} 
        onView={setSelectedTest} 
      />

      <AdminTestsDetailModal 
        test={selectedTest} 
        isOpen={!!selectedTest} 
        onClose={() => setSelectedTest(null)} 
      />
    </div>
  );
};

export default AdminTests;