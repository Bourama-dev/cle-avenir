import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Target, Compass, BookOpen, ChevronRight, BarChart2,
  Briefcase, ShieldCheck, Settings, ArrowRight,
  FileText, Brain, Clock, User, Mail, MapPin,
  GraduationCap, Loader2, TrendingUp, Star, History,
  Activity,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { getDisplayPlanName } from '@/lib/subscriptionUtils';
import WidgetErrorBoundary from './WidgetErrorBoundary';

// ── Profile completion ──────────────────────────────────────────────────────
const PROFILE_FIELDS = [
  { key: 'first_name',      label: 'Prénom' },
  { key: 'last_name',       label: 'Nom' },
  { key: 'region',          label: 'Région' },
  { key: 'education_level', label: "Niveau d'études" },
  { key: 'user_status',     label: 'Situation actuelle' },
  { key: 'age_range',       label: "Tranche d'âge" },
  { key: 'interests',       label: "Centres d'intérêt", check: v => Array.isArray(v) && v.length > 0 },
];

const calcCompletion = (profile) => {
  const done = PROFILE_FIELDS.filter(f =>
    f.check ? f.check(profile?.[f.key]) : !!profile?.[f.key]
  );
  return {
    pct: Math.round((done.length / PROFILE_FIELDS.length) * 100),
    missing: PROFILE_FIELDS
      .filter(f => !(f.check ? f.check(profile?.[f.key]) : !!profile?.[f.key]))
      .map(f => f.label),
  };
};

// ── RIASEC helpers ──────────────────────────────────────────────────────────
const RIASEC_LABELS = {
  R: 'Réaliste', I: 'Investigateur', A: 'Artiste',
  S: 'Social',   E: 'Entrepreneur',  C: 'Conventionnel',
};
const RIASEC_COLORS = {
  R: 'bg-orange-100 text-orange-700', I: 'bg-blue-100 text-blue-700',
  A: 'bg-pink-100 text-pink-700',     S: 'bg-green-100 text-green-700',
  E: 'bg-yellow-100 text-yellow-700', C: 'bg-slate-100 text-slate-700',
};

// ── Inline history widget ───────────────────────────────────────────────────
const TestHistoryInline = ({ history, onNavigate }) => {
  if (!history.length) return null;
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" /> Historique des tests
        </CardTitle>
        <button onClick={() => onNavigate('/profile')} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-0.5">
          Tout voir <ArrowRight className="w-3 h-3" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {history.slice(0, 4).map((test, idx) => {
            const entries = test.riasec_profile
              ? Object.entries(test.riasec_profile).sort(([, a], [, b]) => b - a)
              : [];
            const top3 = entries.slice(0, 3);
            const topDim = top3[0]?.[0] ?? '?';
            const profileCode = top3.map(([k]) => k).join('') || '?';
            return (
              <div key={test.id || idx} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${RIASEC_COLORS[topDim] ?? 'bg-slate-100 text-slate-600'}`}>
                  {topDim}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">Profil {profileCode}</p>
                    {idx === 0 && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">Dernier</span>}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(test.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {top3.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {top3.map(([dim, score]) => (
                        <span key={dim} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${RIASEC_COLORS[dim] ?? 'bg-slate-100 text-slate-500'}`}>
                          {RIASEC_LABELS[dim] ?? dim} {score}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {test.test_score != null && test.test_score > 0 && (
                    <p className="text-sm font-bold text-slate-700">{test.test_score} pts</p>
                  )}
                  <p className="text-xs text-emerald-500 flex items-center gap-1 justify-end mt-0.5">
                    <Activity className="w-3 h-3" /> Terminé
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────
const DashboardOverview = ({ user, userProfile, subscriptionTier, isAdmin, onNavigate, onOpenProfile }) => {
  const [testStats, setTestStats] = useState({ count: 0, latest: null, loading: true });
  const [history, setHistory] = useState([]);

  const completion = calcCompletion(userProfile);

  const fetchData = useCallback(async () => {
    if (!user?.id) { setTestStats(s => ({ ...s, loading: false })); return; }
    try {
      const { data: tests } = await supabase
        .from('test_results')
        .select('id, created_at, riasec_profile, test_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setTestStats({ count: tests?.length ?? 0, latest: tests?.[0] ?? null, loading: false });
      setHistory(tests ?? []);
    } catch {
      setTestStats(s => ({ ...s, loading: false }));
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const topDim = (profile) =>
    profile ? Object.entries(profile).sort(([, a], [, b]) => b - a)[0]?.[0] : null;

  return (
    <div className="space-y-6">

      {/* Profile completion banner */}
      {completion.pct < 100 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  Profil complété à {completion.pct}%
                </span>
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 text-xs h-7" onClick={onOpenProfile}>
                  Compléter
                </Button>
              </div>
              <Progress value={completion.pct} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
              {completion.missing.length > 0 && (
                <p className="text-xs text-amber-600 mt-2">
                  Manquant : {completion.missing.slice(0, 3).join(', ')}
                  {completion.missing.length > 3 ? ` +${completion.missing.length - 3}` : ''}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 min-h-[2rem] flex items-center justify-center">
              {testStats.loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : testStats.count}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Tests passés</div>
          </CardContent>
        </Card>

        {[
          { icon: Compass,  label: 'Explorer',  sub: 'Métiers',          path: '/metiers',          color: 'bg-emerald-100 text-emerald-600', border: 'hover:border-emerald-300' },
          { icon: BookOpen, label: 'Trouver',   sub: 'Formations',       path: '/formations',       color: 'bg-pink-100 text-pink-600',       border: 'hover:border-pink-300' },
          { icon: Star,     label: 'Mes',       sub: 'Recommandations',  path: '/recommendations',  color: 'bg-blue-100 text-blue-600',       border: 'hover:border-blue-300' },
        ].map(({ icon: Icon, label, sub, path, color, border }) => (
          <Card
            key={path}
            className={`bg-white border-slate-200 shadow-sm cursor-pointer ${border} hover:shadow-md transition-all group`}
            onClick={() => onNavigate(path)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 mt-2">{label}</div>
              <div className="text-xs text-slate-500 mt-1">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest RIASEC result */}
      {!testStats.loading && testStats.latest && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Dernier résultat RIASEC
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-indigo-600 text-xs gap-1" onClick={() => onNavigate('/profile')}>
              Voir analyse <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 flex-wrap">
              {testStats.latest.riasec_profile &&
                Object.entries(testStats.latest.riasec_profile)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([dim, score]) => {
                    const isTop = dim === topDim(testStats.latest.riasec_profile);
                    return (
                      <div key={dim} className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${isTop ? 'bg-indigo-600 text-white shadow-sm' : RIASEC_COLORS[dim] ?? 'bg-slate-100 text-slate-600'}`}>
                          {dim}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{RIASEC_LABELS[dim]}</p>
                          <p className="text-xs text-slate-400">{score} pts</p>
                        </div>
                      </div>
                    );
                  })}
              <p className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(testStats.latest.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test CTA + History/Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Compass className="w-32 h-32" />
          </div>
          <CardContent className="p-6 relative z-10">
            <h3 className="text-xl font-bold mb-1">
              {testStats.count > 0 ? 'Repasser le test' : 'Passer mon premier test'}
            </h3>
            <p className="text-indigo-100 text-sm mb-4">
              {testStats.count > 0
                ? 'Affinez votre profil RIASEC avec un nouveau passage.'
                : 'Découvrez votre profil d\'orientation en 27 questions.'}
            </p>
            <Button onClick={() => onNavigate('/test-orientation')} className="bg-white text-indigo-600 hover:bg-slate-50 font-semibold">
              {testStats.count > 0 ? 'Refaire le test' : 'Commencer'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {history.length > 0 ? (
          <WidgetErrorBoundary fallbackMessage="L'historique n'a pas pu se charger.">
            <TestHistoryInline history={history} onNavigate={onNavigate} />
          </WidgetErrorBoundary>
        ) : (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Outils disponibles</h3>
              {[
                { icon: Brain,     label: "Parcours d'apprentissage", path: '/apprentissage', color: 'bg-violet-100 text-violet-600' },
                { icon: FileText,  label: 'Créer mon CV',             path: '/cv-builder',    color: 'bg-blue-100 text-blue-600' },
                { icon: Briefcase, label: "Offres d'emploi",          path: '/offres-emploi', color: 'bg-emerald-100 text-emerald-600' },
              ].map(({ icon: Icon, label, path, color }) => (
                <button key={path} onClick={() => onNavigate(path)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left w-full group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile summary */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" /> Mon Profil
          </CardTitle>
          <Button size="sm" variant="ghost" className="text-slate-500 text-xs hover:text-indigo-600 gap-1" onClick={onOpenProfile}>
            <Settings className="w-3.5 h-3.5" /> Modifier
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: User,          label: 'Nom',       value: `${userProfile?.first_name ?? ''} ${userProfile?.last_name ?? ''}`.trim() || null },
              { icon: Mail,          label: 'Email',     value: user?.email },
              { icon: MapPin,        label: 'Région',    value: userProfile?.region },
              { icon: GraduationCap, label: 'Niveau',    value: userProfile?.education_level },
              { icon: Briefcase,     label: 'Situation', value: userProfile?.user_status },
              { icon: Target,        label: 'Plan',      value: getDisplayPlanName(subscriptionTier) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50">
                <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {value || <span className="text-slate-300 font-normal italic">Non renseigné</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin block */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Espace Administrateur
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button onClick={() => onNavigate('/admin/content')} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5">
                <Settings className="w-4 h-4" /> Gestion de contenu <ArrowRight className="w-4 h-4" />
              </Button>
              <Button onClick={() => onNavigate('/admin/dashboard')} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-100 gap-1.5">
                <BarChart2 className="w-4 h-4" /> Analytics
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardOverview;
