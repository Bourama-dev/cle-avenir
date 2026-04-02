import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Info } from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FEATURES } from '@/constants/subscriptionTiers';
import { isValidUUID } from '@/lib/utils';
import { formationService } from '@/services/formationService';

const FormationDetailPage = ({ findFormationById }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formation, setFormation] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasAccess } = useSubscriptionAccess();
  const hasPremiumAccess = hasAccess(FEATURES.FORMATION_DETAILS);

  useEffect(() => {
    const fetchFormation = async () => {
      setLoading(true);
      setError(null);
      let foundFormation = null;

      try {
        // 1. Try to get from state (navigation from FormationsPage)
        if (location.state?.formation) {
          const raw = location.state.formation;
          const ui = raw.ui_details || {};
          const etab = raw.etablissements?.[0] || {};
          
          foundFormation = {
            id: raw.id_formation || id,
            title: raw.title || raw.libelle_formation,
            school: raw.school || etab.nom || "Établissement non spécifié",
            location: raw.location || etab.ville || raw.ville || "France",
            rating: raw.rating || ui.rating || "4.5",
            reviews: raw.reviews || ui.reviews_count || 12,
            duration: raw.duration || ui.duration || "Variable",
            level: raw.level || ui.level_label || "Non spécifié",
            description: raw.description || "Formation certifiante complète.",
            program: raw.program || (raw.attendus_nationaux ? [raw.attendus_nationaux] : ["Programme détaillé disponible via l'établissement."]),
            price: raw.price || "Voir modalités",
            financing: raw.financing || "Éligible CPF",
            outcomes: raw.outcomes || ui.outcomes || [],
            link: raw.link || raw.lien_formation || "#"
          };
        } 
        // 2. Fallback: Try to find by ID from global list (for direct link access)
        else if (findFormationById) {
          if (!isValidUUID(id)) {
            console.warn(`Invalid UUID provided: ${id}`);
            setError("L'identifiant de la formation est invalide.");
            setLoading(false);
            return;
          }
          foundFormation = await findFormationById(id);
        }

        if (foundFormation) {
           const statsData = await formationService.getFormationStats(foundFormation.id);
           setStats(statsData);
        }
      } catch (err) {
        console.error("Error fetching formation details:", err);
        setError("Une erreur est survenue lors du chargement de la formation.");
      }

      setFormation(foundFormation);
      setLoading(false);
    };

    fetchFormation();
  }, [id, findFormationById, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="container mx-auto px-4 py-16 flex-grow text-center">
          <p className="text-xl text-slate-700">Chargement des détails de la formation...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="container mx-auto px-4 py-16 flex-grow text-center">
          <p className="text-xl text-slate-700">{error || "Formation non trouvée."}</p>
          <Button onClick={() => navigate('/formations')} className="mt-8">Retour aux formations</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const showFullDetails = hasPremiumAccess;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-4xl">
        <Button variant="outline" onClick={() => navigate('/formations')} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Retour aux formations
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{formation.title}</h1>
          <p className="text-lg text-slate-600 mb-6">{formation.school} - {formation.location}</p>

          <div className="flex items-center gap-4 text-slate-500 mb-8">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span>{formation.rating} ({formation.reviews} avis)</span>
            </div>
            <span>•</span>
            <span>{formation.duration}</span>
            <span>•</span>
            <span>{formation.level}</span>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Description de la formation</h2>
            <div className="text-slate-700 leading-relaxed max-w-none prose">
              {formation.description && formation.description.includes('<') ? (
                 <div dangerouslySetInnerHTML={{ __html: formation.description }} />
              ) : (
                 <p>{formation.description}</p>
              )}
            </div>
          </section>

          {showFullDetails ? (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Statistiques de réussite</h2>
                {!stats ? (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-sm">Statistiques non disponibles pour cette formation. Les données d'insertion et de réussite sont en cours d'actualisation.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                      <div className="text-sm text-slate-500 mb-1">Taux de réussite</div>
                      <div className="text-2xl font-bold text-emerald-600">{stats.success_rate ? `${stats.success_rate}%` : 'N/A'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                      <div className="text-sm text-slate-500 mb-1">Insertion pro.</div>
                      <div className="text-2xl font-bold text-blue-600">{stats.employment_rate ? `${stats.employment_rate}%` : 'N/A'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                      <div className="text-sm text-slate-500 mb-1">Salaire moyen</div>
                      <div className="text-2xl font-bold text-indigo-600">{stats.starting_salary ? `${stats.starting_salary}€` : 'N/A'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                      <div className="text-sm text-slate-500 mb-1">Satisfaction</div>
                      <div className="text-2xl font-bold text-amber-500">{stats.satisfaction_rate ? `${stats.satisfaction_rate}/5` : 'N/A'}</div>
                    </div>
                  </div>
                )}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Programme détaillé</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  {(formation.program && formation.program.length > 0) ? formation.program.map((item, index) => (
                    <li key={index}>
                       {typeof item === 'string' && item.includes('<') ? (
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                       ) : item}
                    </li>
                  )) : <li>Programme non détaillé.</li>}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Coût et Financement</h2>
                <p className="text-slate-700 leading-relaxed">
                  Prix : <span className="font-semibold">{formation.price || 'Non communiqué'}</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Financement : {formation.financing || 'Informations de financement non disponibles.'}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Débouchés professionnels</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  {(formation.outcomes && formation.outcomes.length > 0) ? formation.outcomes.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) : <li>Débouchés non spécifiés.</li>}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Contact & Inscription</h2>
                <p className="text-slate-700">
                  Pour plus d'informations ou pour vous inscrire, visitez le site de l'établissement :{' '}
                  <a href={formation.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    {formation.school}
                  </a>
                </p>
              </section>
            </>
          ) : (
            <div className="bg-gradient-to-br from-violet-50 to-purple-100 p-6 rounded-lg text-center shadow-inner mt-10">
              <h3 className="text-2xl font-bold text-violet-800 mb-3">Débloquez tous les détails</h3>
              <p className="text-violet-700 mb-6">
                Accédez au programme complet, aux statistiques de réussite, aux modalités de financement et aux débouchés précis avec l'offre Premium.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200">
                    Voir les options Premium
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-6">
                  <DialogHeader className="text-center">
                    <div className="mx-auto bg-violet-100 p-3 rounded-full w-fit mb-4">
                      <Zap className="h-6 w-6 text-violet-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-slate-900">Accédez aux détails des formations</DialogTitle>
                    <DialogDescription className="text-slate-600 mt-2">
                      Débloquez le prix, la durée, l'école, les statistiques et le programme complet avec Premium.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-3">
                    <ul className="space-y-2 text-sm text-slate-700 text-left">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Détails complets des métiers et salaires</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Statistiques d'insertion (si disponibles)</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Plan d'action illimité</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Analyse de marché en temps réel</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button 
                      onClick={() => navigate('/tarifs')} 
                      className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
                    >
                      Passer à l'action (6€ unique)
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 w-full sm:w-auto">
                      Non merci, je continue sans
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormationDetailPage;