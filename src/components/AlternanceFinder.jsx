import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Loader2, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AlternanceCard from '@/components/alternance-finder/AlternanceCard';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const AlternanceFinder = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(50);
  const [alternances, setAlternances] = useState([]);
  const [savedAlternances, setSavedAlternances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAlternances = useCallback(async (currentSearch, currentLocation, currentRadius, isInitialLoad = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-alternances', {
        body: {
          search: currentSearch || (isInitialLoad ? 'F1201,M1805' : ''),
          location: currentLocation,
          radius: currentRadius,
        }
      });

      if (error) throw error;
      
      const results = data?.matchas?.results || [];

      if (!isInitialLoad && (!results || results.length === 0)) {
        toast({
          title: "Aucun résultat",
          description: "Nous n'avons trouvé aucune alternance pour votre recherche.",
        });
      }
      setAlternances(results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de récupérer les alternances. Veuillez réessayer.",
      });
      console.error("Error fetching alternances:", error);
      setAlternances([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchAlternances(searchTerm, location, radius, true);
  }, []);

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      fetchAlternances(searchTerm, location, radius);
  }

  useEffect(() => {
    const fetchSavedAlternances = async () => {
        if (!user) return;
        const { data } = await supabase.from('saved_alternances').select('alternance_id').eq('user_id', user.id);
        if (data) setSavedAlternances(data.map(item => item.alternance_id));
    };
    fetchSavedAlternances();
  }, [user]);

  const handleSaveAlternance = async (alternance) => {
    if (!user) {
      onNavigate('/auth');
      toast({ title: "Connectez-vous", description: "Vous devez être connecté pour sauvegarder une alternance." });
      return;
    }
    const alternanceId = alternance?.id;
    if (!alternanceId) return;

    const isSaved = savedAlternances.includes(alternanceId);

    if (isSaved) {
      const { error } = await supabase.from('saved_alternances').delete().match({ user_id: user.id, alternance_id: alternanceId });
      if (!error) {
        setSavedAlternances(prev => prev.filter(id => id !== alternanceId));
        toast({ title: "Alternance retirée", description: `${alternance.title} a été retirée de vos favoris.` });
      }
    } else {
      const { error } = await supabase.from('saved_alternances').insert({ user_id: user.id, alternance_id: alternanceId, alternance_details: alternance });
      if (!error) {
        setSavedAlternances(prev => [...prev, alternanceId]);
        toast({ title: "Alternance sauvegardée !", description: `${alternance.title} a été ajoutée à vos favoris.` });
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trouvez votre <span className="gradient-text">Alternance</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Lancez votre carrière en combinant formation théorique et expérience professionnelle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-4 md:p-6 rounded-2xl shadow-md mb-8"
        >
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Métier, compétence (ex: Boulanger, Vente)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Code INSEE (ex: 75056 pour Paris)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="radius" className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                  Rayon de recherche : <span className="font-bold text-primary ml-2">{radius} km</span>
                </Label>
                <Slider
                  id="radius"
                  min={5}
                  max={100}
                  step={5}
                  value={[radius]}
                  onValueChange={(value) => setRadius(value[0])}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full lg:w-auto lg:justify-self-end">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Rechercher
              </Button>
            </div>
          </form>
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
              {alternances.map((alt, index) => (
                <AlternanceCard 
                  key={alt?.id || index} 
                  alternance={alt} 
                  index={index} 
                  isSaved={savedAlternances.includes(alt?.id)}
                  onSave={handleSaveAlternance}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>

            {alternances.length === 0 && !isLoading &&(
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🤷</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Prêt à trouver votre voie ?</h3>
                <p className="text-muted-foreground">Utilisez les champs de recherche ci-dessus pour commencer.</p>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AlternanceFinder;