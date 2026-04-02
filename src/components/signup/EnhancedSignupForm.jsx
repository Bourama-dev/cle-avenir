import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

// Unified Steps
import UnifiedSignupStep1 from './UnifiedSignupStep1';
import UnifiedSignupStep2 from './UnifiedSignupStep2';
import UnifiedSignupStep3 from './UnifiedSignupStep3';
import UnifiedSignupStep4 from './UnifiedSignupStep4';
import UnifiedSignupStep5 from './UnifiedSignupStep5';
import UnifiedSignupStep6 from './UnifiedSignupStep6';
import UnifiedSignupStep7 from './UnifiedSignupStep7';

import ImprovedSignupProgressBar from './ImprovedSignupProgressBar';
import { validateStep } from '@/utils/SignupFormValidation';
import { SignupDataManager } from '@/services/SignupDataManager';
import '@/styles/EnhancedSignupForm.css';

const EnhancedSignupForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Initial State (Updated for 7 steps + Establishment Code)
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('unified_signup_data');
        return saved ? JSON.parse(saved) : {
            // Step 1
            email: '', password: '', passwordConfirm: '', 
            // Step 2
            firstName: '', lastName: '', dateOfBirth: '', phone: '',
            // Step 3
            address: '', city: '', postalCode: '', region: '', country: 'France',
            // Step 4
            status: '', educationLevel: '', fieldOfStudy: '', interests: [],
            // Step 5
            skills: [], careerGoals: '', salaryRange: [30, 60], willingToRelocate: false,
            establishmentCode: '', establishmentId: null, establishmentName: null,
            // Step 6
            workPreferences: { remote: '', pace: '' }, communicationPreferences: { notifications: true, newsletter: false },
            // Step 7
            termsAccepted: false
        };
    });

    useEffect(() => {
        localStorage.setItem('unified_signup_data', JSON.stringify(formData));
    }, [formData]);

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const nextStep = () => {
        const validation = validateStep(step, formData);
        if (validation.isValid) {
            setStep(prev => Math.min(prev + 1, 7));
            setErrors({});
            window.scrollTo(0, 0);
        } else {
            setErrors(validation.errors);
            toast({
                variant: "destructive",
                title: "Attention",
                description: "Veuillez corriger les erreurs avant de continuer."
            });
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        const validation = validateStep(7, formData); // Validate final step (terms)
        if (!validation.isValid) {
             setErrors(validation.errors);
             return;
        }

        setIsLoading(true);
        // Clean up data before sending (e.g. ensure salaryRange is array)
        const cleanData = {
             ...formData,
             salaryRange: Array.isArray(formData.salaryRange) ? formData.salaryRange : [30, 60]
        };

        const result = await SignupDataManager.createAccount(cleanData);
        
        if (result.success) {
            localStorage.removeItem('unified_signup_data');
            toast({
                title: "Bienvenue chez CléAvenir !",
                description: "Votre compte a été créé avec succès.",
                className: "bg-green-50 border-green-200 text-green-900"
            });
            navigate('/dashboard');
        } else {
            toast({
                variant: "destructive",
                title: "Erreur d'inscription",
                description: result.error || "Une erreur est survenue."
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="enhanced-signup-container w-full max-w-3xl mx-auto px-4 sm:px-6">
            <ImprovedSignupProgressBar currentStep={step} totalSteps={7} />

            <Card className="glass-card p-6 md:p-10 shadow-2xl rounded-2xl border-slate-100 bg-white/95 backdrop-blur-xl relative overflow-hidden min-h-[550px]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 opacity-50 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && <UnifiedSignupStep1 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} />}
                        {step === 2 && <UnifiedSignupStep2 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />}
                        {step === 3 && <UnifiedSignupStep3 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />}
                        {step === 4 && <UnifiedSignupStep4 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />}
                        {step === 5 && <UnifiedSignupStep5 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />}
                        {step === 6 && <UnifiedSignupStep6 formData={formData} handleFieldChange={handleFieldChange} errors={errors} onNext={nextStep} onPrev={prevStep} />}
                        {step === 7 && (
                            <UnifiedSignupStep7 
                                formData={formData} 
                                handleFieldChange={handleFieldChange} 
                                errors={errors} 
                                onPrev={prevStep} 
                                onSubmit={handleSubmit} 
                                isLoading={isLoading}
                                setStep={setStep}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default EnhancedSignupForm;