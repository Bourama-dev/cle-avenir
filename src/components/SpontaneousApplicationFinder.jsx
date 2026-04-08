import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Loader2, Building, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CompanyCard = ({ company, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-foreground pr-2">{company.name}</h3>
          <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
            Score: {Math.round(company.score * 100)}%
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex items-center mb-2">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          {company.address}
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Taille:</strong> {company.companySize || 'N/A'}
        </p>
      </div>
      <div className="mt-4 border-t border-border pt-4">
         <p className="text-sm font-semibold text-foreground mb-2">Contact</p>
         {company.contactMode === 'mail' && (
            <a href={`mailto:${company.contactInfo}`} className="text-sm text-primary hover:underline flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Envoyer un e-mail
            </a>
          )}
          {company.contactMode === 'phone' && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Phone className="h-4 w-4 mr-2" /> {company.contactInfo}
            </p>
          )}
          {company.contactMode === 'presentiel' && (
            <p className="text-sm text-muted-foreground flex items-center">
              <Building className="h-4 w-4 mr-2" /> Candidature sur place
            </p>
          )}
      </div>
    </motion.div>
  );
};


const SpontaneousApplicationFinder = ({ onNavigate }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState({ lat: 48.8566, lon: 2.3522 }); // Default to Paris
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCompanies = async (e) => {
    e.preventDefault();
    if (!user) {
      onNavigate('/login');
      toast({title: "Action requise", description: "Veuillez vous connecter pour utiliser cette fonctionnalité."});
      return;
    }

    if (!jobTitle) {
      toast({
        variant: "destructive",
        title: "Champ requis",
        description: "Veuillez entrer un intitulé de poste pour la recherche.",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-companies', {
        body: { jobTitle, lat: location.lat, lon: location.lon },
      });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucune entreprise trouvée pour ces critères. Essayez un autre métier.",
        });
        setCompanies([]);
      } else {
        setCompanies(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: `Impossible de récupérer les entreprises: ${error.message}`,
      });
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Candidatures <span className="gradient-text">Spontanées</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez les entreprises qui recrutent dans votre domaine, même sans offre publiée.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-2xl shadow-md mb-8"
        >
          <form onSubmit={fetchCompanies} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Entrez un métier (ex: Boulanger, Développeur web)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Rechercher
            </Button>
          </form>
           <p className="text-xs text-muted-foreground mt-2">Cette fonctionnalité identifie les entreprises ayant une forte probabilité de recruter pour le poste recherché.</p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {companies.map((company, index) => (
                <CompanyCard 
                  key={company.siret} 
                  company={company} 
                  index={index}
                />
              ))}
            </motion.div>

            {companies.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Prêt à chasser les opportunités ?</h3>
                <p className="text-muted-foreground">Entrez un métier ci-dessus pour commencer votre recherche.</p>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SpontaneousApplicationFinder;