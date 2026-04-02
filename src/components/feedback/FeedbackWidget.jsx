import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Loader2 } from 'lucide-react';
import { feedbackService } from '@/services/feedbackService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FeedbackWidget = ({ metierCode, testId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    helpful: null,
    accuracy: 0,
    chosen: false,
    comment: ''
  });

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive"
      });
      return;
    }

    if (formData.accuracy === 0) {
      toast({
        title: "Note manquante",
        description: "Veuillez attribuer une note (étoiles) avant de soumettre.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const res = await feedbackService.saveFeedback(user.id, testId, metierCode, formData);
    
    if (res.success) {
      setSubmitted(true);
      toast({ title: "Merci pour votre retour !", description: "Votre avis a été enregistré avec succès." });
    } else {
      toast({ title: "Erreur", description: "Impossible d'enregistrer votre avis.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Avis enregistré</h3>
          <p className="text-emerald-700">Merci d'avoir partagé votre opinion ! Cela nous aide à améliorer nos recommandations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg">Donnez votre avis</CardTitle>
        <CardDescription>Votre retour nous permet d'affiner l'algorithme d'orientation.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Accuracy Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            La description de ce métier correspond-elle à vos attentes ?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, accuracy: star })}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 ${formData.accuracy >= star ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Helpful Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cette recommandation vous a-t-elle été utile ?
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.helpful === true ? "default" : "outline"}
              className={formData.helpful === true ? "bg-indigo-600" : ""}
              onClick={() => setFormData({ ...formData, helpful: true })}
            >
              <ThumbsUp className="w-4 h-4 mr-2" /> Oui, utile
            </Button>
            <Button
              type="button"
              variant={formData.helpful === false ? "destructive" : "outline"}
              onClick={() => setFormData({ ...formData, helpful: false })}
            >
              <ThumbsDown className="w-4 h-4 mr-2" /> Non, pas vraiment
            </Button>
          </div>
        </div>

        {/* Chosen Toggle */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <input 
            type="checkbox" 
            id="chosen-toggle"
            checked={formData.chosen}
            onChange={(e) => setFormData({ ...formData, chosen: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label htmlFor="chosen-toggle" className="text-sm font-medium text-slate-800 cursor-pointer">
            J'envisage sérieusement de choisir cette voie
          </label>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Commentaire (optionnel)
          </label>
          <Textarea 
            placeholder="Partagez vos impressions..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="resize-none h-24"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={loading || formData.accuracy === 0 || formData.helpful === null}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Soumettre mon avis
        </Button>

      </CardContent>
    </Card>
  );
};

export default FeedbackWidget;