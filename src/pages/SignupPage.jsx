import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SignupProgress from '@/components/signup/SignupProgress';
import UnifiedSignupStep1 from '@/components/signup/UnifiedSignupStep1';
import UnifiedSignupStep2 from '@/components/signup/UnifiedSignupStep2';
import UnifiedSignupStep3 from '@/components/signup/UnifiedSignupStep3';
import UnifiedSignupStep4 from '@/components/signup/UnifiedSignupStep4';
import UnifiedSignupStep5 from '@/components/signup/UnifiedSignupStep5';
import UnifiedSignupStep6 from '@/components/signup/UnifiedSignupStep6';
import UnifiedSignupStep7 from '@/components/signup/UnifiedSignupStep7';

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

  useEffect(() => {
    const saved = localStorage.getItem('signup_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.formData) setFormData(parsed.formData);
      } catch (e) {}
    }
  }, []);

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

    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) newErrors.email = "L email est requis";
      else if (!emailRegex.test(formData.email)) newErrors.email = "Format d email invalide";
      if (!formData.password) newErrors.password = "Le mot de passe est requis";
      else if (formData.password.length < 8) newErrors.password = "8 caracteres minimum";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    if (step === 2) {
      if (!formData.first_name?.trim()) newErrors.first_name = "Prenom requis";
      if (!formData.last_name?.trim()) newErrors.last_name = "Nom requis";
    }
    if (step === 3) {
      if (!formData.region) newErrors.region = "Region requise";
      if (!formData.city?.trim()) newErrors.city = "Ville requise";
    }
    if (step === 4) {
      if (!formData.age) newErrors.age = "Age requis";
      else if (formData.age < 13 || formData.age > 80) newErrors.age = "L age doit etre entre 13 et 80 ans";
      if (!formData.current_status) newErrors.current_status = "Statut requis";
      if (!formData.education_level) newErrors.education_level = "Niveau d etudes requis";
      if (!formData.wants_long_studies) newErrors.wants_long_studies = "Veuillez choisir une option";
    }
    if (step === 5) {
      if (!formData.interests || formData.interests.length === 0) {
        newErrors.interests = "Selectionnez au moins un domaine";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
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
    const { data, error } = await AuthService.signup(formData.email, formData.password, formData);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur d inscription",
        description: error.message === "User already registered"
          ? "Cet email est deja utilise."
          : "Une erreur est survenue lors de la creation de votre compte."
      });
      return;
    }

    localStorage.removeItem('signup_draft');
    toast({ title: "Bienvenue !", description: "Votre profil a ete cree avec succes." });
    navigate('/results');
  };

  const renderStep = () => {
    const props = { formData, handleFieldChange: handleChange, onChange: handleChange, errors };
    switch (currentStep) {
      case 1: return <UnifiedSignupStep1 {...props} />;
      case 2: return <UnifiedSignupStep2 {...props} />;
      case 3: return <UnifiedSignupStep3 {...props} />;
      case 4: return <UnifiedSignupStep4 {...props} />;
      case 5: return <UnifiedSignupStep5 {...props} />;
      case 6: return <UnifiedSignupStep6 {...props} />;
      case 7: return <UnifiedSignupStep7 {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">CleAvenir</h1>
        <p className="mt-2 text-slate-600">Votre parcours d orientation personnalise commence ici.</p>
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
              <ArrowLeft className="w-4 h-4 mr-2" /> Precedent
            </Button>
          ) : <div />}

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creation...</> : "Creer mon compte"}
            </Button>
          )}
        </div>
      </div>

      {currentStep === 1 && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Deja un compte ?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Se connecter
          </Link>
        </p>
      )}
    </div>
  );
};

export default SignupPage;
