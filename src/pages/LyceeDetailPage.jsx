import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Globe, Mail, ArrowLeft, School,
  GraduationCap, Wrench, Cpu, Building2,
  CheckCircle2, ChevronRight, ExternalLink, AlertCircle, RefreshCw,
  BookOpen, Award, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHelmet from '@/components/SEO/PageHelmet';
import { onisepLyceeService, LYCEE_TYPE_LABELS, LYCEE_TYPE_DESCRIPTIONS } from '@/services/onisepLyceeService';

const SERIE_TECHNO = [
  { code: 'STMG',  label: "Sciences et Technologies du Management et de la Gestion",    icon: '📊' },
  { code: 'STI2D', label: "Sciences et Technologies de l'Industrie et du Développement Durable", icon: '🔬' },
  { code: 'ST2S',  label: "Sciences et Technologies de la Santé et du Social",           icon: '🏥' },
  { code: 'STL',   label: "Sciences et Technologies de Laboratoire",                     icon: '🧪' },
  { code: 'STD2A', label: "Sciences et Technologies du Design et des Arts Appliqués",    icon: '🎨' },
  { code: 'STHR',  label: "Sciences et Technologies de l'Hôtellerie et de la Restauration", icon: '🍽️' },
];

const SPECIALITES_GENERALES = [
  'Histoire-Géographie, Géopolitique et Sciences politiques',
  'Humanités, Littérature et Philosophie',
  'Langues, Littératures et Cultures Étrangères et Régionales',
  'Mathématiques',
  'Numérique et Sciences Informatiques',
  'Physique-Chimie',
  'Sciences de la Vie et de la Terre',
  "Sciences de l'Ingénieur",
  'Sciences Économiques et Sociales',
  'Arts (plastiques, musique, théâtre, danse, cinéma)',
  'Éducation physique, pratiques et culture sportives',
];

// Sector keywords used to detect filières in professional school names/nature
const SECTEUR_KEYWORDS = [
  { label: 'Agriculture / Agroalimentaire', keywords: ['agricole', 'agriculture', 'agroalimentaire', 'agronomie', 'viticole', 'horticole'] },
  { label: 'Arts & Industrie graphique', keywords: ['arts graphiques', 'industrie graphique', 'arts appliqués', 'design graphique'] },
  { label: 'Bâtiment / Travaux Publics', keywords: ['bâtiment', 'travaux publics', 'génie civil', 'construction'] },
  { label: 'Commerce / Gestion', keywords: ['commerce', 'gestion', 'vente', 'management', 'comptabilité', 'logistique'] },
  { label: 'Coiffure / Esthétique', keywords: ['coiffure', 'esthétique', 'cosmétique', 'beauté'] },
  { label: 'Électronique / Électrotechnique', keywords: ['électronique', 'électrotechnique', 'électricité', 'énergie'] },
  { label: 'Hôtellerie / Restauration', keywords: ['hôtellerie', 'restauration', 'cuisine', 'alimentation'] },
  { label: 'Informatique / Numérique', keywords: ['informatique', 'numérique', 'systèmes', 'réseaux', 'sti2d'] },
  { label: 'Mécanique / Automobile', keywords: ['mécanique', 'automobile', 'carrosserie', 'moteur', 'transport'] },
  { label: 'Santé / Social', keywords: ['santé', 'social', 'soins', 'médical', 'paramédical'] },
  { label: 'Textile / Mode', keywords: ['mode', 'textile', 'confection', 'habillement'] },
];

