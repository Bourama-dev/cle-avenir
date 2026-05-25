import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Loader2, User, GraduationCap, Heart, ChevronRight, ChevronLeft,
  MapPin, Briefcase, Clock, Wifi, Sun, Banknote,
  ShoppingBag, Monitor, BookOpen, Palette, Wrench, Users, Leaf,
  CheckCircle2, Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERESTS = [
  { value: 'Commerce/Vente', label: 'Commerce / Vente', Icon: ShoppingBag },
  { value: 'Informatique',   label: 'Informatique',      Icon: Monitor     },
  { value: 'Santé',          label: 'Santé',             Icon: Heart       },
  { value: 'Éducation',      label: 'Éducation',         Icon: BookOpen    },
  { value: 'Art/Design',     label: 'Art / Design',      Icon: Palette     },
  { value: 'Ingénierie',     label: 'Ingénierie',        Icon: Wrench      },
  { value: 'Social',         label: 'Social',            Icon: Users       },
  { value: 'Environnement',  label: 'Environnement',     Icon: Leaf        },
];

const CONSTRAINTS = [
  { value: 'Mobilité géographique', label: 'Mobilité géo.',      Icon: MapPin  },
  { value: 'Salaire minimum',       label: 'Salaire minimum',    Icon: Banknote },
  { value: 'Télétravail',           label: 'Télétravail',        Icon: Wifi    },
  { value: 'Horaires flexibles',    label: 'Horaires flexibles', Icon: Clock   },
  { value: 'Travail en extérieur',  label: 'Plein air',          Icon: Sun     },
];

const STUDY_OPTIONS = [
  { value: 'Oui',     label: 'Oui, Bac+5 ou plus',    Icon: GraduationCap, colorKey: 'indigo'  },
  { value: 'Non',     label: 'Non, études courtes',    Icon: Briefcase,     colorKey: 'emerald' },
  { value: 'Indécis', label: 'Je ne sais pas encore', Icon: Sparkles,      colorKey: 'amber'   },
];

const CARD_COLORS = {
  indigo:  { border: 'border-indigo-400', bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: 'text-indigo-500',  iconBg: 'bg-indigo-100'  },
  emerald: { border: 'border-emerald-400',bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500', iconBg: 'bg-emerald-100' },
  amber:   { border: 'border-amber-400',  bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'text-amber-500',   iconBg: 'bg-amber-100'   },
};

const STEPS = [
  { id: 1, label: 'Identité',    Icon: User          },
  { id: 2, label: 'Parcours',    Icon: GraduationCap },
  { id: 3, label: 'Préférences', Icon: Heart         },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepProgress = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const { Icon } = step;
      const done   = current > step.id;
      const active = current === step.id;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
              done   ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' :
              active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-100' :
              'bg-slate-100 text-slate-400',
            )}>
              {done ? <CheckCircle2 size={18} /> : <Icon size={16} />}
            </div>
            <span className={cn(
              'text-xs font-semibold transition-colors',
              active ? 'text-indigo-700' : done ? 'text-indigo-400' : 'text-slate-400',
            )}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              'h-0.5 w-14 mx-1 mb-5 rounded-full transition-all duration-500',
              current > step.id ? 'bg-indigo-400' : 'bg-slate-200',
            )} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const PillToggle = ({ item, selected, onToggle }) => {
  const { Icon, value, label } = item;
  const isSelected = selected.includes(value);
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium',
        'transition-all duration-150 cursor-pointer select-none',
        isSelected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40',
      )}
    >
      <Icon size={14} className={isSelected ? 'text-indigo-500' : 'text-slate-400'} />
      {label}
    </button>
  );
};

