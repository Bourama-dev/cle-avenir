import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2, MapPin, Mail, GraduationCap, Edit, RefreshCw,
  Trophy, Briefcase, User, AlertCircle, Clock, TrendingUp,
  CheckCircle2, XCircle, BarChart2, Activity, ChevronRight,
  Star, Target, Brain,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTestResults } from '@/hooks/useTestResults';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// ── RIASEC helpers ───────────────────────────────────────────────────────────
const RIASEC_META = {
  R: { label: 'Réaliste',      color: 'bg-orange-500', light: 'bg-orange-100 text-orange-700', desc: 'Travail manuel, technique' },
  I: { label: 'Investigateur', color: 'bg-blue-500',   light: 'bg-blue-100 text-blue-700',     desc: 'Recherche, analyse' },
  A: { label: 'Artiste',       color: 'bg-pink-500',   light: 'bg-pink-100 text-pink-700',      desc: 'Créativité, expression' },
  S: { label: 'Social',        color: 'bg-green-500',  light: 'bg-green-100 text-green-700',    desc: 'Aide, enseignement' },
  E: { label: 'Entrepreneur',  color: 'bg-yellow-500', light: 'bg-yellow-100 text-yellow-700',  desc: 'Leadership, vente' },
  C: { label: 'Conventionnel', color: 'bg-slate-500',  light: 'bg-slate-100 text-slate-700',    desc: 'Organisation, méthode' },
};

// ── Profile completion ────────────────────────────────────────────────────────
const PROFILE_FIELDS = [
  { key: 'first_name',      label: 'Prénom' },
  { key: 'last_name',       label: 'Nom' },
  { key: 'region',          label: 'Région' },
  { key: 'education_level', label: "Niveau d'études" },
  { key: 'user_status',     label: 'Situation actuelle' },
  { key: 'age_range',       label: "Tranche d'âge" },
  { key: 'interests',       label: "Centres d'intérêt", check: v => Array.isArray(v) && v.length > 0 },
  { key: 'phone',           label: 'Téléphone' },
];

const calcCompletion = (profile) => {
  if (!profile) return { pct: 0, done: [], missing: PROFILE_FIELDS.map(f => f.label) };
  const done = PROFILE_FIELDS.filter(f => f.check ? f.check(profile[f.key]) : !!profile[f.key]);
  const missing = PROFILE_FIELDS.filter(f => !(f.check ? f.check(profile[f.key]) : !!profile[f.key]));
  return { pct: Math.round((done.length / PROFILE_FIELDS.length) * 100), done: done.map(f => f.label), missing: missing.map(f => f.label) };
};

// ── RIASEC Bar Chart ──────────────────────────────────────────────────────────
const RiasecChart = ({ riasecProfile }) => {
  if (!riasecProfile) return null;
  const entries = Object.entries(riasecProfile).sort(([, a], [, b]) => b - a);
  const maxScore = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-3">
      {entries.map(([dim, score], idx) => {
        const meta = RIASEC_META[dim];
        if (!meta) return null;
        const pct = Math.round((score / maxScore) * 100);
        return (
          <div key={dim} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${meta.light}`}>
                  {dim}
                </span>
                <span className="font-medium text-slate-700">{meta.label}</span>
                {idx === 0 && <Badge className="text-[10px] px-1.5 py-0 bg-indigo-600 text-white">Principal</Badge>}
                {idx === 1 && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-300 text-slate-500">Secondaire</Badge>}
              </div>
              <span className="text-xs font-semibold text-slate-500">{score} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${meta.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const ProfileResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { testResult, loading: testLoading, error: testError, refetch: refetchTest } = useTestResults();
  const [allTests, setAllTests] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) { setHistoryLoading(false); return; }
    setHistoryLoading(true);
    try {
      const { data } = await supabase
        .from('test_results')
        .select('id, created_at, riasec_profile, test_score, profile_result')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setAllTests(data ?? []);
    } catch (e) {
      console.warn('History fetch error:', e);
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const loading = profileLoading || testLoading;
  const error = profileError || testError;

  if (loading) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-slate-500">Chargement de votre profil…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-slate-800 font-medium text-lg">Une erreur est survenue</p>
        <p className="text-slate-500 text-center max-w-md">{error}</p>
        <Button onClick={() => { refetchProfile(); refetchTest(); }} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    );
  }

  const completion = calcCompletion(profile);
  const riasec = testResult?.riasec_profile ?? null;
  const topEntries = riasec
    ? Object.entries(riasec).sort(([, a], [, b]) => b - a)
    : [];
  const profileCode = topEntries.slice(0, 3).map(([k]) => k).join('');
  const topTraits = testResult?.profile_result?.topTraits || testResult?.classifications?.traits || [];
  const careers = testResult?.top_3_careers || testResult?.results?.matches || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-500" />
            Mon Profil &amp; Résultats
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Consultez votre profil et vos résultats d'orientation.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate('/test-orientation')}>
            <RefreshCw className="mr-2 h-4 w-4" /> Repasser le test
          </Button>
          <Button size="sm" onClick={() => navigate('/profile/edit')} className="bg-indigo-600 hover:bg-indigo-700">
            <Edit className="mr-2 h-4 w-4" /> Modifier mon profil
          </Button>
        </div>
      </div>

      {/* Top row: Profile card + RIASEC */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Profile card */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <User className="h-4 w-4 text-indigo-500" /> Profil Candidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-3 overflow-hidden border-2 border-white shadow">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-indigo-600">
                    {profile?.first_name?.[0] ?? ''}{profile?.last_name?.[0] ?? ''}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base text-slate-900">
                {profile?.first_name || profile?.last_name
                  ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
                  : 'Nom non renseigné'}
              </h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              {profileCode && (
                <span className="mt-2 inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Brain className="w-3 h-3" /> Profil {profileCode}
                </span>
              )}
            </div>

            {/* Info fields */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{profile?.city ? `${profile.city}${profile.postal_code ? ` (${profile.postal_code})` : ''}` : profile?.region || <span className="text-slate-400 italic">Localisation non renseignée</span>}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{profile?.education_level || <span className="text-slate-400 italic">Niveau non renseigné</span>}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">{profile?.user_status || <span className="text-slate-400 italic">Situation non renseignée</span>}</span>
              </div>
            </div>

            {/* Completion */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Complétion du profil</span>
                <span className={completion.pct === 100 ? 'text-emerald-600' : 'text-amber-600'}>{completion.pct}%</span>
              </div>
              <Progress value={completion.pct} className="h-2" />
              {completion.missing.length > 0 && (
                <div className="space-y-1 mt-2">
                  {completion.missing.slice(0, 3).map(field => (
                    <div key={field} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <XCircle className="w-3 h-3 text-slate-300" /> {field}
                    </div>
                  ))}
                  {completion.done.slice(0, 2).map(field => (
                    <div key={field} className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> {field}
                    </div>
                  ))}
                </div>
              )}
              {completion.pct < 100 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Edit className="w-3 h-3 mr-1.5" /> Compléter mon profil
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIASEC Analysis */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <BarChart2 className="h-4 w-4 text-indigo-500" /> Analyse RIASEC
            </CardTitle>
            <CardDescription className="text-xs">
              {testResult
                ? `Dernier test : ${new Date(testResult.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : 'Aucun test effectué'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {riasec ? (
              <div className="space-y-5">
                <RiasecChart riasecProfile={riasec} />
                {topTraits.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Traits dominants</p>
                    <div className="flex flex-wrap gap-2">
                      {topTraits.slice(0, 5).map((trait, i) => (
                        <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium capitalize">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {testResult?.profile_result?.type && (
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl">
                    <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-500 font-medium">Type de profil</p>
                      <p className="text-sm font-bold text-indigo-800">{testResult.profile_result.type}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-slate-500 text-sm mb-4">Vous n'avez pas encore passé le test d'orientation.</p>
                <Button size="sm" onClick={() => navigate('/test-orientation')} className="bg-indigo-600 hover:bg-indigo-700">
                  Commencer le test <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test history */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Clock className="h-4 w-4 text-indigo-500" /> Historique des tests
          </CardTitle>
          <span className="text-xs text-slate-400">{allTests.length} test{allTests.length > 1 ? 's' : ''} passé{allTests.length > 1 ? 's' : ''}</span>
        </CardHeader>
        <CardContent className="p-0">
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : allTests.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">Aucun test effectué pour l'instant.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Profil</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Dimensions principales</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTests.map((test, idx) => {
                    const entries = test.riasec_profile
                      ? Object.entries(test.riasec_profile).sort(([, a], [, b]) => b - a)
                      : [];
                    const code = entries.slice(0, 3).map(([k]) => k).join('') || '—';
                    const top3 = entries.slice(0, 3);
                    const isLatest = idx === 0;
                    return (
                      <tr key={test.id} className={`hover:bg-slate-50 transition-colors ${isLatest ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                            <span className="text-slate-700 font-medium">
                              {new Date(test.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {isLatest && <span className="text-[10px] text-indigo-500 font-semibold ml-3">Dernier</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          {code !== '—' ? (
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-bold">
                              {code}
                            </span>
                          ) : <span className="text-slate-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {top3.length > 0 ? top3.map(([dim, score]) => {
                              const meta = RIASEC_META[dim];
                              if (!meta) return null;
                              return (
                                <span key={dim} className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${meta.light}`}>
                                  {meta.label} · {score}
                                </span>
                              );
                            }) : <span className="text-slate-400 text-xs">Non disponible</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-700">
                            {test.test_score != null && test.test_score > 0 ? `${test.test_score} pts` : <span className="text-slate-400">—</span>}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <Activity className="w-3 h-3" /> Terminé
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Career recommendations */}
      {testResult && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Star className="h-4 w-4 text-amber-500" /> Recommandations de carrière
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-indigo-600 gap-1" onClick={() => navigate('/recommendations')}>
              Tout voir <ChevronRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {careers.length > 0 ? (
              <div className="space-y-2.5">
                {careers.slice(0, 5).map((career, idx) => {
                  const score = career.match_score ?? career.matchScore ?? career.score ?? null;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                      onClick={() => navigate('/metiers')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {career.libelle ?? career.title ?? career.name ?? 'Métier'}
                          </p>
                          {career.famille && <p className="text-xs text-slate-400">{career.famille}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {score != null && (
                          <div className="text-right">
                            <p className="text-sm font-bold text-indigo-600">{Math.round(score)}%</p>
                            <p className="text-[10px] text-slate-400">compatibilité</p>
                          </div>
                        )}
                        <Badge variant="secondary" className="text-[10px]">Top {idx + 1}</Badge>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Aucune recommandation enregistrée dans ce test.</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate('/recommendations')}>
                  Voir mes recommandations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileResultsPage;
