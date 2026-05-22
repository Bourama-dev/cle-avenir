import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, ArrowRight, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

import SignupProgress from '@/components/signup/SignupProgress';
import ParentalConsentModal from '@/components/signup/ParentalConsentModal';
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
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const isGoogleFlow = searchParams.get('google') === 'true';
  const FIRST_STEP = isGoogleFlow ? 3 : 1;

  const [currentStep, setCurrentStep] = useState(isGoogleFlow ? 3 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showParentalModal, setShowParentalModal] = useState(false);
  const [awaitingParentalConsent, setAwaitingParentalConsent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    dateOfBirth: '',
    parentEmail: '',
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

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Load saved draft — only in normal (non-Google) flow
  useEffect(() => {
    if (isGoogleFlow) return;
    const saved = localStorage.getItem('signup_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.formData) setFormData(parsed.formData);
      } catch (e) {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill name/email from Google metadata once auth is ready
  useEffect(() => {
    if (!isGoogleFlow || authLoading || !user) return;
    const meta = user.user_metadata || {};
    const nameParts = (meta.full_name || '').split(' ');
    setFormData(prev => ({
      ...prev,
      email: user.email || prev.email,
      first_name: meta.given_name || nameParts[0] || prev.first_name,
      last_name: meta.family_name || nameParts.slice(1).join(' ') || prev.last_name,
    }));
  }, [isGoogleFlow, authLoading, user]);

  // Persist draft — only in normal flow
  useEffect(() => {
    if (isGoogleFlow) return;
    localStorage.setItem('signup_draft', JSON.stringify({ currentStep, formData }));
  }, [isGoogleFlow, currentStep, formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !isGoogleFlow) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) newErrors.email = "L email est requis";
      else if (!emailRegex.test(formData.email)) newErrors.email = "Format d email invalide";
      if (!formData.password) newErrors.password = "Le mot de passe est requis";
      else if (formData.password.length < 8) newErrors.password = "8 caracteres minimum";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    if (step === 2 && !isGoogleFlow) {
      if (!formData.first_name?.trim()) newErrors.first_name = "Prenom requis";
      if (!formData.last_name?.trim()) newErrors.last_name = "Nom requis";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date de naissance requise";
      else {
        const age = calculateAge(formData.dateOfBirth);
        if (age < 13) newErrors.dateOfBirth = "Vous devez avoir au moins 13 ans pour créer un compte";
      }
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
    if (!validateStep(currentStep)) return;
    // After step 2: check if under 15 and parental consent not yet collected
    if (currentStep === 2 && !isGoogleFlow && !formData.parentEmail) {
      const age = calculateAge(formData.dateOfBirth);
      if (age !== null && age < 15) {
        setShowParentalModal(true);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleParentalConsent = (parentEmail) => {
    setFormData(prev => ({ ...prev, parentEmail }));
    setShowParentalModal(false);
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, FIRST_STEP));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (isGoogleFlow) {
      if (!user) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Session expirée. Reconnectez-vous.' });
        setIsSubmitting(false);
        navigate('/login');
        return;
      }
      const { error } = await AuthService.completeGoogleProfile(user.id, formData);
      setIsSubmitting(false);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de sauvegarder votre profil. Veuillez réessayer.'
        });
        return;
      }
      toast({ title: 'Profil complété !', description: 'Bienvenue sur CléAvenir !' });
      navigate('/results');
      return;
    }

    // Normal signup flow
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

    // Parental consent required: send request email and show waiting screen
    if (formData.parentEmail && data?.user) {
      await AuthService.createParentalConsentRequest(
        data.user.id,
        formData.parentEmail,
        formData.first_name || formData.firstName
      );
      setAwaitingParentalConsent(true);
      return;
    }

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

  if (awaitingParentalConsent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Demande envoyée !</h2>
          <p className="text-slate-600 leading-relaxed">
            Un email a été envoyé à <strong>{formData.parentEmail}</strong> pour demander l'autorisation parentale.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800 leading-relaxed">
                Votre compte sera activé dès que votre parent ou tuteur légal aura approuvé la demande.
                Le lien est valable <strong>7 jours</strong>.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Des questions ? <a href="mailto:dpo@cleavenir.com" className="text-indigo-600">dpo@cleavenir.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <ParentalConsentModal
      isOpen={showParentalModal}
      childFirstName={formData.first_name || formData.firstName}
      onConfirm={handleParentalConsent}
      onClose={() => setShowParentalModal(false)}
    />
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">CleAvenir</h1>
        {isGoogleFlow ? (
          <p className="mt-2 text-slate-600">Finalisez votre profil pour personnaliser votre expérience.</p>
        ) : (
          <p className="mt-2 text-slate-600">Votre parcours d orientation personnalise commence ici.</p>
        )}
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <SignupProgress currentStep={currentStep} googleFlow={isGoogleFlow} />
        </div>

        {isGoogleFlow && (
          <div className="px-6 pt-4 pb-0">
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-700">
              <span className="text-lg">🔗</span>
              <span>Connecté avec Google · Étapes 1 et 2 complétées automatiquement</span>
            </div>
          </div>
        )}

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
          {currentStep > FIRST_STEP ? (
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
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sauvegarde...</>
                : isGoogleFlow ? "Finaliser mon profil" : "Creer mon compte"}
            </Button>
          )}
        </div>
      </div>

      {!isGoogleFlow && currentStep === 1 && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Deja un compte ?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Se connecter
          </Link>
        </p>
      )}
    </div>
    </>
  );
};

export default SignupPage;
