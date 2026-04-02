import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import '@/styles/EnhancedSignupForm.css';

const INTERESTS_LIST = [
  "Technologie", "Art & Design", "Science", "Social", "Commerce", 
  "Entrepreneuriat", "Santé", "Environnement", "Ingénierie", 
  "Communication", "Éducation", "Finance"
];

const EnhancedSignupForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    status: '', // student, employed, job_seeker, other
    studentLevel: '',
    specialization: '',
    currentJob: '',
    interests: [],
    goals: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Tous les champs sont requis.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.status) {
      setError("Veuillez sélectionner votre statut actuel.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.interests.length < 3) {
      setError("Sélectionnez au moins 3 centres d'intérêt.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);

    try {
      // 1. Sign Up
      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          first_name: formData.fullName.split(' ')[0],
          last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
          full_name: formData.fullName
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Erreur lors de la création de l'utilisateur.");

      // 2. Save enriched profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          professional_status: formData.status,
          education_level: formData.studentLevel, // Mapping studentLevel to education_level
          specialization: formData.specialization,
          current_job: formData.currentJob,
          interests: formData.interests,
          primary_objective: formData.goals,
          completed_at: new Date().toISOString()
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Continue anyway, user is created
      }

      // Success
      navigate('/dashboard');

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-flow-container">
      {/* Progress Indicator */}
      <div className="progress-steps">
        {[1, 2, 3].map(i => (
          <div key={i} className={`step-indicator ${step === i ? 'active' : ''} ${step > i ? 'completed' : ''}`}>
            {step > i ? <CheckCircle size={16} /> : i}
          </div>
        ))}
      </div>

      {/* Step 1: Account Info */}
      {step === 1 && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <h2 className="form-section-title">Créons votre compte</h2>
          <p className="form-section-subtitle">Commencez votre voyage vers une carrière épanouissante.</p>
          
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input 
              type="text" 
              name="fullName"
              className="form-input" 
              placeholder="Jean Dupont"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="jean@exemple.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* Step 2: Status */}
      {step === 2 && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <h2 className="form-section-title">Quelle est votre situation ?</h2>
          <p className="form-section-subtitle">Cela nous aidera à personnaliser votre expérience.</p>
          
          <div className="status-grid mb-6">
            {[
              { id: 'student', label: 'Étudiant', icon: '🎓' },
              { id: 'employed', label: 'En poste', icon: '💼' },
              { id: 'job_seeker', label: 'En recherche', icon: '🔍' },
              { id: 'other', label: 'Autre', icon: '✨' }
            ].map(status => (
              <div 
                key={status.id}
                className={`status-card ${formData.status === status.id ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, status: status.id})}
              >
                <span className="status-icon">{status.icon}</span>
                <span className="font-medium">{status.label}</span>
              </div>
            ))}
          </div>

          {formData.status === 'student' && (
             <div className="form-group animate-in fade-in slide-in-from-top-2">
               <label className="form-label">Niveau d'études actuel</label>
               <select name="studentLevel" className="form-select" value={formData.studentLevel} onChange={handleChange}>
                 <option value="">Sélectionner...</option>
                 <option value="lycee">Lycée</option>
                 <option value="bac">Bac</option>
                 <option value="bac+2">Bac+2 (BTS/DUT)</option>
                 <option value="bac+3">Bac+3 (Licence/Bachelor)</option>
                 <option value="bac+5">Bac+5 (Master/Ingénieur)</option>
               </select>
             </div>
          )}

          {formData.status === 'employed' && (
             <div className="form-group animate-in fade-in slide-in-from-top-2">
               <label className="form-label">Poste actuel</label>
               <input 
                 type="text" 
                 name="currentJob" 
                 className="form-input" 
                 placeholder="Ex: Comptable"
                 value={formData.currentJob} 
                 onChange={handleChange}
               />
             </div>
          )}
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="animate-in slide-in-from-right fade-in duration-300">
          <h2 className="form-section-title">Vos centres d'intérêt</h2>
          <p className="form-section-subtitle">Sélectionnez au moins 3 sujets qui vous passionnent.</p>
          
          <div className="interests-grid">
            {INTERESTS_LIST.map(interest => (
              <button
                key={interest}
                className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="form-group mt-6">
            <label className="form-label">Un objectif particulier ? (Optionnel)</label>
            <textarea 
              name="goals"
              className="form-textarea" 
              rows="3"
              placeholder="Ex: Je veux me reconvertir dans la tech..."
              value={formData.goals}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {error && <div className="error-message text-center mt-4 bg-red-50 p-2 rounded text-red-600 border border-red-100">{error}</div>}

      <div className="nav-buttons">
        {step > 1 && (
          <button className="btn-secondary" onClick={handleBack}>
            <ArrowLeft size={18} className="inline mr-2" /> Retour
          </button>
        )}
        
        {step < 3 ? (
          <button className="btn-primary" onClick={handleNext}>
            Continuer <ArrowRight size={18} className="inline ml-2" />
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Terminer l'inscription"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedSignupForm;