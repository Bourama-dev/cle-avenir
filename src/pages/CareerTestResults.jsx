import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateMatches } from '@/lib/matchingAlgorithm';

const CareerTestResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const storedResults = localStorage.getItem('cleavenir_profile_test_results');
    if (storedResults) {
      const answers = JSON.parse(storedResults);
      const matches = calculateMatches(answers);
      setResults(matches);
    } else {
      // Redirect to test if no results found
      navigate('/career-test');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50">
        
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Vos Résultats</h1>
          <p className="text-xl text-slate-600">Voici les métiers qui correspondent le mieux à votre profil.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {results.slice(0, 6).map((match, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-slate-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                    {Math.round(match.matchPercentage)}% Compatible
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{match.title}</h3>
                <p className="text-slate-600 mb-6 line-clamp-3">{match.description}</p>
                
                <Button 
                  onClick={() => navigate(`/career/${match.id}`)} 
                  className="w-full"
                  variant="outline"
                >
                  Voir détails
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-primary hover:bg-primary/90">
            Accéder à mon tableau de bord complet
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CareerTestResults;