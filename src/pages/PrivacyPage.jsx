import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Trash2, Mail, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLegalDocument } from '@/hooks/useLegalDocument';
import DynamicLegalContent from '@/components/legal/DynamicLegalContent';

const sections = [
  { id: 'collecte', icon: Database, label: 'Donnees collectees' },
  { id: 'utilisation', icon: Eye, label: 'Utilisation' },
  { id: 'protection', icon: Lock, label: 'Protection' },
  { id: 'droits', icon: UserCheck, label: 'Vos droits' },
  { id: 'suppression', icon: Trash2, label: 'Suppression' },
  { id: 'contact', icon: Mail, label: 'Contact DPO' },
];

const PrivacyPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('collecte');
  const [scrolled, setScrolled] = useState(false);
  const { content: dbContent, loading: dbLoading } = useLegalDocument('confidentialite');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DynamicLegalContent dbContent={dbContent} loading={dbLoading}>
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-950/50 to-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/3 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 text-violet-300 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Mise a jour — Avril 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-violet-200 to-indigo-300 bg-clip-text text-transparent leading-tight">
            Politique de<br />Confidentialite
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CleAvenir s engage a proteger vos donnees personnelles avec le plus haut niveau de securite, conformement au RGPD.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[{value:'RGPD',label:'Conforme'},{value:'100%',label:'Donnees en UE'},{value:'30j',label:'Delai reponse'},{value:'AES-256',label:'Chiffrement'}].map(s => (
              <div key={s.value} className="text-center">
                <div className="text-2xl font-black text-violet-300">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav sticky */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSection === id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">

        <section id="collecte" className="scroll-mt-20">
          <SectionHeader icon={Database} title="Donnees que nous collectons" gradient="from-violet-500 to-indigo-500" number="01" />
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              {cat:'Identite', items:['Prenom, nom','Email','Date de naissance','Telephone']},
              {cat:'Profil', items:['Niveau etudes','Statut professionnel','Region/ville','Centres interet']},
              {cat:'Usage', items:['Resultats tests','Historique sessions','Pages visitees','Interactions Cleo']},
              {cat:'Technique', items:['Adresse IP','Type navigateur','OS','Cookies session']},
            ].map(g => (
              <div key={g.cat} className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-violet-500/30 transition-all">
                <h3 className="font-semibold text-violet-300 text-sm mb-3 uppercase tracking-wider">{g.cat}</h3>
                <ul className="space-y-2">{g.items.map((item,i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />{item}
                  </li>
                ))}</ul>
              </div>
            ))}
          </div>
        </section>

        <section id="utilisation" className="scroll-mt-20">
          <SectionHeader icon={Eye} title="Comment nous utilisons vos donnees" gradient="from-indigo-500 to-blue-500" number="02" />
          <div className="mt-8 space-y-4">
            {[
              {title:"Personnalisation orientation", desc:"Vos donnees alimentent notre algorithme IA pour proposer des metiers, formations et offres adaptees a votre profil."},
              {title:"Amelioration plateforme", desc:"Les donnees d usage anonymisees aident a ameliorer continuellement l experience CleAvenir et les recommandations de Cleo."},
              {title:"Communication", desc:"Avec votre consentement, nous envoyons newsletters, alertes et conseils personnalises adaptes a votre parcours."},
              {title:"Securite et conformite", desc:"Certaines donnees sont conservees pour prevenir la fraude, securiser les comptes et repondre aux obligations legales."},
            ].map((item,i) => (
              <div key={i} className="flex gap-5 p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-indigo-500/30 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors mt-0.5">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="protection" className="scroll-mt-20">
          <SectionHeader icon={Lock} title="Protection et securite" gradient="from-blue-500 to-cyan-500" number="03" />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {icon:'🔒',title:'Chiffrement AES-256',desc:'Donnees chiffrees au repos et en transit via TLS 1.3'},
              {icon:'🇪🇺',title:'Hebergement EU',desc:'Donnees en Europe sur serveurs Supabase Frankfurt'},
              {icon:'🛡️',title:'Tests penetration',desc:'Audits securite reguliers par experts independants'},
              {icon:'🔑',title:'Auth PKCE',desc:'OAuth 2.0 securise avec rotation automatique des tokens'},
              {icon:'📊',title:'Journaux acces',desc:'Chaque acces a vos donnees est enregistre et auditable'},
              {icon:'⏱️',title:'Retention limitee',desc:'Suppression automatique selon politique de conservation'},
            ].map((item,i) => (
              <div key={i} className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-cyan-500/30 transition-all">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="droits" className="scroll-mt-20">
          <SectionHeader icon={UserCheck} title="Vos droits RGPD" gradient="from-cyan-500 to-teal-500" number="04" />
          <div className="mt-8 space-y-3">
            {[
              {droit:"Droit d acces",art:"Art. 15",desc:"Obtenir une copie de toutes vos donnees personnelles."},
              {droit:"Droit de rectification",art:"Art. 16",desc:"Corriger vos donnees inexactes ou incompletes."},
              {droit:"Droit a l effacement",art:"Art. 17",desc:"Demander la suppression de vos donnees."},
              {droit:"Droit a la portabilite",art:"Art. 20",desc:"Recevoir vos donnees dans un format lisible par machine."},
              {droit:"Droit d opposition",art:"Art. 21",desc:"Vous opposer au traitement a des fins marketing."},
              {droit:"Droit a la limitation",art:"Art. 18",desc:"Demander la suspension du traitement de vos donnees."},
            ].map((item,i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-teal-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-teal-400 bg-teal-400/10 px-2 py-1 rounded-lg">{item.art}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{item.droit}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mt-6">
            <span className="text-amber-400 flex-shrink-0">ℹ️</span>
            <p className="text-sm text-amber-200/80">Pour exercer vos droits : Parametres → Confidentialite, ou contactez notre DPO.</p>
          </div>
        </section>

        <section id="suppression" className="scroll-mt-20">
          <SectionHeader icon={Trash2} title="Suppression de vos donnees" gradient="from-teal-500 to-emerald-500" number="05" />
          <div className="mt-8 space-y-4">
            {[
              {step:'1',title:'Soumission',desc:'Via votre espace personnel ou dpo@cleavenir.com',time:'Immediat'},
              {step:'2',title:'Verification identite',desc:'Confirmation pour eviter suppressions frauduleuses',time:'J+1 a J+5'},
              {step:'3',title:'Traitement',desc:'Suppression sur tous nos systemes et sauvegardes',time:'J+5 a J+25'},
              {step:'4',title:'Confirmation',desc:'Email de confirmation de la suppression complete',time:'J+30 max'},
            ].map((item,i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">{item.step}</div>
                  {i < 3 && <div className="w-px h-8 bg-emerald-500/10 mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white text-sm">{item.title}</h3>
                    <span className="text-xs text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded-full">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-20">
          <SectionHeader icon={Mail} title="Contact DPO" gradient="from-emerald-500 to-violet-500" number="06" />
          <div className="mt-8 p-8 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-violet-500/20 rounded-3xl">
            <h3 className="font-bold text-lg text-white mb-2">Delegue a la Protection des Donnees</h3>
            <p className="text-slate-400 text-sm mb-6">Notre DPO repond a toutes vos questions relatives a la protection de vos donnees.</p>
            <div className="space-y-3 mb-6">
              {[{label:'Email',value:'dpo@cleavenir.com'},{label:'Adresse',value:'CleAvenir SAS — 75001 Paris, France'},{label:'Delai',value:'72 heures maximum'}].map(c => (
                <div key={c.label}>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{c.label}</span>
                  <p className="text-sm text-white font-medium">{c.value}</p>
                </div>
              ))}
            </div>
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Contacter la CNIL <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </div>
      <div className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">Politique de confidentialite CleAvenir — v2.0 — Avril 2026 — RGPD (UE) 2016/679</p>
      </div>
    </div>
    </DynamicLegalContent>
  );
};

const SectionHeader = ({ icon: Icon, title, gradient, number }) => (
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

export default PrivacyPage;
