import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import SignupProgress from '@/components/signup/SignupProgress';
import SignupStep1 from '@/components/signup/SignupStep1';
import SignupStep2 from '@/components/signup/SignupStep2';
import SignupStep3 from '@/components/signup/SignupStep3';
import SignupStep4 from '@/components/signup/SignupStep4';
import SignupStep5 from '@/components/signup/SignupStep5';
import SignupStep6 from '@/components/signup/SignupStep6';
import SignupStep7 from '@/components/signup/SignupStep7';

const TOTAL_STEPS = 7;

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    region: '',
    city: '',
    age: '',
    current_status: '',
    education_level: '',
    education_specialty: '',
    wants_long_studies: '',
    interests: [],
    constraints: []
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('signup_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.formData) setFormData(parsed.formData);
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('signup_draft', JSON.stringify({ currentStep, formData }));
  }, [currentStep, formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) newErrors.email = "L'email est requis";
      else if (!emailRegex.test(formData.email)) newErrors.email = "Format d'email invalide";
      
      if (!formData.password) newErrors.password = "Le mot de passe est requis";
      else if (formData.password.length < 8) newErrors.password = "8 caractères minimum";
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    if (step === 2) {
      if (!formData.first_name?.trim()) newErrors.first_name = "Prénom requis";
      if (!formData.last_name?.trim()) newErrors.last_name = "Nom requis";
    }

    if (step === 3) {
      if (!formData.region) newErrors.region = "Région requise";
      if (!formData.city?.trim()) newErrors.city = "Ville requise";
    }

    if (step === 4) {
      if (!formData.age) newErrors.age = "Âge requis";
      else if (formData.age < 13 || formData.age > 80) newErrors.age = "L'âge doit être entre 13 et 80 ans";
      
      if (!formData.current_status) newErrors.current_status = "Statut requis";
      if (!formData.education_level) newErrors.education_level = "Niveau d'études requis";
      if (!formData.wants_long_studies) newErrors.wants_long_studies = "Veuillez choisir une option";
    }

    if (step === 5) {
      if (!formData.interests || formData.interests.length === 0) {
        newErrors.interests = "Sélectionnez au moins un domaine";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const { data, error } = await AuthService.signup(
      formData.email,
      formData.password,
      formData
    );

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message === "User already registered" ? "Cet email est déjà utilisé." : "Une erreur est survenue lors de la création de votre compte."
      });
      return;
    }

    // Success
    localStorage.removeItem('signup_draft');
    toast({
      title: "Bienvenue !",
      description: "Votre profil a été créé avec succès."
    });
    navigate('/results');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <SignupStep1 data={formData} onChange={handleChange} errors={errors} />;
      case 2: return <SignupStep2 data={formData} onChange={handleChange} errors={errors} />;
      case 3: return <SignupStep3 data={formData} onChange={handleChange} errors={errors} />;
      case 4: return <SignupStep4 data={formData} onChange={handleChange} errors={errors} />;
      case 5: return <SignupStep5 data={formData} onChange={handleChange} errors={errors} />;
      case 6: return <SignupStep6 data={formData} onChange={handleChange} errors={errors} />;
      case 7: return <SignupStep7 data={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          CléAvenir
        </h1>
        <p className="mt-2 text-slate-600">
          Votre parcours d'orientation personnalisé commence ici.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <SignupProgress currentStep={currentStep} />
        </div>

        <div className="p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrev} className="border-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
            </Button>
          ) : (
            <div></div> // Empty div for spacing
          )}

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...</>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          )}
        </div>
      </div>

      {currentStep === 1 && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Se connecter
          </Link>
        </p>
      )}
    </div>
  );
};

export default SignupPage;