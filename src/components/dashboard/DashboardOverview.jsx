import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Compass, BookOpen, ChevronRight, BarChart2, AlertCircle } from 'lucide-react';
import TestHistoryWidget from './TestHistoryWidget';
import WidgetErrorBoundary from './WidgetErrorBoundary';
import { testService } from '@/services/testService';

const DashboardOverview = ({ userProfile, onNavigate }) => {
  const [testStats, setTestStats] = useState({ count: 0, loading: true, error: null });

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile?.id) return;
      try {
        const res = await testService.getTestCount(userProfile.id);
        setTestStats({ count: res.count, loading: false, error: null });
      } catch (err) {
        console.error('[DashboardOverview] Error fetching test stats:', err);
        setTestStats({ count: 0, loading: false, error: err.message });
      }
    };
    fetchStats();
  }, [userProfile]);

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {testStats.loading ? '...' : testStats.error ? (
                <AlertCircle className="w-5 h-5 text-red-400 mx-auto" />
              ) : testStats.count}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Tests passés</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => onNavigate('/metiers')}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Explorer</div>
            <div className="text-xs text-slate-500 mt-1">Métiers</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-pink-300 transition-colors" onClick={() => onNavigate('/formations')}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Trouver</div>
            <div className="text-xs text-slate-500 mt-1">Formations</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors" onClick={() => onNavigate('/personalized-plan')}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Mon Plan</div>
            <div className="text-xs text-slate-500 mt-1">Action</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test CTA */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Compass className="w-32 h-32" />
          </div>
          <CardContent className="p-8 relative z-10">
            <h3 className="text-2xl font-bold mb-2">Nouveau Test Dispo !</h3>
            <p className="text-indigo-100 mb-6">Découvrez notre test en 27 questions pour affiner votre profil RIASEC.</p>
            <Button onClick={() => onNavigate('/test-orientation')} className="bg-white text-indigo-600 hover:bg-slate-50">
              Passer le test <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* History Widget with Error Boundary */}
        <WidgetErrorBoundary fallbackMessage="L'historique des tests n'a pas pu se charger.">
          <TestHistoryWidget userId={userProfile?.id} />
        </WidgetErrorBoundary>
      </div>
    </div>
  );
};

export default DashboardOverview;
