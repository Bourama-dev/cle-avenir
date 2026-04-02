import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, AlertCircle, Euro, ChevronRight, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden group">
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
              {job.main_sectors?.[0] || 'Général'}
            </Badge>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
              {job.rome_code}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {job.libelle}
          </h3>
          
          <p className="text-slate-600 text-sm line-clamp-3 mb-6">
            {job.description || "Découvrez ce métier passionnant et ses opportunités."}
          </p>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Euro className="w-4 h-4 text-emerald-500 mr-2" />
              <span className="text-slate-700 font-medium">
                {job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k€ - ${(job.salary_max/1000).toFixed(0)}k€` : 'Salaire variable'}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-slate-700 font-medium">{job.trend || 'Marché stable'}</span>
            </div>
            <div className="flex items-center text-sm">
              <AlertCircle className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-slate-700 font-medium truncate">{job.difficulty_access || 'Accès variable'}</span>
            </div>
            {job.matchScore && (
               <div className="flex items-center text-sm">
                 <BarChart className="w-4 h-4 text-pink-500 mr-2" />
                 <span className="text-slate-700 font-medium text-pink-600">Match : {job.matchScore}%</span>
               </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          <Button 
            className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-colors group-hover:shadow-md"
            onClick={() => navigate(`/metier/${job.rome_code}`)}
          >
            Découvrir ce métier <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;