const FORMATION_CATEGORIES = [
  { key: 'seconde',   label: 'Seconde',                icon: '📚', match: (l) => l.startsWith('classe de 2de') },
  { key: 'premiere',  label: 'Première',               icon: '📖', match: (l) => l.startsWith('classe de 1re') || l.startsWith('classe de 1ère') },
  { key: 'bac-gen',   label: 'Bac Général',            icon: '🎓', match: (l) => l === 'bac général' || l.startsWith('bac général ') || l.startsWith('terminale générale') },
  { key: 'bac-tech',  label: 'Bac Technologique',      icon: '⚙️', match: (l) => l.startsWith('bac techno') },
  { key: 'bac-pro',   label: 'Bac Professionnel',      icon: '🔧', match: (l) => l.startsWith('bac pro') },
  { key: 'cap',       label: 'CAP',                    icon: '🛠️', match: (l) => l.startsWith('cap ') || l === 'cap' },
  { key: 'bpjeps',    label: 'BPJEPS / Brevet pro',    icon: '🏅', match: (l) => l.startsWith('bpjeps') || l.startsWith('bp ') || l.startsWith('brevet professionnel') },
  { key: 'mc',        label: 'Mention Complémentaire', icon: '✨', match: (l) => l.startsWith('mc ') || l.startsWith('mention complémentaire') },
  { key: 'other',     label: 'Autres formations',      icon: '📋', match: () => true },
];