const StudyChoiceCard = ({ option, selected, onSelect }) => {
  const { Icon, value, label, colorKey } = option;
  const isSelected = selected === value;
  const c = CARD_COLORS[colorKey];
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'flex-1 flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2',
        'transition-all duration-200 cursor-pointer text-center select-none',
        isSelected
          ? `${c.border} ${c.bg} shadow-md`
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center',
        isSelected ? c.iconBg : 'bg-slate-100',
      )}>
        <Icon size={18} className={isSelected ? c.icon : 'text-slate-400'} />
      </div>
      <span className={cn('text-xs font-semibold leading-tight', isSelected ? c.text : 'text-slate-700')}>
        {label}
      </span>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction,   setDirection]   = useState(1);   // 1 = forward, -1 = backward
  const [isLoading,   setIsLoading]   = useState(false);
  const [isFetching,  setIsFetching]  = useState(true);
  const [isEditing,   setIsEditing]   = useState(false); // profile was already completed

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
    constraints: [],
  });

  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;
      try {
        const { data } = await AuthService.getProfile(user.id);
        if (data) {
          setIsEditing(!!data.profile_completed);
          setFormData({
            first_name:          data.first_name          || '',
            last_name:           data.last_name           || '',
            age:                 data.age_range ? data.age_range.split('-')[0] : '',
            region:              data.region              || '',
            city:                data.city                || '',
            current_status:      data.user_status         || '',
            education_level:     data.education_level     || '',
            education_specialty: data.specialization      || '',
            wants_long_studies:
              data.answers?.wants_long_studies === true  ? 'Oui' :
              data.answers?.wants_long_studies === false ? 'Non' : 'Indécis',
            interests:   data.interests               || [],
            constraints: data.constraints?.selected   || [],
          });
        }
      } catch {
        // silent — non-critical
      } finally {
        setIsFetching(false);
      }
    };
    loadExistingProfile();
  }, [user]);

  const handleChange = (name, value) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleToggle = (type, item) =>
    setFormData(prev => {
      const arr = prev[type] || [];
      return { ...prev, [type]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });

  const goNext = () => { setDirection(1);  setCurrentStep(s => Math.min(s + 1, 3)); };
  const goPrev = () => { setDirection(-1); setCurrentStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      let wantsLongStudiesBool = null;
      if (formData.wants_long_studies === 'Oui')  wantsLongStudiesBool = true;
      if (formData.wants_long_studies === 'Non')  wantsLongStudiesBool = false;

      const ageRange = formData.age ? `${formData.age}-${formData.age}` : null;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id:               user.id,
        first_name:       formData.first_name,
        last_name:        formData.last_name,
        region:           formData.region,
        city:             formData.city,
        education_level:  formData.education_level,
        specialization:   formData.education_specialty,
        user_status:      formData.current_status,
        age_range:        ageRange,
        interests:        formData.interests,
        constraints:      { selected: formData.constraints },
        answers:          { wants_long_studies: wantsLongStudiesBool },
        profile_completed: true,
        updated_at:       new Date().toISOString(),
      }, { onConflict: 'id' });

      if (profileError) throw new Error(profileError.message);

      // Persist pending test results when coming from the orientation test
      const tempAnswers = localStorage.getItem('temp_test_answers');
      const tempScores  = localStorage.getItem('temp_test_scores');
      if (tempAnswers && tempScores) {
        try {
          const parsedScores = JSON.parse(tempScores);
          const testScore = Math.round(
            Object.values(parsedScores).reduce((a, b) => a + b, 0) /
            Math.max(Object.keys(parsedScores).length, 1)
          );
          await supabase.from('test_results').insert({
            user_id:       user.id,
            riasec_profile: parsedScores,
            answers:        JSON.parse(tempAnswers),
            test_score:     testScore,
          });
          localStorage.removeItem('temp_test_answers');
          localStorage.removeItem('temp_test_scores');
        } catch {
          // non-blocking
        }
      }

      toast({ title: isEditing ? 'Profil mis à jour !' : 'Profil enregistré !' });
      navigate(isEditing ? '/dashboard' : '/results', { replace: true });

    } catch (err) {
      toast({
        variant:     'destructive',
        title:       'Erreur de sauvegarde',
        description: err.message || "Une erreur est survenue lors de l'enregistrement.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Build avatar initials from name, fall back to email initial
  const initials = [formData.first_name?.[0], formData.last_name?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  const stepVariants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 44 : -44 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -44 : 44 }),
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50/60 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── Page header with avatar ──────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-200 mx-auto mb-4 select-none">
            {initials}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Modifier votre profil' : 'Finalisez votre profil'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            {isEditing
              ? 'Mettez à jour vos informations à tout moment.'
              : 'Ces informations affinent vos recommandations de parcours.'}
          </p>
        </div>

        {/* ── Step progress indicator ──────────────────────────────────── */}
        <StepProgress current={currentStep} />

        {/* ── Form card ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="relative overflow-hidden" style={{ minHeight: 380 }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="p-6 md:p-8"
                >

                  {/* ────── STEP 1 : Identité & Localisation ────────── */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                          <User size={17} className="text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900 leading-tight">Identité & localisation</h2>
                          <p className="text-xs text-slate-400">Qui êtes-vous et où vous situez-vous ?</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="first_name" className="text-sm font-semibold text-slate-700">Prénom</Label>
                          <Input
                            id="first_name"
                            value={formData.first_name}
                            onChange={e => handleChange('first_name', e.target.value)}
                            placeholder="Jean"
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="last_name" className="text-sm font-semibold text-slate-700">Nom</Label>
                          <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={e => handleChange('last_name', e.target.value)}
                            placeholder="Dupont"
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="age" className="text-sm font-semibold text-slate-700">Âge</Label>
                          <Input
                            id="age"
                            type="number"
                            min="13" max="99"
                            value={formData.age}
                            onChange={e => handleChange('age', e.target.value)}
                            required
                            placeholder="22"
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="current_status" className="text-sm font-semibold text-slate-700">Statut actuel</Label>
                          <Select value={formData.current_status} onValueChange={v => handleChange('current_status', v)}>
                            <SelectTrigger id="current_status" className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Sélectionnez…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Élève">Élève</SelectItem>
                              <SelectItem value="Étudiant">Étudiant</SelectItem>
                              <SelectItem value="En recherche d'emploi">En recherche d'emploi</SelectItem>
                              <SelectItem value="Salarié">Salarié</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="region" className="text-sm font-semibold text-slate-700">Région</Label>
                          <Input
                            id="region"
                            value={formData.region}
                            onChange={e => handleChange('region', e.target.value)}
                            placeholder="Île-de-France"
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-sm font-semibold text-slate-700">Ville</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={e => handleChange('city', e.target.value)}
                            placeholder="Paris"
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────── STEP 2 : Parcours scolaire ──────────────── */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                          <GraduationCap size={17} className="text-violet-600" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900 leading-tight">Parcours scolaire</h2>
                          <p className="text-xs text-slate-400">Votre niveau actuel et vos ambitions</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <Label htmlFor="education_level" className="text-sm font-semibold text-slate-700">
                            Niveau d'études visé ou actuel
                          </Label>
                          <Select value={formData.education_level} onValueChange={v => handleChange('education_level', v)}>
                            <SelectTrigger id="education_level" className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Sélectionnez…" />
                            </SelectTrigger>
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

                        <AnimatePresence>
                          {['Première', 'Terminal', 'Bac+1'].includes(formData.education_level) && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-1.5"
                            >
                              <Label htmlFor="education_specialty" className="text-sm font-semibold text-slate-700">
                                Filière / Spécialité
                              </Label>
                              <Select value={formData.education_specialty} onValueChange={v => handleChange('education_specialty', v)}>
                                <SelectTrigger id="education_specialty" className="bg-slate-50 border-slate-200">
                                  <SelectValue placeholder="Sélectionnez…" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Générale">Générale</SelectItem>
                                  <SelectItem value="STMG">STMG</SelectItem>
                                  <SelectItem value="STI2D">STI2D</SelectItem>
                                  <SelectItem value="ST2S">ST2S</SelectItem>
                                  <SelectItem value="Pro">Professionnelle</SelectItem>
                                  <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700">
                            Envisagez-vous des études longues (Bac+5 ou plus) ?
                          </Label>
                          <div className="flex gap-3">
                            {STUDY_OPTIONS.map(opt => (
                              <StudyChoiceCard
                                key={opt.value}
                                option={opt}
                                selected={formData.wants_long_studies}
                                onSelect={v => handleChange('wants_long_studies', v)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────── STEP 3 : Préférences ─────────────────────── */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                          <Heart size={17} className="text-rose-500" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900 leading-tight">Préférences</h2>
                          <p className="text-xs text-slate-400">Vos centres d'intérêt et vos critères de vie</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-semibold text-slate-700">Centres d'intérêt</Label>
                          {formData.interests.length > 0 && (
                            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {formData.interests.length} sélectionné{formData.interests.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map(item => (
                            <PillToggle
                              key={item.value}
                              item={item}
                              selected={formData.interests}
                              onToggle={v => handleToggle('interests', v)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-semibold text-slate-700">Critères importants</Label>
                          {formData.constraints.length > 0 && (
                            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {formData.constraints.length} sélectionné{formData.constraints.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {CONSTRAINTS.map(item => (
                            <PillToggle
                              key={item.value}
                              item={item}
                              selected={formData.constraints}
                              onToggle={v => handleToggle('constraints', v)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer navigation ──────────────────────────────────────── */}
            <div className="px-6 md:px-8 pb-6 md:pb-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <Button
                type="button"
                variant="ghost"
                onClick={currentStep === 1 ? () => navigate(isEditing ? '/dashboard' : -1) : goPrev}
                className="text-slate-500 hover:text-slate-800 gap-1.5"
              >
                <ChevronLeft size={16} />
                {currentStep === 1 ? 'Annuler' : 'Précédent'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 px-6 shadow-sm"
                >
                  Suivant <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 shadow-md shadow-indigo-200 disabled:opacity-60"
                >
                  {isLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Enregistrement…</>
                  ) : (
                    <><CheckCircle2 size={15} /> {isEditing ? 'Enregistrer les modifications' : 'Découvrir mes résultats'}</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Step progress dots */}
        <div className="flex justify-center gap-2 mt-5">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentStep === s.id ? 'w-6 bg-indigo-600' :
                currentStep >  s.id ? 'w-3 bg-indigo-300' :
                'w-3 bg-slate-200',
              )}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
