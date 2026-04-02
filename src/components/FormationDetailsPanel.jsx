import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { formationService } from '@/services/formationService';
import { 
  X, ChevronDown, Info, BookOpen, Briefcase, Building, BarChart2, 
  CheckCircle, Users, FileText, Star, GitCompare, Loader2, ArrowRight,
  Clock, DollarSign, TrendingUp, MapPin, Calendar, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import './FormationDetailsPanel.css';

const FormationDetailsPanel = ({ formationId, formationData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data States
  const [relatedCareers, setRelatedCareers] = useState([]);
  const [relatedJobOffers, setRelatedJobOffers] = useState([]);
  const [stats, setStats] = useState(null);

  // Expanded Sections State
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    curriculum: false,
    careers: false,
    jobs: false,
    stats: false,
    prerequisites: false,
    partners: false,
    resources: false,
    reviews: false,
    comparison: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!formationId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // 1. Fetch Related Careers
        const { data: careers, error: careersError } = await supabase
          .from('careers')
          .select('*')
          .contains('required_formations', [formationId])
          .limit(6);

        if (careersError) throw careersError;
        setRelatedCareers(careers || []);

        // 2. Fetch Job Offers
        const { data: jobs, error: jobsError } = await supabase
          .from('job_offers')
          .select('*')
          .contains('required_formations', [formationId])
          .limit(5);

        if (jobsError) throw jobsError;
        setRelatedJobOffers(jobs || []);

        // 3. Fetch Statistics Using Robust Service
        const statistics = await formationService.getFormationStats(formationId);
        setStats(statistics);

      } catch (err) {
        console.error("Error fetching formation details:", err);
        setError("Impossible de charger les détails complets.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [formationId]);

  if (!formationData) return null;

  const { ui_details } = formationData;

  // Icons mapping
  const sections = [
    { id: 'general', title: 'Informations Générales', icon: <Info size={20} /> },
    { id: 'curriculum', title: 'Programme & Compétences', icon: <BookOpen size={20} /> },
    { id: 'careers', title: 'Débouchés Professionnels', icon: <Briefcase size={20} /> },
    { id: 'jobs', title: 'Offres d\'Emploi', icon: <Building size={20} /> },
    { id: 'stats', title: 'Statistiques & Salaire', icon: <BarChart2 size={20} /> },
    { id: 'prerequisites', title: 'Prérequis & Admission', icon: <CheckCircle size={20} /> },
    { id: 'partners', title: 'Entreprises Partenaires', icon: <Users size={20} /> },
    { id: 'resources', title: 'Ressources Pédagogiques', icon: <FileText size={20} /> },
    { id: 'reviews', title: 'Avis & Témoignages', icon: <Star size={20} /> },
    { id: 'comparison', title: 'Comparateur', icon: <GitCompare size={20} /> }
  ];

  return (
    <div className="formation-details-panel" id="details-panel">
      {/* Header */}
      <div className="details-header">
        <div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2">
            {ui_details?.level_label || 'Formation'}
          </Badge>
          <h2>{formationData.libelle_formation}</h2>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span className="flex items-center gap-1"><MapPin size={14} /> {formationData.ville}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {ui_details?.duration}</span>
            <span className="flex items-center gap-1"><Award size={14} /> {ui_details?.certificate}</span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn" aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      {loading && !relatedCareers.length && !stats ? (
        <div className="p-12 text-center text-slate-500">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p>Chargement des détails...</p>
        </div>
      ) : (
        <div className="details-content">
          
          {/* 1. General Info */}
          <Section id="general" expanded={expandedSections.general} onToggle={() => toggleSection('general')} title={sections[0].title} icon={sections[0].icon}>
            <div className="description-box">
              {formationData.description || "Cette formation offre une approche complète et professionnalisante..."}
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Type de formation</div>
                <div className="info-value">{ui_details?.format || "Présentiel"}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Niveau de sortie</div>
                <div className="info-value">{ui_details?.level_label}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Coût moyen</div>
                <div className="info-value">{ui_details?.cost || "Gratuit (Financé)"}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Langue d'enseignement</div>
                <div className="info-value">{ui_details?.language || "Français"}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Durée totale</div>
                <div className="info-value">{ui_details?.total_hours || "Variable"}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Certification</div>
                <div className="info-value text-emerald-600">Reconnue par l'État</div>
              </div>
            </div>
          </Section>

          {/* 2. Curriculum */}
          <Section id="curriculum" expanded={expandedSections.curriculum} onToggle={() => toggleSection('curriculum')} title={sections[1].title} icon={sections[1].icon}>
            <h4 className="font-semibold text-slate-800 mb-4">Modules Principaux</h4>
            <div className="module-list">
              {[
                { name: "Fondamentaux Techniques", hours: "120h", diff: "Moyen" },
                { name: "Projets Pratiques", hours: "80h", diff: "Avancé" },
                { name: "Soft Skills & Communication", hours: "40h", diff: "Débutant" }
              ].map((mod, i) => (
                <div key={i} className="module-card">
                  <div className="module-badge">{i + 1}</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-800">{mod.name}</h5>
                    <p className="text-sm text-slate-500">Module complet incluant théorie et pratique.</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <div className="font-semibold text-indigo-600">{mod.hours}</div>
                    <div>{mod.diff}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="font-semibold text-slate-800 mt-6 mb-3">Compétences visées</h4>
            <div className="skills-grid">
              {ui_details?.outcomes?.map((skill, i) => (
                <div key={i} className="skill-tag">
                  <CheckCircle size={14} /> {skill}
                </div>
              ))}
            </div>
          </Section>

          {/* 3. Career Opportunities */}
          <Section id="careers" expanded={expandedSections.careers} onToggle={() => toggleSection('careers')} title={sections[2].title} icon={sections[2].icon}>
            {relatedCareers.length === 0 ? (
               <EmptyState message="Aucun débouché direct identifié pour le moment." />
            ) : (
              <div className="careers-grid">
                {relatedCareers.map(career => (
                  <div key={career.id} className="career-card">
                    {career.compatibility && (
                      <div className="compatibility-badge">{career.compatibility}% Match</div>
                    )}
                    <h4 className="font-bold text-lg text-slate-800 mb-2">{career.name || career.title}</h4>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{career.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {career.demand_level && (
                        <span className={`demand-badge ${
                          career.demand_level === 'High' ? 'demand-high' : 
                          career.demand_level === 'Medium' ? 'demand-medium' : 'demand-low'
                        }`}>
                          Demande: {career.demand_level}
                        </span>
                      )}
                      {career.growth_rate && (
                         <span className="text-xs bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
                           <TrendingUp size={12} /> {career.growth_rate}
                         </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-slate-700">{career.average_salary ? `${career.average_salary/1000}k€/an` : 'N/A'}</span>
                      <Button variant="link" className="text-indigo-600 p-0 h-auto">Voir détail <ArrowRight size={14} className="ml-1" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 4. Job Offers */}
          <Section id="jobs" expanded={expandedSections.jobs} onToggle={() => toggleSection('jobs')} title={sections[3].title} icon={sections[3].icon}>
            {relatedJobOffers.length === 0 ? (
               <EmptyState message="Aucune offre d'emploi correspondante trouvée actuellement." />
            ) : (
              <div className="job-list">
                {relatedJobOffers.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{job.title}</h4>
                        <div className="text-slate-600 font-medium flex items-center gap-2 mt-1">
                          <Building size={14} /> {job.company}
                          {job.type && <span className="job-type-badge">{job.type}</span>}
                        </div>
                      </div>
                      <Button size="sm">Postuler</Button>
                    </div>

                    <div className="job-details-grid">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary_min ? `${job.salary_min/1000}k - ${job.salary_max/1000}k€` : 'Non précisé'}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> Exp: {job.experience_required || 'Débutant'}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {job.days_posted || 1}j</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 5. Statistics */}
          <Section id="stats" expanded={expandedSections.stats} onToggle={() => toggleSection('stats')} title={sections[4].title} icon={sections[4].icon}>
             {!stats ? (
               <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                 <Info className="mx-auto mb-2 opacity-50" />
                 <p>Statistiques non disponibles pour cette formation.</p>
               </div>
             ) : (
               <>
                 <div className="stats-grid">
                   <StatCard label="Étudiants" value={stats.total_students || "N/A"} icon={<Users size={24} />} />
                   <StatCard label="Réussite" value={stats.success_rate ? `${stats.success_rate}%` : "N/A"} icon={<Award size={24} />} />
                   <StatCard label="Insertion" value={stats.employment_rate ? `${stats.employment_rate}%` : "N/A"} icon={<Briefcase size={24} />} />
                   <StatCard label="Satisfaction" value={stats.satisfaction_rate ? `${stats.satisfaction_rate}/5` : "N/A"} icon={<Star size={24} />} />
                 </div>

                 <h4 className="font-semibold text-slate-800 mt-8 mb-4">Évolution Salariale (Moyenne)</h4>
                 <div className="salary-breakdown">
                    <SalaryCard label="Débutant" value={stats.starting_salary || "N/A"} />
                    <SalaryCard label="3 ans exp." value={stats.salary_3years || "N/A"} />
                    <SalaryCard label="5 ans exp." value={stats.salary_5years || "N/A"} highlighted />
                 </div>
               </>
             )}
          </Section>

          {/* 6. Prerequisites */}
          <Section id="prerequisites" expanded={expandedSections.prerequisites} onToggle={() => toggleSection('prerequisites')} title={sections[5].title} icon={sections[5].icon}>
            <div className="prerequisites-list">
              <div className="prerequisite-item">
                <GraduationCap className="text-indigo-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-slate-800">Niveau requis</h5>
                  <p className="text-slate-600">{ui_details?.prerequisites || "Baccalauréat"}</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <FileText className="text-indigo-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-slate-800">Dossier d'admission</h5>
                  <ul className="list-disc pl-4 text-slate-600 text-sm mt-1 space-y-1">
                    <li>CV & Lettre de motivation</li>
                    <li>Relevés de notes</li>
                    <li>Entretien de motivation</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
          
          {/* 7. Partners (Mock) */}
          <Section id="partners" expanded={expandedSections.partners} onToggle={() => toggleSection('partners')} title={sections[6].title} icon={sections[6].icon}>
            <div className="partners-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="partner-card">
                  <div className="partner-logo">Logo</div>
                  <h5 className="font-bold text-slate-800 mb-1">Entreprise {i}</h5>
                  <p className="text-xs text-slate-500 mb-3">Partenaire Recrutement</p>
                  <Button variant="outline" size="sm" className="w-full">Visiter</Button>
                </div>
              ))}
            </div>
          </Section>

          {/* 8, 9, 10 Placeholder Sections for Brevity - fully styled structure provided */}
          <Section id="resources" expanded={expandedSections.resources} onToggle={() => toggleSection('resources')} title={sections[7].title} icon={sections[7].icon}>
            <div className="resources-list">
              <div className="resource-item">
                 <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600">PDF</div>
                 <div>
                   <h5 className="font-semibold">Brochure détaillée</h5>
                   <Button variant="link" className="h-auto p-0 text-xs">Télécharger</Button>
                 </div>
              </div>
              <div className="resource-item">
                 <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600">Vid</div>
                 <div>
                   <h5 className="font-semibold">Présentation vidéo</h5>
                   <Button variant="link" className="h-auto p-0 text-xs">Regarder</Button>
                 </div>
              </div>
            </div>
          </Section>
          
          <Section id="reviews" expanded={expandedSections.reviews} onToggle={() => toggleSection('reviews')} title={sections[8].title} icon={sections[8].icon}>
             <div className="reviews-list">
                <div className="review-card">
                   <div className="flex justify-between mb-2">
                     <span className="font-bold text-slate-800">Thomas R.</span>
                     <span className="text-slate-400 text-sm">Il y a 2 mois</span>
                   </div>
                   <div className="flex text-amber-500 mb-2">
                     <Star size={14} fill="currentColor" />
                     <Star size={14} fill="currentColor" />
                     <Star size={14} fill="currentColor" />
                     <Star size={14} fill="currentColor" />
                     <Star size={14} fill="currentColor" />
                   </div>
                   <p className="text-slate-600 text-sm">"Formation très complète, les intervenants sont des pros et ça change tout. Je recommande !"</p>
                </div>
             </div>
          </Section>

          <Section id="comparison" expanded={expandedSections.comparison} onToggle={() => toggleSection('comparison')} title={sections[9].title} icon={sections[9].icon}>
             <div className="comparison-table-wrapper">
               <table className="comparison-table">
                 <thead>
                   <tr>
                     <th>Critères</th>
                     <th>Cette Formation</th>
                     <th>Moyenne Secteur</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="current-formation">
                     <td>Durée</td>
                     <td>{ui_details?.duration}</td>
                     <td>2 ans</td>
                   </tr>
                   <tr>
                     <td>Coût</td>
                     <td>{ui_details?.cost || "Standard"}</td>
                     <td>Variable</td>
                   </tr>
                   <tr className="current-formation">
                     <td>Taux d'emploi</td>
                     <td>{stats?.employment_rate || "N/A"}%</td>
                     <td>82%</td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </Section>

        </div>
      )}
    </div>
  );
};

// Sub-components
const Section = ({ id, expanded, onToggle, title, icon, children }) => (
  <div className="details-section">
    <div className="section-header" onClick={onToggle}>
      <div className="section-title">
        <span className="text-indigo-600">{icon}</span>
        {title}
      </div>
      <ChevronDown className={`toggle-icon ${expanded ? 'open' : ''}`} />
    </div>
    {expanded && <div className="section-content">{children}</div>}
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="text-sm text-slate-500 font-medium mt-1">{label}</div>
  </div>
);

const SalaryCard = ({ label, value, highlighted }) => (
  <div className={`p-4 rounded-lg border ${highlighted ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
    <div className="text-sm text-slate-500 mb-1">{label}</div>
    <div className={`text-xl font-bold ${highlighted ? 'text-indigo-700' : 'text-slate-800'}`}>
      {typeof value === 'number' ? `${value.toLocaleString()}€` : value}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
    <Info className="mx-auto mb-2 opacity-50" />
    <p>{message}</p>
  </div>
);

// Icon component import helper
const GraduationCap = ({ className }) => <BookOpen className={className} />; // Reusing existing for simplicity if not imported

export default FormationDetailsPanel;