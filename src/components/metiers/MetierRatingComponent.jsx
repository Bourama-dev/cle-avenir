import React, { useState } from 'react';
import { Star, MessageSquare, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useMetierFeedback } from '@/hooks/useMetierFeedback';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const MetierRatingComponent = ({ jobCode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    feedbackStats, 
    userRating, 
    loading, 
    submitting, 
    submitFeedback 
  } = useMetierFeedback(jobCode);

  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Initialize form with existing rating if available
  React.useEffect(() => {
    if (userRating) {
      setSelectedRating(userRating.rating);
      setComment(userRating.comment || '');
    }
  }, [userRating]);

  const handleRatingClick = (rating) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour noter ce métier.",
        variant: "default",
      });
      navigate('/login');
      return;
    }
    setSelectedRating(rating);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast({ title: "Note requise", description: "Veuillez sélectionner une note.", variant: "destructive" });
      return;
    }

    try {
      await submitFeedback(selectedRating, comment);
      toast({
        title: "Merci pour votre avis !",
        description: "Votre retour aide notre algorithme à s'améliorer.",
      });
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer votre avis.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <SkeletonRating />;
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Avis et Pertinence
            </CardTitle>
            <CardDescription className="mt-1">
              Ce métier vous correspond-il vraiment ?
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              {feedbackStats.average} <span className="text-sm text-slate-500 font-normal">/ 5</span>
            </div>
            <div className="text-xs text-slate-500">
              Basé sur {feedbackStats.count} avis
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {userRating && !showForm ? (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Votre note :</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={cn("h-4 w-4", star <= userRating.rating ? "text-amber-500 fill-amber-500" : "text-slate-200")} 
                  />
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              Modifier
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">Sélectionnez une note</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "h-8 w-8 transition-colors", 
                        (hoverRating || selectedRating) >= star 
                          ? "text-amber-500 fill-amber-500" 
                          : "text-slate-200 fill-transparent hover:text-amber-300"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {showForm && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Un commentaire ? (Optionnel)
                  </label>
                  <Textarea 
                    id="comment"
                    placeholder="Qu'est-ce qui vous plaît ou déplaît dans ce métier ?"
                    className="resize-none min-h-[100px] bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  {userRating && (
                    <Button variant="ghost" onClick={() => setShowForm(false)} disabled={submitting}>
                      Annuler
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={submitting || selectedRating === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Send className="h-4 w-4" /> 
                    Envoyer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SkeletonRating = () => (
  <Card className="border-slate-200">
    <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
      <div className="flex justify-between">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="h-24 w-full bg-slate-100 rounded-xl animate-pulse"></div>
    </CardContent>
  </Card>
);

export default MetierRatingComponent;