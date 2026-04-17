import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Target, User, Briefcase, Info, List, Building } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers : parse plain-text France Travail descriptions into structured sections
   ───────────────────────────────────────────────────────────────────────────── */

const SECTION_META = {
  mission: {
    keywords: ['mission', 'missions', 'poste', 'vos missions', 'description du poste', 'responsabilités', 'activités', 'dans ce rôle', 'ce que vous ferez', 'principales activités'],
    icon: Target,
    color: 'rose',
  },
  profil: {
    keywords: ['profil', 'profil recherché', 'votre profil', 'vous êtes', 'compétences requises', 'compétences', 'qualifications', 'requis', 'exigences', 'attendus'],
    icon: User,
    color: 'blue',
  },
  avantages: {
    keywords: ['avantages', 'rémunération', 'salaire', 'package', 'ce que nous offrons', 'nous offrons', 'pourquoi nous', 'rejoignez-nous', 'conditions'],
    icon: Briefcase,
    color: 'emerald',
  },
  contexte: {
    keywords: ['contexte', 'entreprise', 'notre entreprise', 'qui sommes-nous', 'présentation', 'notre société', 'à propos'],
    icon: Building,
    color: 'violet',
  },
};

const getSectionMeta = (title) => {
  const lower = title.toLowerCase();
  for (const [, meta] of Object.entries(SECTION_META)) {
    if (meta.keywords.some(k => lower.includes(k))) {
      return meta;
    }
  }
  return { icon: List, color: 'slate' };
};

const COLOR_CLASSES = {
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-600',    border: 'border-rose-200',    title: 'text-rose-800',    divider: 'border-rose-100' },
  blue:    { bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200',    title: 'text-blue-800',    divider: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', title: 'text-emerald-800', divider: 'border-emerald-100' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-600',  border: 'border-violet-200',  title: 'text-violet-800',  divider: 'border-violet-100' },
  slate:   { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200',   title: 'text-slate-800',   divider: 'border-slate-100' },
};

const isSectionHeader = (line) => {
  const t = line.trim();
  if (!t || t.length < 3 || t.length > 100) return false;
  // All-caps line (French accentuated caps too)
  if (t === t.toUpperCase() && /[A-ZÀ-ÜÉÈÊËÀÂÎÏÔÙÛÜŒÇa-z]/.test(t) && !/[a-zàâéèêëîïôùûüœç]/.test(t)) return true;
  // Ends with colon
  if (t.endsWith(':')) return true;
  return false;
};

const isBulletLine = (line) => {
  const t = line.trim();
  return /^[-•*·>→▸▶✓✔○●]\s/.test(t) || /^\d+[.)]\s/.test(t);
};

const stripBulletPrefix = (line) =>
  line.trim().replace(/^[-•*·>→▸▶✓✔○●]\s+/, '').replace(/^\d+[.)]\s+/, '');

const parsePlainText = (text) => {
  if (!text) return [];
  // Already HTML — don't double-parse
  if (text.trim().startsWith('<')) return [{ type: 'html', content: text }];

  const lines = text.split('\n');
  const sections = [];
  let current = null;
  let pendingBullets = [];
  let pendingPara = [];

  const flushPara = () => {
    if (pendingPara.length && current) {
      current.blocks.push({ type: 'paragraph', content: pendingPara.join(' ') });
      pendingPara = [];
    }
  };
  const flushBullets = () => {
    if (pendingBullets.length && current) {
      current.blocks.push({ type: 'bullets', items: [...pendingBullets] });
      pendingBullets = [];
    }
  };
  const startSection = (title) => {
    flushPara();
    flushBullets();
    if (current) sections.push(current);
    current = { title, blocks: [] };
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushPara();
      flushBullets();
      continue;
    }

    if (isSectionHeader(line)) {
      startSection(line.replace(/:$/, '').trim());
    } else if (isBulletLine(line)) {
      flushPara();
      if (!current) current = { title: null, blocks: [] };
      pendingBullets.push(stripBulletPrefix(line));
    } else {
      flushBullets();
      if (!current) current = { title: null, blocks: [] };
      pendingPara.push(line);
    }
  }

  if (current) {
    flushPara();
    flushBullets();
    sections.push(current);
  }

  return sections.filter(s => s.blocks.length > 0);
};

/* ─────────────────────────────────────────────────────────────────────────────
   Render helpers
   ───────────────────────────────────────────────────────────────────────────── */

const SectionBlock = ({ section, index }) => {
  const meta   = section.title ? getSectionMeta(section.title) : { icon: List, color: 'slate' };
  const colors = COLOR_CLASSES[meta.color];
  const Icon   = meta.icon;

  return (
    <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
      {section.title && (
        <div className={`flex items-center gap-3 px-5 py-3.5 ${colors.bg} border-b ${colors.divider}`}>
          <div className={`p-1.5 rounded-lg bg-white/70 ${colors.text}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className={`font-bold text-sm uppercase tracking-wide ${colors.title}`}>
            {section.title}
          </h3>
        </div>
      )}
      <div className="px-5 py-4 space-y-3">
        {section.blocks.map((block, bi) => {
          if (block.type === 'paragraph') {
            return (
              <p key={bi} className="text-slate-600 leading-relaxed text-sm md:text-base">
                {block.content}
              </p>
            );
          }
          if (block.type === 'bullets') {
            return (
              <ul key={bi} className="space-y-2">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2.5 text-slate-600 text-sm md:text-base">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')} shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────────────────────────── */

const JobDetailDescription = ({ job }) => {
  const sections = parsePlainText(job.description);
  const hasHtml  = sections.length === 1 && sections[0]?.type === 'html';

  return (
    <div className="space-y-8">
      {/* ── Description du poste ── */}
      <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white pb-6">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg mr-3">
              <FileText className="w-5 h-5" />
            </div>
            Description du poste
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {hasHtml ? (
            /* ── HTML content (well-structured API responses) ── */
            <div
              className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed
                prose-headings:font-bold prose-headings:text-slate-900
                prose-a:text-rose-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-rose-400"
              dangerouslySetInnerHTML={{ __html: sections[0].content }}
            />
          ) : sections.length > 0 ? (
            /* ── Parsed plain-text into structured sections ── */
            <div className="space-y-4">
              {sections.map((section, i) => (
                <SectionBlock key={i} section={section} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">Aucune description disponible pour ce poste.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Compétences requises ── */}
      {job.skills?.length > 0 && (
        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white pb-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Compétences requises
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors px-3 py-1.5 text-sm font-medium"
                >
                  {typeof skill === 'object' ? skill.name : skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Informations complémentaires ── */}
      {(job.contract_type || job.experience_level || job.contract_duration || job.salary_range) && (
        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white pb-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-3">
                <Info className="w-5 h-5" />
              </div>
              Informations complémentaires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.contract_type && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Type de contrat</dt>
                  <dd className="font-semibold text-slate-800">{job.contract_type}</dd>
                </div>
              )}
              {job.experience_level && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Expérience requise</dt>
                  <dd className="font-semibold text-slate-800">{job.experience_level}</dd>
                </div>
              )}
              {job.contract_duration && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Durée / Temps de travail</dt>
                  <dd className="font-semibold text-slate-800">{job.contract_duration}</dd>
                </div>
              )}
              {job.salary_range && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Rémunération</dt>
                  <dd className="font-semibold text-emerald-800">{job.salary_range}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetailDescription;
