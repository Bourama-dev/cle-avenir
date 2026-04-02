import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import JobCard from './JobCard';
import { Button } from '@/components/ui/button';
import { filterAndSortJobs } from '@/utils/matchMetiersToResult';

const RecommendedJobs = ({ jobs = [] }) => {
  const [filter, setFilter] = useState('Tous');
  const [sort, setSort] = useState('score');

  const sectors = useMemo(() => {
    const s = new Set(['Tous']);
    jobs.forEach(j => {
      if (j.main_sectors) j.main_sectors.forEach(sec => s.add(sec));
    });
    return Array.from(s);
  }, [jobs]);

  const displayedJobs = useMemo(() => {
    return filterAndSortJobs(jobs, { sector: filter }, sort);
  }, [jobs, filter, sort]);

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <LayoutGrid className="w-8 h-8 text-blue-600" />
              Métiers Recommandés
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              <span className="font-bold text-blue-600">{displayedJobs.length}</span> opportunités correspondent à votre profil
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2 px-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select 
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="score">Pertinence</option>
                <option value="salary">Salaire</option>
                <option value="trend">Tendance Marché</option>
              </select>
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {displayedJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {displayedJobs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg">Aucun métier ne correspond à ces filtres.</p>
            <Button variant="outline" className="mt-4" onClick={() => {setFilter('Tous'); setSort('score');}}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedJobs;