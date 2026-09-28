import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEstablishmentAuth } from '@/contexts/EstablishmentAuthContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LogOut, Users, Building2, ClipboardCheck, GraduationCap, Copy, Download, Search,
  Loader2, RefreshCw, Trash2, UserPlus, Mail,
} from 'lucide-react';

const RIASEC_LABELS = {
  R: 'Réaliste',
  I: 'Investigateur',
  A: 'Artistique',
  S: 'Social',
  E: 'Entreprenant',
  C: 'Conventionnel',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—');
const fullName = (s) => [s.first_name, s.last_name].filter(Boolean).join(' ') || 'Sans nom';

function downloadStudentsCsv(students, establishmentName) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const header = ['Prénom', 'Nom', 'Email', 'Niveau', 'Inscrit le', 'Tests réalisés', 'Dernier test', 'Profil RIASEC', 'Métier n°1'];
  const rows = students.map((s) => [
    s.first_name, s.last_name, s.email, s.education_level, formatDate(s.created_at), s.tests,
    formatDate(s.last_test_at), s.riasec_top ? RIASEC_LABELS[s.riasec_top] || s.riasec_top : '', s.top_career,
  ]);
  const csv = [header, ...rows].map((row) => row.map(escape).join(';')).join('\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `eleves-${(establishmentName || 'etablissement').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const StatCard = ({ icon: Icon, label, value, hint, color }) => (
  <Card>
    <CardContent className="p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
    </CardContent>
  </Card>
);

const EstablishmentDashboard = () => {
  const { establishment, logout } = useEstablishmentAuth();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [staffBusy, setStaffBusy] = useState(false);

  const load = useCallback(async () => {
    if (!establishment?.id) return;
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('get_establishment_overview', {
      p_establishment_id: establishment.id,
    });
    if (rpcError) {
      console.error('Establishment overview error:', rpcError);
      setError("Impossible de charger les données de l'établissement.");
    } else {
      setOverview(data);
    }
    setLoading(false);
  }, [establishment?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = async () => {
    await logout();
    navigate('/establishment/login');
  };

  const info = overview?.establishment || establishment;
  const stats = overview?.stats;
  const students = useMemo(() => overview?.students || [], [overview]);
  const participation = stats?.students ? Math.round((stats.students_tested / stats.students) * 100) : 0;
  const riasecTotal = Object.values(overview?.riasec || {}).reduce((sum, n) => sum + n, 0);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) => `${fullName(s)} ${s.email || ''} ${s.education_level || ''}`.toLowerCase().includes(query));
  }, [students, search]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(info?.code || '');
      toast({ title: 'Code copié', description: 'Partagez-le à vos élèves.' });
    } catch {
      toast({ variant: 'destructive', title: 'Copie impossible', description: info?.code });
    }
  };

  const addStaff = async (e) => {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ variant: 'destructive', title: 'Email invalide' });
      return;
    }
    setStaffBusy(true);
    const { error: insertError } = await supabase
      .from('authorized_emails')
      .insert({ email, establishment_id: establishment.id, status: 'active', added_by: user?.id ?? null });
    setStaffBusy(false);
    if (insertError) {
      toast({
        variant: 'destructive',
        title: 'Ajout impossible',
        description: insertError.code === '23505'
          ? 'Cet email a déjà accès à un établissement.'
          : "L'email n'a pas pu être ajouté.",
      });
      return;
    }
    setNewEmail('');
    toast({ title: 'Accès ajouté', description: `${email} peut créer son accès sur la page de connexion établissement.` });
    load();
  };

  const removeStaff = async (member) => {
    if (!window.confirm(`Retirer l'accès de ${member.email} ?`)) return;
    setStaffBusy(true);
    const { error: deleteError } = await supabase.from('authorized_emails').delete().eq('id', member.id);
    setStaffBusy(false);
    if (deleteError) {
      toast({ variant: 'destructive', title: 'Suppression impossible' });
      return;
    }
    toast({ title: 'Accès retiré', description: member.email });
    load();
  };

  const myEmail = user?.email?.toLowerCase();

  return (
    <>
      <Helmet>
        <title>Tableau de bord Établissement | CléAvenir</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-slate-900 leading-none truncate">
                    {info?.name || 'Mon établissement'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {[info?.city, info?.uai && `UAI : ${info.uai}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={handleLogout}
                aria-label="Déconnexion"
                className="text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2 shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h2>
              <p className="text-slate-500 mt-1">Suivez l'orientation de vos élèves inscrits sur CléAvenir.</p>
            </div>
            <Button variant="outline" onClick={load} disabled={loading} className="gap-2 self-start md:self-auto">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Code to share with students */}
          <Card className="border-blue-200 bg-blue-50/60">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Code établissement</p>
                <p className="text-sm text-slate-600">
                  Vos élèves le saisissent à l'inscription ou dans « Mon compte » pour être rattachés à votre établissement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold tracking-widest text-blue-700 bg-white border border-blue-200 rounded-lg px-4 py-2">
                  {info?.code || '—'}
                </span>
                <Button variant="outline" size="icon" onClick={copyCode} disabled={!info?.code} aria-label="Copier le code">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading && !overview ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : overview && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  label="Élèves rattachés"
                  value={stats.students}
                  hint={`+${stats.new_students_30d} inscrit${stats.new_students_30d > 1 ? 's' : ''} ces 30 derniers jours`}
                  color="bg-blue-100 text-blue-600"
                />
                <StatCard
                  icon={ClipboardCheck}
                  label="Élèves ayant passé le test"
                  value={stats.students_tested}
                  hint={`Participation : ${participation} %`}
                  color="bg-green-100 text-green-600"
                />
                <StatCard
                  icon={ClipboardCheck}
                  label="Tests réalisés"
                  value={stats.tests}
                  color="bg-purple-100 text-purple-600"
                />
                <StatCard
                  icon={GraduationCap}
                  label="Formations référencées"
                  value={stats.programs}
                  color="bg-amber-100 text-amber-600"
                />
              </div>

              <Tabs defaultValue="students">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="students">Élèves</TabsTrigger>
                  <TabsTrigger value="orientation">Orientation</TabsTrigger>
                  <TabsTrigger value="programs">Formations</TabsTrigger>
                  <TabsTrigger value="staff">Équipe</TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
                      <CardTitle className="text-lg">Élèves ({students.length})</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher"
                            className="pl-8 w-full sm:w-56"
                            aria-label="Rechercher un élève"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() => downloadStudentsCsv(students, info?.name)}
                          disabled={!students.length}
                        >
                          <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {students.length === 0 ? (
                        <p className="text-sm text-slate-500 py-8 text-center">
                          Aucun élève rattaché pour l'instant. Partagez votre code établissement pour qu'ils vous rejoignent.
                        </p>
                      ) : (
                        <div className="overflow-x-auto -mx-6 px-6">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-slate-500 border-b">
                                <th className="py-2 pr-4 font-medium">Élève</th>
                                <th className="py-2 pr-4 font-medium">Niveau</th>
                                <th className="py-2 pr-4 font-medium">Tests</th>
                                <th className="py-2 pr-4 font-medium">Profil</th>
                                <th className="py-2 pr-4 font-medium">Métier n°1</th>
                                <th className="py-2 font-medium">Dernier test</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredStudents.map((s) => (
                                <tr key={s.id} className="border-b last:border-0 align-top">
                                  <td className="py-3 pr-4">
                                    <p className="font-medium text-slate-900">{fullName(s)}</p>
                                    <p className="text-xs text-slate-500 break-all">{s.email}</p>
                                  </td>
                                  <td className="py-3 pr-4 text-slate-700">{s.education_level || '—'}</td>
                                  <td className="py-3 pr-4">
                                    {s.tests > 0
                                      ? <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{s.tests}</Badge>
                                      : <Badge variant="outline" className="text-slate-500">Aucun</Badge>}
                                  </td>
                                  <td className="py-3 pr-4 text-slate-700">{s.riasec_top ? RIASEC_LABELS[s.riasec_top] || s.riasec_top : '—'}</td>
                                  <td className="py-3 pr-4 text-slate-700">{s.top_career || '—'}</td>
                                  <td className="py-3 text-slate-700 whitespace-nowrap">{formatDate(s.last_test_at)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {filteredStudents.length === 0 && (
                            <p className="text-sm text-slate-500 py-6 text-center">Aucun élève ne correspond à « {search} ».</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orientation" className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Profils RIASEC dominants</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {riasecTotal === 0 ? (
                          <p className="text-sm text-slate-500">Disponible dès que vos élèves auront passé le test d'orientation.</p>
                        ) : Object.entries(RIASEC_LABELS).map(([key, label]) => {
                          const count = overview.riasec?.[key] || 0;
                          const pct = Math.round((count / riasecTotal) * 100);
                          return (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700">{label}</span>
                                <span className="text-slate-500">{count} élève{count > 1 ? 's' : ''} · {pct} %</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Métiers les plus recommandés</CardTitle></CardHeader>
                      <CardContent>
                        {overview.top_careers.length === 0 ? (
                          <p className="text-sm text-slate-500">Disponible dès que vos élèves auront passé le test d'orientation.</p>
                        ) : (
                          <ol className="space-y-2">
                            {overview.top_careers.map((career, index) => (
                              <li key={career.name} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-slate-700"><span className="font-semibold text-slate-900 mr-2">{index + 1}.</span>{career.name}</span>
                                <Badge variant="outline">{career.students} élève{career.students > 1 ? 's' : ''}</Badge>
                              </li>
                            ))}
                          </ol>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="programs" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Formations référencées ({overview.programs.length})</CardTitle></CardHeader>
                    <CardContent>
                      {overview.programs.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          Aucune formation n'est encore référencée pour votre établissement. Envoyez la liste de vos formations à
                          {' '}<a className="text-blue-600 hover:underline" href="mailto:contact@cleavenir.com">contact@cleavenir.com</a>
                          {' '}pour qu'elles soient proposées aux élèves.
                        </p>
                      ) : (
                        <ul className="divide-y">
                          {overview.programs.map((program) => (
                            <li key={program.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className="font-medium text-slate-900">{program.name}</span>
                              <span className="text-sm text-slate-500">{[program.level, program.sector].filter(Boolean).join(' · ')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="staff" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Accès de l'équipe</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-500">
                        Les emails ajoutés ici peuvent se connecter à cet espace (bouton « Créer mon accès » sur la page de connexion).
                      </p>
                      <form onSubmit={addStaff} className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="collegue@etablissement.fr"
                          aria-label="Email du membre de l'équipe"
                        />
                        <Button type="submit" disabled={staffBusy || !newEmail.trim()} className="gap-2">
                          <UserPlus className="h-4 w-4" /> Ajouter
                        </Button>
                      </form>
                      <ul className="divide-y">
                        {overview.staff.map((member) => {
                          const isMe = member.email.toLowerCase() === myEmail;
                          return (
                            <li key={member.id} className="py-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="text-sm text-slate-900 truncate">{member.email}</span>
                                {isMe && <Badge variant="outline">Vous</Badge>}
                                {!member.joined && <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">Invitation en attente</Badge>}
                              </div>
                              {!isMe && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeStaff(member)}
                                  disabled={staffBusy}
                                  aria-label={`Retirer l'accès de ${member.email}`}
                                  className="text-slate-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default EstablishmentDashboard;
