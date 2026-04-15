import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Globe, Server, Phone, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { useLegalDocument } from '@/hooks/useLegalDocument';
import DynamicLegalContent from '@/components/legal/DynamicLegalContent';

const LegalPage = () => {
  const navigate = useNavigate();
  const { content: dbContent, loading: dbLoading } = useLegalDocument('mentions');
  return (
    <DynamicLegalContent dbContent={dbContent} loading={dbLoading}>
    <div className="min-h-screen bg-[#080812] text-white">
      <div className="relative overflow-hidden pt-24 pb-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <Globe className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-mono mb-2">Conformite legale — Art. 6 LCEN</p>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Mentions Legales</h1>
              <p className="text-slate-400 max-w-2xl">Informations legales obligatoires conformement a la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l economie numerique.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-slate-600 font-mono">Derniere mise a jour : 08 Avril 2026</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-6">

        <LCard icon={Building2} title="Editeur de la plateforme" color="slate" items={[
          {label:'Raison sociale',value:'CleAvenir SAS'},
          {label:'Forme juridique',value:'Societe par Actions Simplifiee (SAS)'},
          {label:'Capital social',value:'10 000 EUR'},
          {label:'Siege social',value:'123 Rue de l Innovation, 75001 Paris, France'},
          {label:'SIRET',value:'12345678901234'},
          {label:'RCS',value:'Paris B 123 456 789'},
          {label:'TVA intracommunautaire',value:'FR 12 123456789'},
          {label:'Directeur publication',value:'Bourama Diarra, President'},
        ]} />

        <LCard icon={Phone} title="Contact" color="blue" items={[
          {label:'Email general',value:'contact@cleavenir.com',link:'mailto:contact@cleavenir.com'},
          {label:'Support',value:'support@cleavenir.com',link:'mailto:support@cleavenir.com'},
          {label:'DPO / RGPD',value:'dpo@cleavenir.com',link:'mailto:dpo@cleavenir.com'},
          {label:'Securite',value:'security@cleavenir.com',link:'mailto:security@cleavenir.com'},
          {label:'Presse',value:'presse@cleavenir.com',link:'mailto:presse@cleavenir.com'},
        ]} />

        <LCard icon={Server} title="Hebergement" color="emerald" items={[
          {label:'Hebergeur principal',value:'Hostinger International Ltd'},
          {label:'Adresse',value:'61 Lordou Vironos Street, 6023 Larnaca, Chypre'},
          {label:'Base de donnees',value:'Supabase (PostgreSQL) — Frankfurt, UE'},
          {label:'CDN',value:'Cloudflare Inc. — San Francisco, USA'},
          {label:'Paiements',value:'Stripe Inc. — San Francisco, USA'},
        ]} />

        <LCard icon={Shield} title="Propriete intellectuelle" color="violet"
          content="L ensemble des elements du site cleavenir.com (textes, images, logo, base de donnees) sont la propriete exclusive de CleAvenir SAS et proteges par les lois francaises et internationales relatives a la propriete intellectuelle. Toute reproduction non autorisee est considere comme contrefacon conformement aux articles L.335-2 du Code de Propriete Intellectuelle." />

        <LCard icon={Shield} title="Donnees personnelles et RGPD" color="rose"
          content="CleAvenir traite vos donnees conformement au RGPD (UE) 2016/679 et a la loi Informatique et Libertes. Responsable : CleAvenir SAS, 75001 Paris. DPO : dpo@cleavenir.com. Vous disposez de droits d acces, rectification, effacement, portabilite et opposition. Pour exercer ces droits : Parametres → Confidentialite ou contactez le DPO. Reclamations non resolues : CNIL (www.cnil.fr)."
          links={[
            {label:'Politique de confidentialite',to:'/privacy'},
            {label:'Gestion cookies',to:'/gestion-cookies'},
            {label:'Exercer mes droits',to:'/user/rgpd'},
          ]}
        />

        <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
          <h3 className="font-bold text-white mb-3">Politique des cookies</h3>
          <p className="text-sm text-slate-400 mb-4">CleAvenir utilise des cookies necessaires au fonctionnement et, avec votre consentement, des cookies analytiques et marketing.</p>
          <button onClick={() => navigate('/gestion-cookies')} className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Gerer mes preferences <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
          <h3 className="font-bold text-white mb-4">Credits et Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{n:'React',r:'Interface'},{n:'Vite',r:'Build'},{n:'Supabase',r:'Backend'},{n:'Tailwind',r:'Design'},{n:'Stripe',r:'Paiements'},{n:'Lucide',r:'Icones'},{n:'Framer Motion',r:'Animations'},{n:'OpenAI',r:'IA'}].map(t => (
              <div key={t.n} className="text-center p-3 bg-white/[0.02] rounded-xl">
                <p className="font-medium text-white text-sm">{t.n}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">CleAvenir SAS — Tous droits reserves — 2026</p>
          <div className="flex gap-6 text-sm">
            {[{l:'Confidentialite',t:'/privacy'},{l:'CGU',t:'/terms'},{l:'Cookies',t:'/gestion-cookies'}].map(link => (
              <button key={link.t} onClick={() => navigate(link.t)} className="text-slate-500 hover:text-slate-300 transition-colors">{link.l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </DynamicLegalContent>
  );
};

const colorMap = {
  slate: {border:'border-slate-700/50',icon:'bg-slate-800 text-slate-300',label:'text-slate-500'},
  blue: {border:'border-blue-500/20',icon:'bg-blue-500/10 text-blue-400',label:'text-blue-400/70'},
  emerald: {border:'border-emerald-500/20',icon:'bg-emerald-500/10 text-emerald-400',label:'text-emerald-400/70'},
  violet: {border:'border-violet-500/20',icon:'bg-violet-500/10 text-violet-400',label:'text-violet-400/70'},
  rose: {border:'border-rose-500/20',icon:'bg-rose-500/10 text-rose-400',label:'text-rose-400/70'},
};

const LCard = ({ icon: Icon, title, color='slate', items, content, links }) => {
  const c = colorMap[color];
  return (
    <div className={`p-6 bg-white/[0.02] border ${c.border} rounded-2xl`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
        <h2 className="font-bold text-white text-lg">{title}</h2>
      </div>
      {items && <div className="space-y-3">{items.map((item,i) => (
        <div key={i} className="flex flex-wrap items-baseline gap-2 py-2 border-b border-white/[0.04] last:border-0">
          <span className={`text-xs font-medium uppercase tracking-wider w-44 flex-shrink-0 ${c.label}`}>{item.label}</span>
          {item.link ? (
            <a href={item.link} className="text-sm text-white hover:text-blue-300 flex items-center gap-1">{item.value} <ExternalLink className="w-3 h-3" /></a>
          ) : <span className="text-sm text-slate-300">{item.value}</span>}
        </div>
      ))}</div>}
      {content && <p className="text-sm text-slate-400 leading-relaxed">{content}</p>}
      {links && <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/[0.04]">{links.map((link,i) => (
        <a key={i} href={link.to} className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors ${c.label} hover:text-white`}>
          {link.label} <ExternalLink className="w-3 h-3" />
        </a>
      ))}</div>}
    </div>
  );
};

export default LegalPage;
