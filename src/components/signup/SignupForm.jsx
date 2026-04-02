import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';
import SignupStep3 from './SignupStep3';
import SignupStep4 from './SignupStep4';
import SignupStep5 from './SignupStep5';
import SignupStep6 from './SignupStep6';
import SignupStep7 from './SignupStep7';

import { 
    validateStep1, validateStep2, validateStep3, 
    validateStep4, validateStep5, validateStep6, validateStep7 
} from '@/utils/validateSignupForm';

const STEPS = [
    { id: 1, title: 'Infos de base' },
    { id: 2, title: 'Coordonnées' },
    { id: 3, title: 'Situation' },
    { id: 4, title: 'Domaines' },
    { id: 5, title: 'Objectifs' },
    { id: 6, title: 'Préférences' },
    { id: 7, title: 'Confirmation' }
];

const SignupForm = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { toast } = useToast();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('signup_form_data');
        return saved ? JSON.parse(saved) : {
            firstName: '', lastName: '', email: '', password: '', confirmPassword: '', dateOfBirth: '',
            phone: '', address: '', city: '', postalCode: '', region: '',
            professionalStatus: '', establishmentName: '', educationLevel: '', companyName: '', jobTitle: '',
            interests: [],
            careerGoal: '', targetDate: '', priority: '', notes: '',
            emailNotifications: true, newsletter: false, acceptDataProcessing: false, acceptPrivacy: false,
            acceptTerms: false
        };
    });

    useEffect(() => {
        localStorage.setItem('signup_form_data', JSON.stringify(formData));
    }, [formData]);

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field if exists
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateCurrentStep = () => {
        let validation = { isValid: true, errors: {} };
        
        switch (currentStep) {
            case 1: validation = validateStep1(formData); break;
            case 2: validation = validateStep2(formData); break;
            case 3: validation = validateStep3(formData); break;
            case 4: validation = validateStep4(formData); break;
            case 5: validation = validateStep5(formData); break;
            case 6: validation = validateStep6(formData); break;
            case 7: validation = validateStep7(formData); break;
            default: break;
        }

        setErrors(validation.errors || {});
        return validation.isValid;
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            if (currentStep < 7) {
                setCurrentStep(c => c + 1);
                window.scrollTo(0, 0);
            }
        } else {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez corriger les erreurs avant de continuer."
            });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(c => c - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToStep = (stepId) => {
        // Only allow going back or jumping if previous steps valid (simplified logic here just jumps)
        setCurrentStep(stepId);
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setIsLoading(true);
        try {
            const { data, error } = await signUp(formData.email, formData.password, {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    role: 'user'
                }
            });

            if (error) throw error;

            if (data?.user) {
                // Extended profile update
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        date_of_birth: formData.dateOfBirth,
                        phone: formData.phone,
                        city: formData.city,
                        postal_code: formData.postalCode,
                        region: formData.region,
                        professional_status: formData.professionalStatus,
                        education_level: formData.educationLevel,
                        institution_name: formData.establishmentName,
                        current_job: formData.jobTitle,
                        interests: formData.interests,
                        goals: formData.careerGoal,
                        newsletter_subscribed: formData.newsletter,
                        data_consent: formData.acceptDataProcessing,
                        marketing_consent: formData.newsletter,
                    })
                    .eq('id', data.user.id);

                if (profileError) console.error("Profile update warning:", profileError);

                localStorage.removeItem('signup_form_data');
                toast({ title: "Bienvenue !", description: "Votre compte a été créé avec succès." });
                navigate('/dashboard'); // Or email confirmation page if enabled
            }
        } catch (err) {
            console.error("Signup error:", err);
            toast({
                variant: "destructive",
                title: "Erreur d'inscription",
                description: err.message || "Une erreur est survenue."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const progress = (currentStep / 7) * 100;

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
             {/* Progress Bar */}
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <CardHeader className="pb-2 pt-8">
                <div className="flex justify-between items-center mb-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-slate-500 hover:text-purple-600 -ml-2">
                        <Home className="w-4 h-4 mr-1" /> Accueil
                    </Button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Étape {currentStep} / 7
                    </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-black text-slate-900">
                    {STEPS[currentStep - 1].title}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 pb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 1 && (
                            <SignupStep1 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} />
                        )}
                        {currentStep === 2 && (
                            <SignupStep2 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />
                        )}
                        {currentStep === 3 && (
                            <SignupStep3 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />
                        )}
                        {currentStep === 4 && (
                            <SignupStep4 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />
                        )}
                        {currentStep === 5 && (
                            <SignupStep5 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />
                        )}
                        {currentStep === 6 && (
                            <SignupStep6 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />
                        )}
                        {currentStep === 7 && (
                            <SignupStep7 
                                formData={formData} 
                                handleFieldChange={handleFieldChange} 
                                errors={errors} 
                                onPrev={prevStep} 
                                onSubmit={handleSubmit} 
                                isLoading={isLoading} 
                                onEditStep={goToStep}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export default SignupForm;