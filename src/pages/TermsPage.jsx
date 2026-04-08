import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, CreditCard, AlertTriangle, Scale, RefreshCw, ArrowLeft, ChevronDown, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'objet', icon: FileText, label: 'Objet' },
  { id: 'acces', icon: Users, label: 'Acces' },
  { id: 'abonnements', icon: CreditCard, label: 'Abonnements' },
  { id: 'responsabilites', icon: AlertTriangle, label: 'Responsabilites' },
  { id: 'propriete', icon: Scale, label: 'Propriete intellectuelle' },
  { id: 'modifications', icon: RefreshCw, label: 'Modifications' },
];

const TermsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('objet');
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070710] text-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-rose-950/30 to-[#070710] pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-2 text-rose-300 text-sm font-medium mb-6">
            <FileText className="w-4 h-4" /> Version 3.1 — Avril 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-white bg-clip-text text-transparent">Conditions</span>
            <br /><span className="text-white">Generales d Utilisation</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            En utilisant CleAvenir, vous acceptez ces conditions. Elles definissent nos engagements mutuels.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {['📍 Droit francais applicable','🔒 Donnees RGPD','💳 Paiements Stripe'].map(t => (
              <div key={t} className="text-sm text-slate-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#070710]/95 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSection === id ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">

        <section id="objet" className="scroll-mt-20">
          <SH icon={FileText} title="Objet des CGU" gradient="from-rose-500 to-pink-500" number="01" />
          <div className="mt-8 p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <p className="text-slate-400 mb-5">CleAvenir est une plateforme d orientation professionnelle par IA, editee par CleAvenir SAS.</p>
            <h3 className="font-semibold text-white mb-4">La plateforme permet de :</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {['Passer des tests orientation RIASEC','Obtenir des recommandations metiers','Decouvrir des formations adaptees','Interagir avec Cleo, coach IA','Creer CV et lettres de motivation','Simuler des entretiens embauche'].map((item,i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  </div>{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="acces" className="scroll-mt-20">
          <SH icon={Users} title="Acces et inscription" gradient="from-pink-500 to-fuchsia-500" number="02" />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[{emoji:'🎂',title:'Age minimum 13 ans',desc:'Vous devez avoir au moins 13 ans pour creer un compte.'},{emoji:'✉️',title:'Email valide',desc:'Un email valide est requis pour la verification de compte.'},{emoji:'🔐',title:'Mot de passe fort',desc:'8 caracteres minimum avec majuscule et chiffre.'}].map((item,i) => (
              <div key={i} className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="abonnements" className="scroll-mt-20">
          <SH icon={CreditCard} title="Abonnements et tarification" gradient="from-fuchsia-500 to-purple-500" number="03" />
          <div className="mt-8">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {name:'Gratuit',price:'0 EUR/mois',color:'border-slate-700',features:['Test orientation (1x)','Resultats basiques','Explorer les metiers','Blog et ressources']},
                {name:'Premium',price:'9,99 EUR/mois',color:'border-violet-500',badge:'Populaire',features:['Tests illimites','Resultats detailles','Plan personnalise','CV et lettres de motivation']},
                {name:'Premium+',price:'19,99 EUR/mois',color:'border-amber-500',badge:'Complet',features:['Tout Premium','Cleo IA illimite','Simulation entretien','Coach personnalise']},
              ].map(plan => (
                <div key={plan.name} className={`relative p-6 bg-white/[0.03] border rounded-2xl ${plan.color}`}>
                  {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</div>}
                  <h3 className="font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xl font-black text-white mb-4">{plan.price}</p>
                  <ul className="space-y-2">{plan.features.map((f,i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{f}
                    </li>
                  ))}</ul>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                {q:'Comment fonctionne la facturation ?',a:'Facturation mensuelle via Stripe. Facture par email a chaque renouvellement.'},
                {q:'Puis-je annuler a tout moment ?',a:'Oui. L annulation prend effet a la fin de la periode en cours. Aucun remboursement au prorata.'},
                {q:'Y a-t-il une periode d essai ?',a:'Premium : 7 jours gratuits sans CB. Premium+ : 3 jours avec CB non debite si annulation avant.'},
              ].map((item,i) => (
                <div key={i} className="border border-white/[0.06] rounded-xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02]" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-white text-sm">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 pt-3 text-sm text-slate-400 border-t border-white/[0.06]">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="responsabilites" className="scroll-mt-20">
          <SH icon={AlertTriangle} title="Responsabilites" gradient="from-purple-500 to-indigo-500" number="04" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <h3 className="font-bold text-green-400 mb-4">Nos engagements</h3>
              <ul className="space-y-2">{['Disponibilite 99% SLA','Protection donnees','Amelioration IA continue','Support reactif','Information pannes majeures'].map((e,i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-green-400 mt-2 flex-shrink-0" />{e}</li>
              ))}</ul>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <h3 className="font-bold text-red-400 mb-4">Nos limites</h3>
              <ul className="space-y-2">{['Recommandations IA indicatives','Emploi/admission non garanti','Maintenances programmees','Contenu tiers sous responsabilite editeurs','Force majeure exonere'].map((e,i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />{e}</li>
              ))}</ul>
            </div>
          </div>
        </section>

        <section id="propriete" className="scroll-mt-20">
          <SH icon={Scale} title="Propriete intellectuelle" gradient="from-indigo-500 to-blue-500" number="05" />
          <div className="mt-8 space-y-4">
            <p className="text-slate-400">L ensemble des elements CleAvenir (algorithmes, design, textes, logos, BDD metiers) est protege par le droit de la propriete intellectuelle.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                <h3 className="font-semibold text-indigo-300 mb-3">Autorise</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  {['Usage personnel','Telechargement donnees propres','Partage resultats avec mention'].map((e,i) => <li key={i}>✓ {e}</li>)}
                </ul>
              </div>
              <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <h3 className="font-semibold text-red-300 mb-3">Interdit</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  {['Reproduction ou revente','Scraping automatique','Ingenierie inverse algorithmes'].map((e,i) => <li key={i}>✗ {e}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="modifications" className="scroll-mt-20">
          <SH icon={RefreshCw} title="Modifications des CGU" gradient="from-blue-500 to-rose-500" number="06" />
          <div className="mt-8 space-y-4">
            <p className="text-slate-400">CleAvenir peut modifier ces CGU a tout moment. Modifications substantielles notifiees par email avec 30 jours de preavis.</p>
            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <h3 className="font-semibold text-white mb-4">Historique versions</h3>
              {[{v:'v3.1',d:'Avril 2026',c:'Mise a jour cookies, abonnements Premium+'},{v:'v3.0',d:'Janvier 2026',c:'Refonte — Ajout Cleo IA, simulation entretien'},{v:'v2.5',d:'Juillet 2025',c:'RGPD renforce, portabilite donnees'}].map((v,i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded w-12 text-center">{v.v}</span>
                  <span className="text-xs text-slate-500 w-24">{v.d}</span>
                  <span className="text-sm text-slate-300 flex-1">{v.c}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <span>ℹ️</span>
              <p className="text-sm text-blue-200/80">Droit applicable : Droit francais. Juridiction : Tribunaux de Paris.</p>
            </div>
          </div>
        </section>

      </div>
      <div className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">CGU CleAvenir v3.1 — Avril 2026 — Tous droits reserves</p>
      </div>
    </div>
  );
};

const SH = ({ icon: Icon, title, gradient, number }) => (
  <div className="flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs font-mono text-slate-600 mb-0.5">{number}</p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  </div>
);

export default TermsPage;
