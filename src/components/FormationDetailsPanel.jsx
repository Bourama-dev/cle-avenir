import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X, ChevronDown, Info, Briefcase, Users, MapPin, Award, ExternalLink,
  TrendingUp, GraduationCap, Building2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import './FormationDetailsPanel.css';

/* Only real data is shown here:
   - Parcoursup open data (fr-esr-parcoursup) passed in formationData.parcoursup by the parcoursup-api edge function
   - ROME métiers from our rome_metiers table (matched by keywords, clearly labelled as such) */

const STOP_WORDS = new Set([
  'formation', 'licence', 'master', 'bachelor', 'cycle', 'parcours', 'mention', 'diplome', 'diplôme',
  'sciences', 'science', 'sans', 'avec', 'dans', 'pour', 'cursus', 'ingenieur', 'ingénieur',
  'bts', 'but', 'bac', 'classe', 'preparatoire', 'préparatoire', 'ecole', 'école', 'superieur', 'supérieur',
  'specialite', 'spécialité', 'generaliste', 'généraliste', 'etudes', 'études', 'technologie', 'technologies',
]);

const norm = (v) => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const keywordsOf = (...texts) => {
  const seen = new Set();
  texts.join(' ').split(/[^A-Za-zÀ-ÿ]+/).forEach((w) => {
    const n = norm(w);
    if (n.length >= 5 && !STOP_WORDS.has(n) && !STOP_WORDS.has(w.toLowerCase())) seen.add(n);
  });
  return [...seen].sort((a, b) => b.length - a.length).slice(0, 3);
};

const fmt = (n) => (n === null || n === undefined ? null : Number(n).toLocaleString('fr-FR'));
const pct = (n) => (n === null || n === undefined ? null : `${Math.round(Number(n))} %`);

