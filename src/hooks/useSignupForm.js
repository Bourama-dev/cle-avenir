import { useState, useEffect } from 'react';
import { validateStep, validatePassword } from '@/utils/SignupFormValidation';
import { SignupService } from '@/services/SignupService';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'signup_form_progress';

export const useSignupForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: 'France',
    establishment: null,
    
    role: '',
    education_level: '',
    sector: '',
    experience_years: '',
    region: '',
    interests: [], // Array of IDs
    primary_objective: '',
    data_consent: false,
    marketing_consent: false
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Only restore if not stale (e.g. < 24h) - omitted for simplicity
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error loading saved signup data", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = async () => {
    // Use validateStep instead of validateRequiredFields
    const validation = validateStep(currentStep, formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez corriger les erreurs avant de continuer."
      });
      return;
    }
    
    // Optional: Check email uniqueness here if API available
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    // Validate the current step before submitting
    const validation = validateStep(currentStep, formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await SignupService.registerUser(formData);
      
      // Clear storage on success
      localStorage.removeItem(STORAGE_KEY);
      setSuccessMessage("Votre compte a été créé avec succès !");
      
      // Return true to signal success to component
      return true;

    } catch (error) {
      console.error(error);
      let msg = error.message || "Une erreur est survenue lors de l'inscription.";
      if (msg.includes("already registered")) msg = "Cet email est déjà utilisé.";
      
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: msg
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    currentStep,
    setCurrentStep,
    handleFieldChange,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    isLoading,
    successMessage,
    passwordStrength: validatePassword(formData.password).strength
  };
};