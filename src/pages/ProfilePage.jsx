import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const INTERESTS_LIST = [
  'Commerce/Vente', 'Informatique', 'Santé', 'Éducation', 
  'Art/Design', 'Ingénierie', 'Social', 'Environnement'
];

const CONSTRAINTS_LIST = [
  'Mobilité géographique', 'Salaire minimum', 'Télétravail', 
  'Horaires flexibles', 'Travail en extérieur'
];

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    region: '',
    city: '',
    education_level: '',
    education_specialty: '',
    current_status: '',
    wants_long_studies: '',
    interests: [],
    constraints: []
  });

  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await AuthService.getProfile(user.id);

        console.log("USER ID:", user.id);
        console.log("PROFILE DATA:", data);
        console.log("PROFILE ERROR:", error);
        if (data) {
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',

            // 🔁 age_range → age
            age: data.age_range 
              ? data.age_range.split('-')[0] 
              : '',

            region: data.region || '',
            city: data.city || '',

            // 🔁 user_status → current_status
            current_status: data.user_status || '',

            education_level: data.education_level || '',

            // 🔁 specialization → education_specialty
            education_specialty: data.specialization || '',

            // 🔁 JSONB → string UI
            wants_long_studies: data.answers?.wants_long_studies === true
              ? 'Oui'
              : data.answers?.wants_long_studies === false
              ? 'Non'
              : 'Indécis',

            // ✅ OK direct
            interests: data.interests || [],

            // 🔁 JSONB → array
            constraints: data.constraints?.selected || []
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadExistingProfile();
  }, [user]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (type, item, checked) => {
    setFormData(prev => {
      const arr = prev[type] || [];
      if (checked) {
        return { ...prev, [type]: [...arr, item] };
      } else {
        return { ...prev, [type]: arr.filter(i => i !== item) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      // Handle boolean conversion for DB
      let wantsLongStudiesBool = null;
      if (formData.wants_long_studies === 'Oui') wantsLongStudiesBool = true;
      else if (formData.wants_long_studies === 'Non') wantsLongStudiesBool = false;

      // 1. Save Profile
      const ageRange = formData.age
  ? `${formData.age}-${formData.age}`
  : null;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,

          first_name: formData.first_name,
          last_name: formData.last_name,

          region: formData.region,
          city: formData.city,

          education_level: formData.education_level,
          specialization: formData.education_specialty,

          user_status: formData.current_status,

          age_range: ageRange,

          interests: formData.interests,

          constraints: {
            selected: formData.constraints
          },

          // ✅ FIX ICI
          answers: {
            wants_long_studies: wantsLongStudiesBool
          },

          profile_completed: true,
          updated_at: new Date().toISOString()

        }, { onConflict: 'id' });

      if (profileError) throw new Error(profileError.message);

      // 2. Save Test Results if they exist in localStorage
      const tempAnswers = localStorage.getItem('temp_test_answers');
      const tempScores = localStorage.getItem('temp_test_scores');

      if (tempAnswers && tempScores) {
        const { error: testError } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            answers: {
              test_answers: JSON.parse(tempAnswers),
              scores: JSON.parse(tempScores)
            }
          });
        
        if (testError) throw new Error(testError.message);
        
        // Clear temp data
        localStorage.removeItem('temp_test_answers');
        localStorage.removeItem('temp_test_scores');
      }

      toast({ title: "Profil enregistré avec succès !" });
      // ✅ navigation sécurisée
      setTimeout(() => {
        navigate('/results');
      }, 500);

    } catch (err) {
      console.error("Profile save error:", err);
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: err.message || "Une erreur est survenue lors de l'enregistrement de votre profil."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-white border-b border-slate-100 rounded-t-xl pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900">Finalisez votre profil</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Ces informations nous permettront d'affiner vos résultats et de vous proposer des parcours adaptés.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Identity & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Prénom</Label>
                  <Input 
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="Jean"
                    className="bg-white text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Nom</Label>
                  <Input 
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Dupont"
                    className="bg-white text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Région</Label>
                  <Input 
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    placeholder="Île-de-France"
                    className="bg-white text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Ville</Label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Paris"
                    className="bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Age & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Âge</Label>
                  <Input 
                    type="number" 
                    min="13" max="99" 
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    required
                    className="bg-white text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Statut actuel</Label>
                  <Select value={formData.current_status} onValueChange={(v) => handleChange('current_status', v)}>
                    <SelectTrigger className="bg-white text-slate-900"><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Élève">Élève</SelectItem>
                      <SelectItem value="Étudiant">Étudiant</SelectItem>
                      <SelectItem value="En recherche d'emploi">En recherche d'emploi</SelectItem>
                      <SelectItem value="Salarié">Salarié</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-800 font-semibold">Niveau d'études visé ou actuel</Label>
                  <Select value={formData.education_level} onValueChange={(v) => handleChange('education_level', v)}>
                    <SelectTrigger className="bg-white text-slate-900"><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Collège">Collège</SelectItem>
                      <SelectItem value="Seconde">Seconde</SelectItem>
                      <SelectItem value="Première">Première</SelectItem>
                      <SelectItem value="Terminal">Terminal</SelectItem>
                      <SelectItem value="Bac+1">Bac+1</SelectItem>
                      <SelectItem value="Bac+2">Bac+2</SelectItem>
                      <SelectItem value="Bac+3+">Bac+3 ou plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {['Première', 'Terminal', 'Bac+1'].includes(formData.education_level) && (
                  <div className="space-y-3">
                    <Label className="text-slate-800 font-semibold">Filière / Spécialité</Label>
                    <Select value={formData.education_specialty} onValueChange={(v) => handleChange('education_specialty', v)}>
                      <SelectTrigger className="bg-white text-slate-900"><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Générale">Générale</SelectItem>
                        <SelectItem value="STMG">STMG</SelectItem>
                        <SelectItem value="STI2D">STI2D</SelectItem>
                        <SelectItem value="ST2S">ST2S</SelectItem>
                        <SelectItem value="Pro">Professionnelle</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Study Length */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Label className="text-slate-800 font-semibold">Envisagez-vous des études longues (Bac+5 ou plus) ?</Label>
                <RadioGroup 
                  value={formData.wants_long_studies} 
                  onValueChange={(v) => handleChange('wants_long_studies', v)}
                  className="flex flex-row gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Oui" id="r1" />
                    <Label htmlFor="r1" className="cursor-pointer text-slate-700">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non" id="r2" />
                    <Label htmlFor="r2" className="cursor-pointer text-slate-700">Non</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Indécis" id="r3" />
                    <Label htmlFor="r3" className="cursor-pointer text-slate-700">Je ne sais pas encore</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Vos centres d'intérêts (plusieurs choix possibles)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {INTERESTS_LIST.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`int-${interest}`} 
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(c) => handleArrayChange('interests', interest, c)}
                      />
                      <Label htmlFor={`int-${interest}`} className="text-sm font-medium cursor-pointer text-slate-700">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Label className="text-slate-800 font-semibold text-lg">Vos critères importants / contraintes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CONSTRAINTS_LIST.map((constraint) => (
                    <div key={constraint} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cst-${constraint}`} 
                        checked={formData.constraints.includes(constraint)}
                        onCheckedChange={(c) => handleArrayChange('constraints', constraint, c)}
                      />
                      <Label htmlFor={`cst-${constraint}`} className="text-sm font-medium cursor-pointer text-slate-700">
                        {constraint}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg mt-8"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                Découvrir mes résultats
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;