const Section = ({ expanded, onToggle, title, icon, children, badge }) => (
  <div className="details-section">
    <div className="section-header" onClick={onToggle}>
      <div className="section-title">
        <span className="text-indigo-600">{icon}</span>
        {title}
        {badge && <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
      </div>
      <ChevronDown className={`toggle-icon ${expanded ? 'open' : ''}`} />
    </div>
    {expanded && <div className="section-content">{children}</div>}
  </div>
);

const StatCard = ({ label, value, sub, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="text-sm text-slate-500 font-medium mt-1">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
  </div>
);

const Bar = ({ label, value }) => (
  <div className="flex items-center gap-3 mb-2">
    <span className="text-xs text-slate-600 w-40 shrink-0">{label}</span>
    <div className="flex-1 bg-slate-100 rounded-full h-2">
      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
    <span className="text-xs text-slate-500 w-10 text-right">{Math.round(value)} %</span>
  </div>
);

const FormationDetailsPanel = ({ formationData, onClose }) => {
  const [expanded, setExpanded] = useState({ general: true, admission: true, profile: false, careers: true });
  const toggle = (k) => setExpanded((p) => ({ ...p, [k]: !p[k] }));
  const [romes, setRomes] = useState([]);
  const [romesLoading, setRomesLoading] = useState(false);

  const ps = formationData?.parcoursup ?? null;
  const title = formationData?.libelle_formation || '';
  const etab = formationData?.etablissements?.[0];
  const ville = etab?.ville || formationData?.ville;

  const keywords = useMemo(
    () => keywordsOf(title, ps?.detail ?? '', ps?.filiere ?? ''),
    [title, ps?.detail, ps?.filiere],
  );

  useEffect(() => {
    let alive = true;
    if (!keywords.length) { setRomes([]); return undefined; }
    setRomesLoading(true);
    const filter = keywords.map((k) => `libelle.ilike.%${k}%`).join(',');
    supabase
      .from('rome_metiers')
      .select('code, libelle, domain, niveau_etudes')
      .eq('is_active', true)
      .or(filter)
      .limit(6)
      .then(({ data }) => { if (alive) setRomes(data ?? []); })
      .catch(() => { if (alive) setRomes([]); })
      .finally(() => { if (alive) setRomesLoading(false); });
    return () => { alive = false; };
  }, [keywords]);

  if (!formationData) return null;

  const hasAdmission = ps && (ps.capacite !== null || ps.voeux !== null || ps.taux_acces !== null);
  const hasProfile = ps && (ps.pct_bac_general !== null || ps.pct_sans_mention !== null);

  return (
    <div className="formation-details-panel" id="details-panel">
      <div className="details-header">
        <div>
          {ps?.filiere && <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2">{ps.filiere}</Badge>}
          <h2 className="text-white">{title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90 mt-1">
            {etab?.nom && <span className="flex items-center gap-1"><Building2 size={14} /> {etab.nom}</span>}
            {ville && <span className="flex items-center gap-1"><MapPin size={14} /> {ville}</span>}
            {ps?.statut && <span className="flex items-center gap-1"><Award size={14} /> {ps.statut}</span>}
          </div>
        </div>
        <button onClick={onClose} className="close-btn" aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      <div className="details-content">
        <Section expanded={expanded.general} onToggle={() => toggle('general')} title="Informations" icon={<Info size={20} />}>
          {ps?.detail && <div className="description-box">{ps.detail}</div>}
          <div className="info-grid">
            {[
              { label: 'Établissement', value: etab?.nom },
              { label: 'Ville', value: ville },
              { label: 'Département', value: ps?.departement },
              { label: 'Région', value: ps?.region },
              { label: 'Académie', value: ps?.academie },
              { label: 'Statut de l\'établissement', value: ps?.statut },
              { label: 'Sélectivité', value: ps?.selectivite },
              { label: 'Filière', value: ps?.filiere },
            ].filter((i) => i.value).map((item) => (
              <div key={item.label} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>
          {!ps && formationData.description && <div className="description-box">{formationData.description}</div>}
          {formationData.lien && (
            <a
              href={formationData.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Voir la fiche officielle <ExternalLink size={14} />
            </a>
          )}
        </Section>

        {hasAdmission && (
          <Section
            expanded={expanded.admission}
            onToggle={() => toggle('admission')}
            title="Admission (données Parcoursup)"
            icon={<TrendingUp size={20} />}
            badge={ps.session ? `Session ${ps.session}` : undefined}
          >
            <div className="stats-grid">
              {ps.capacite !== null && <StatCard label="Places" value={fmt(ps.capacite)} icon={<Users size={24} />} sub="capacité d'accueil" />}
              {ps.voeux !== null && <StatCard label="Vœux" value={fmt(ps.voeux)} icon={<GraduationCap size={24} />} sub="candidats ayant formulé un vœu" />}
              {ps.admis !== null && <StatCard label="Admis" value={fmt(ps.admis)} icon={<Award size={24} />} sub="candidats acceptés" />}
              {ps.taux_acces !== null && <StatCard label="Taux d'accès" value={pct(ps.taux_acces)} icon={<TrendingUp size={24} />} sub="admis / candidats" />}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Source : Parcoursup, données ouvertes du ministère de l'Enseignement supérieur (campagne {ps.session ?? 'la plus récente'}).
            </p>
          </Section>
        )}

        {hasProfile && (
          <Section expanded={expanded.profile} onToggle={() => toggle('profile')} title="Profil des admis" icon={<Users size={20} />}>
            {[
              ['Bac général', ps.pct_bac_general],
              ['Bac technologique', ps.pct_bac_techno],
              ['Bac professionnel', ps.pct_bac_pro],
              ['Sans mention', ps.pct_sans_mention],
              ['Mention assez bien', ps.pct_mention_ab],
              ['Mention bien', ps.pct_mention_b],
              ['Mention très bien', ps.pct_mention_tb],
              ['Néo-bacheliers', ps.pct_neobacheliers],
              ['Boursiers', ps.pct_boursiers],
              ['Femmes', ps.pct_femmes],
              ['Même académie', ps.pct_meme_academie],
            ].filter(([, v]) => v !== null && v !== undefined).map(([label, v]) => <Bar key={label} label={label} value={v} />)}
            <p className="text-xs text-slate-400 mt-3">Part des candidats admis. Source : Parcoursup.</p>
          </Section>
        )}

        <Section
          expanded={expanded.careers}
          onToggle={() => toggle('careers')}
          title="Métiers ROME en lien"
          icon={<Briefcase size={20} />}
          badge={romes.length ? `${romes.length}` : undefined}
        >
          {romesLoading && <p className="text-sm text-slate-500">Recherche des métiers…</p>}
          {!romesLoading && romes.length === 0 && (
            <p className="text-sm text-slate-500">Aucun métier du référentiel ROME ne correspond directement à l'intitulé de cette formation.</p>
          )}
          {romes.length > 0 && (
            <div className="careers-grid">
              {romes.map((m) => (
                <Link key={m.code} to={`/metier/${m.code}`} className="career-card hover:shadow-md transition-shadow">
                  <h5 className="font-bold text-slate-800">{m.libelle}</h5>
                  <p className="text-xs text-slate-500 mt-1">ROME {m.code}{m.domain ? ` · ${m.domain}` : ''}</p>
                </Link>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">
            Rapprochement par mots-clés ({keywords.join(', ') || 'aucun'}) entre l'intitulé de la formation et les fiches métiers ROME de France Travail. Il ne s'agit pas d'un lien officiel formation-métier.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default FormationDetailsPanel;