const CATEGORY_STYLES = {
  seconde:    { badge: 'bg-slate-50 text-slate-700 border-slate-200',      header: 'text-slate-500'    },
  premiere:   { badge: 'bg-slate-50 text-slate-700 border-slate-200',      header: 'text-slate-500'    },
  'bac-gen':  { badge: 'bg-blue-50 text-blue-700 border-blue-200',         header: 'text-blue-600'     },
  'bac-tech': { badge: 'bg-violet-50 text-violet-700 border-violet-200',   header: 'text-violet-600'   },
  'bac-pro':  { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',header: 'text-emerald-600'  },
  cap:        { badge: 'bg-orange-50 text-orange-700 border-orange-200',   header: 'text-orange-600'   },
  bpjeps:     { badge: 'bg-amber-50 text-amber-700 border-amber-200',      header: 'text-amber-600'    },
  mc:         { badge: 'bg-pink-50 text-pink-700 border-pink-200',         header: 'text-pink-600'     },
  other:      { badge: 'bg-gray-50 text-gray-600 border-gray-200',         header: 'text-gray-500'     },
};

function classifyFormation(libelle) {
  const l = (libelle || '').toLowerCase().trim();
  for (const cat of FORMATION_CATEGORIES) {
    if (cat.match(l)) return cat.key;
  }
  return 'other';
}

function cleanFormationLabel(catKey, libelle) {
  const l = (libelle || '').trim();
  // For bac techno: extract "SERIE — enseignement spécifique X" → "SERIE — X"
  if (catKey === 'bac-tech') {
    // "bac techno STMG ... enseignement spécifique gestion et finance" → "STMG — gestion et finance"
    const m = l.match(/^bac\s+techno\s+(\w+)\s+.+?enseignement\s+spécifique\s+(.+)$/i);
    if (m) return `${m[1].toUpperCase()} — ${m[2]}`;
    // "bac techno ST2S sciences et technologies de la santé..." → "ST2S"
    const serie = l.match(/^bac\s+techno\s+(\w+)/i);
    if (serie) return serie[1].toUpperCase();
    return l;
  }
  const prefixes = {
    'bac-pro':  /^bac\s+pro\s+/i,
    'cap':      /^cap\s+/i,
    'seconde':  /^classe\s+de\s+2de\s+/i,
    'premiere': /^(?:classe\s+de\s+1re\s+|classe\s+de\s+1ère\s+)/i,
    'bac-gen':  /^bac\s+général\s*/i,
    'bpjeps':   /^bpjeps\s+spécialité\s+/i,
    'mc':       /^(?:mc|mention\s+complémentaire)\s+/i,
  };
  const pat = prefixes[catKey];
  if (!pat) return l;
  const cleaned = l.replace(pat, '').trim();
  if (!cleaned) return l;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function detectFilieresFromText(text) {
  const lower = text.toLowerCase();
  return SECTEUR_KEYWORDS.filter(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  ).map((s) => s.label);
}

const TYPE_ICON = {
  general: GraduationCap,
  technologique: Cpu,
  polyvalent: GraduationCap,
  professionnel: Wrench,
};

const TYPE_BG = {
  general:       'from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800',
  technologique: 'from-violet-50 to-purple-50 dark:from-slate-900 dark:to-slate-800',
  polyvalent:    'from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800',
  professionnel: 'from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800',
};

const TYPE_ACCENT = {
  general: 'text-blue-600 bg-blue-100',
  technologique: 'text-violet-600 bg-violet-100',
  polyvalent: 'text-indigo-600 bg-indigo-100',
  professionnel: 'text-emerald-600 bg-emerald-100',
};

export default function LyceeDetailPage() {
  const { uai } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [lycee, setLycee] = useState(location.state?.lycee ?? null);
  const [loading, setLoading] = useState(!location.state?.lycee);
  const [error, setError] = useState(null);

  const [formations, setFormations] = useState([]);
  const [formationExtras, setFormationExtras] = useState([]);
  const [formationsLoading, setFormationsLoading] = useState(false);

  // Load lycée data if not passed via navigation state
  useEffect(() => {
    if (lycee) return;
    setLoading(true);
    onisepLyceeService.getLyceeByUai(uai)
      .then((data) => {
        if (!data) setError('Lycée introuvable.');
        else setLycee(data);
      })
      .catch((err) => setError(err?.message ?? 'Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }, [uai, lycee]);

  // Load formations once we have the lycée
  useEffect(() => {
    if (!lycee?.uai) return;
    setFormationsLoading(true);
    onisepLyceeService.getLyceeFormations(lycee.uai)
      .then((data) => {
        setFormations(data.formations ?? []);
        setFormationExtras(data.extras ?? []);
      })
      .catch(() => {})
      .finally(() => setFormationsLoading(false));
  }, [lycee?.uai]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !lycee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-[var(--text-secondary)]">{error ?? 'Lycée introuvable.'}</p>
        <Button variant="outline" onClick={() => navigate('/lycees')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </Button>
      </div>
    );
  }

  const typeInfo = LYCEE_TYPE_DESCRIPTIONS[lycee.type] ?? LYCEE_TYPE_DESCRIPTIONS.general;
  const TypeIcon = TYPE_ICON[lycee.type] ?? Building2;
  const accentClass = TYPE_ACCENT[lycee.type] ?? TYPE_ACCENT.general;
  const bgGradient = TYPE_BG[lycee.type] ?? TYPE_BG.general;

  const mapUrl = lycee.coordonnees
    ? `https://www.openstreetmap.org/?mlat=${lycee.coordonnees.lat}&mlon=${lycee.coordonnees.lon}&zoom=15`
    : null;

  // Detect filières from school name + nature field for professional schools
  const nameAndNature = `${lycee.nom ?? ''} ${lycee.nature ?? ''}`;
  const detectedFilieres = lycee.type === 'professionnel'
    ? detectFilieresFromText(nameAndNature)
    : [];

  // Group formations by smart category, deduplicate by libelle
  const groupedFormations = (() => {
    const groups = {};
    for (const f of formations) {
      const raw = (f.libelle || f.diplome || '').trim();
      if (!raw) continue;
      const key = classifyFormation(raw);
      if (!groups[key]) groups[key] = new Map();
      if (!groups[key].has(raw.toLowerCase())) groups[key].set(raw.toLowerCase(), f);
    }
    return FORMATION_CATEGORIES
      .filter((cat) => groups[cat.key]?.size > 0)
      .map((cat) => ({ ...cat, items: [...groups[cat.key].values()] }));
  })();

  const hasRealFormations = formations.length > 0;

  return (
    <>
      <PageHelmet
        title={`${lycee.nom} — ${LYCEE_TYPE_LABELS[lycee.type] ?? 'Lycée'} | Clé Avenir`}
        description={`${typeInfo.short}. ${lycee.nom}, ${lycee.ville} (${lycee.code_postal}).`}
      />

      <div className="bg-[var(--bg-primary)] pb-16">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className={`bg-gradient-to-br ${bgGradient} border-b border-[var(--border-color)]`}>
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>

            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${accentClass}`}>
                <TypeIcon className="w-7 h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className={`text-xs px-2.5 py-1 border ${accentClass}`}>
                    {typeInfo.icon} {LYCEE_TYPE_LABELS[lycee.type] ?? lycee.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2.5 py-1 border-slate-200 text-slate-600 bg-white">
                    {lycee.statut === 'prive' ? '🔒 Privé' : '🏛️ Public'}
                  </Badge>
                  {lycee.nombre_eleves && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1 border-slate-200 text-slate-600 bg-white">
                      👥 {lycee.nombre_eleves.toLocaleString('fr-FR')} élèves
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                  {lycee.nom}
                </h1>

                <div className="flex items-center gap-1.5 mt-2 text-sm text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>
                    {lycee.adresse && `${lycee.adresse}, `}
                    {lycee.code_postal} {lycee.ville}
                    {lycee.departement && ` — ${lycee.departement}`}
                  </span>
                </div>

                {lycee.nature && lycee.nature !== lycee.type && (
                  <p className="text-xs text-slate-400 mt-1">{lycee.nature}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

          {/* Contact card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-[var(--border-color)] bg-[var(--bg-primary)] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <School className="w-4 h-4 text-slate-500" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid sm:grid-cols-2 gap-3">
                  {lycee.adresse && (
                    <InfoRow icon={MapPin} label="Adresse">
                      {lycee.adresse}, {lycee.code_postal} {lycee.ville}
                    </InfoRow>
                  )}
                  {lycee.telephone && (
                    <InfoRow icon={Phone} label="Téléphone">
                      <a href={`tel:${lycee.telephone}`} className="hover:text-indigo-600 transition-colors">
                        {lycee.telephone}
                      </a>
                    </InfoRow>
                  )}
                  {lycee.email && (
                    <InfoRow icon={Mail} label="Email">
                      <a href={`mailto:${lycee.email}`} className="hover:text-indigo-600 transition-colors break-all">
                        {lycee.email}
                      </a>
                    </InfoRow>
                  )}
                  {lycee.url && (
                    <InfoRow icon={Globe} label="Site web">
                      <a
                        href={lycee.url.startsWith('http') ? lycee.url : `https://${lycee.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 break-all"
                      >
                        {lycee.url} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </InfoRow>
                  )}
                </div>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Voir sur la carte
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Formations / Spécialités / Filières ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-[var(--border-color)] bg-[var(--bg-primary)] rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  {lycee.type === 'professionnel' ? 'Filières et formations' :
                   lycee.type === 'technologique' ? 'Séries technologiques' :
                   'Spécialités et parcours'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">

                {/* Real formations from API */}
                {formationsLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Chargement des formations…
                  </div>
                )}

                {!formationsLoading && hasRealFormations && (
                  <div className="space-y-5">
                    {groupedFormations.map(({ key, label, icon, items }) => {
                      const styles = CATEGORY_STYLES[key] ?? CATEGORY_STYLES.other;
                      return (
                        <div key={key}>
                          <p className={`text-xs font-semibold uppercase tracking-wide mb-2.5 flex items-center gap-1.5 ${styles.header}`}>
                            <span>{icon}</span> {label}
                            <span className="ml-1 normal-case font-normal text-slate-400 text-[11px]">({items.length})</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((f, i) => {
                              const fullLabel = (f.libelle || f.diplome || '').trim();
                              const display = cleanFormationLabel(key, fullLabel);
                              return f.url_onisep ? (
                                <a
                                  key={i}
                                  href={f.url_onisep}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={fullLabel}
                                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${styles.badge} hover:opacity-75 transition-opacity`}
                                >
                                  {display}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-50 shrink-0" />
                                </a>
                              ) : (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  title={fullLabel}
                                  className={`text-xs ${styles.badge}`}
                                >
                                  {display}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Detected filières for professional schools (from school name) */}
                {detectedFilieres.length > 0 && !hasRealFormations && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Filières détectées
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detectedFilieres.map((f) => (
                        <Badge key={f} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Static filières for professional schools */}
                {lycee.type === 'professionnel' && !hasRealFormations && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {typeInfo.description}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Diplômes préparés</p>
                      <div className="flex flex-wrap gap-2">
                        {['Bac Professionnel (3 ans)', 'CAP (2 ans)', 'Mention Complémentaire'].map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 pt-1">
                      Contacte l'établissement ou consulte son site web pour la liste exacte des filières disponibles.
                    </p>
                  </div>
                )}

                {/* Technologique series */}
                {(lycee.type === 'technologique' || lycee.type === 'polyvalent') && !hasRealFormations && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Séries possibles
                    </p>
                    <div className="space-y-2">
                      {SERIE_TECHNO.map((s) => (
                        <div key={s.code} className="flex items-center gap-3 py-2 border-b border-[var(--border-color)] last:border-0">
                          <span className="text-lg w-7 text-center">{s.icon}</span>
                          <div>
                            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">{s.code}</span>
                            <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 pt-3">
                      Les séries effectivement proposées varient selon l'établissement. Contacte le lycée pour confirmation.
                    </p>
                  </div>
                )}

                {/* Général specialties */}
                {(lycee.type === 'general' || lycee.type === 'polyvalent') && !hasRealFormations && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Spécialités disponibles (exemples)
                    </p>
                    <div className="grid sm:grid-cols-2 gap-1.5">
                      {SPECIALITES_GENERALES.map((sp) => (
                        <div key={sp} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {sp}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      Tu choisis 3 spécialités en Première puis 2 en Terminale. L'offre exacte dépend du lycée.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>

          {/* Description de la voie */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card className="border-[var(--border-color)] bg-[var(--bg-primary)] rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {typeInfo.icon} Ce que propose ce lycée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {typeInfo.description}
                </p>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-2">
                    Classes disponibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeInfo.niveaux.map((n) => (
                      <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-2">
                    Après le lycée
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeInfo.debouches.map((d) => (
                      <div key={d} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg px-2.5 py-1">
                        <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conseils pour collégiens */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <Card className="border-indigo-200/60 bg-indigo-50/40 dark:bg-slate-800 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">💡 Conseils pour ton orientation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 text-sm text-[var(--text-secondary)]">
                {lycee.type === 'professionnel' && (
                  <>
                    <Tip>Demande à visiter l'établissement lors des journées portes ouvertes en janvier/février.</Tip>
                    <Tip>Renseigne-toi sur les filières professionnelles proposées (commerce, bâtiment, numérique, santé…).</Tip>
                    <Tip>Le bac pro se prépare en 3 ans avec des stages obligatoires en entreprise — pense à tes centres d'intérêt !</Tip>
                  </>
                )}
                {lycee.type === 'technologique' && (
                  <>
                    <Tip>Chaque série techno est orientée vers un domaine précis : choisis celle qui correspond à ton projet.</Tip>
                    <Tip>Le bac techno mène surtout vers le BTS ou le BUT, mais l'université reste possible.</Tip>
                    <Tip>Visite les journées portes ouvertes pour découvrir les ateliers et équipements du lycée.</Tip>
                  </>
                )}
                {(lycee.type === 'general' || lycee.type === 'polyvalent') && (
                  <>
                    <Tip>En Seconde générale, tu n'as pas encore à choisir ta voie définitivement — profites-en pour explorer !</Tip>
                    <Tip>Vérifie quelles spécialités sont proposées dans ce lycée pour t'assurer que ton projet est possible.</Tip>
                    <Tip>Les lycées ont des profils différents (section sportive, internationale, musicale…) — renseigne-toi.</Tip>
                  </>
                )}
                <Tip>Contacte le lycée par email ou téléphone pour obtenir une plaquette ou visiter les lieux.</Tip>
              </CardContent>
            </Card>
          </motion.div>

          <p className="text-[11px] text-slate-400 text-center">
            Code UAI : {lycee.uai} · Source : Éducation Nationale
          </p>
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <span className="text-xs text-slate-400 block">{label}</span>
        <span className="text-[var(--text-primary)]">{children}</span>
      </div>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
