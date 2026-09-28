import React, { useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { LEVELS, PERIOD_LABELS, quotaMessage } from '@/services/aiInterviewService';
import { Clock, HelpCircle, Target, User, CheckCircle2, FileText, Sparkles, Mic, BarChart3 } from 'lucide-react';
import './InterviewSetup.css';

const icons = {
  pitch: <Target size={28} />,
  recruiter: <User size={28} />,
  technical: <HelpCircle size={28} />,
  motivation: <CheckCircle2 size={28} />
};

const QUESTION_COUNTS = [3, 5, 6];

const InterviewSetup = ({ onStart, defaultJobTitle = '', prefill = null, quota = null }) => {
  const [jobTitle, setJobTitle] = useState(prefill?.jobTitle || defaultJobTitle);
  const [company, setCompany] = useState(prefill?.company || '');
  const [level, setLevel] = useState(LEVELS[prefill?.level] ? prefill.level : 'junior');
  const [jobOffer, setJobOffer] = useState(prefill?.jobOffer || '');
  const [focus, setFocus] = useState(interviewService.types[prefill?.focus] ? prefill.focus : 'complete');
  const [questionCount, setQuestionCount] = useState(5);

  const quotaReached = quota?.remaining === 0;
  const canStart = !quotaReached && (jobTitle.trim().length > 1 || jobOffer.trim().length > 30);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canStart) return;
    onStart({
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      level,
      jobOffer: jobOffer.trim(),
      focus,
      questionCount,
    });
  };

  return (
    <div className="interview-setup-container">
      <div className="setup-header">
        <h1 className="text-white">Simulateur d'Entretien IA</h1>
        <p>Colle l'offre, parle avec l'IA, reçois ton rapport détaillé.</p>
      </div>

      <div className="steps-row">
        <div className="step-pill"><FileText size={18} /> 1. Décris ton poste</div>
        <div className="step-pill"><Mic size={18} /> 2. Parle avec l'IA</div>
        <div className="step-pill"><BarChart3 size={18} /> 3. Reçois ton rapport</div>
      </div>

      <form className="custom-interview-form" onSubmit={handleSubmit}>
        {prefill?.jobTitle && (
          <p className="prefill-notice">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>
              {prefill.jobOffer ? 'Offre importée' : 'Poste repris de ton profil'} : <strong>{prefill.jobTitle}</strong>
              {prefill.company ? ` · ${prefill.company}` : ''}. Vérifie les infos puis lance l'entretien.
            </span>
          </p>
        )}
        <div className="form-grid">
          <label className="form-field">
            <span>Poste visé *</span>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex : Assistant marketing en alternance"
              maxLength={120}
            />
          </label>
          <label className="form-field">
            <span>Entreprise (optionnel)</span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex : Decathlon"
              maxLength={80}
            />
          </label>
          <label className="form-field">
            <span>Ton niveau</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {Object.entries(LEVELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Type d'entretien</span>
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              <option value="complete">Entretien complet</option>
              {Object.entries(interviewService.types).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>Offre d'emploi (recommandé)</span>
          <textarea
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder="Colle ici le texte de l'offre : l'IA adaptera ses questions aux missions et compétences demandées."
            rows={5}
            maxLength={6000}
          />
        </label>

        {quota && (
          <p className={`quota-line ${quotaReached ? 'quota-line-reached' : ''}`}>
            {quotaReached
              ? quotaMessage(quota)
              : `Entretiens IA restants ${PERIOD_LABELS[quota.period] ?? ''} : ${quota.remaining}/${quota.limit}`.replace(/\s+:/, ' :')}
          </p>
        )}

        <div className="form-footer">
          <div className="question-count">
            <span>Questions :</span>
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                className={`count-chip ${questionCount === n ? 'active' : ''}`}
                onClick={() => setQuestionCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button type="submit" className="start-button start-button-lg" disabled={!canStart}>
            <Sparkles size={18} /> Démarrer mon entretien
          </button>
        </div>
      </form>

      <h2 className="quick-title text-white">Ou lance un entraînement rapide</h2>
      <div className="cards-grid">
        {Object.entries(interviewService.types).map(([key, type]) => (
          <div key={key} className="interview-card">
            <div className="card-icon">
              {icons[key]}
            </div>
            <h3 className="card-title text-white">{type.name}</h3>
            <p className="card-description">{type.description}</p>

            <div className="card-meta">
              <span className="flex items-center gap-1"><Clock size={14}/> {type.duration}</span>
              <span>{type.questionCount} Questions</span>
            </div>

            <button
              className="start-button"
              disabled={quotaReached}
              onClick={() => onStart({
                jobTitle: jobTitle.trim() || defaultJobTitle,
                company: '',
                level,
                jobOffer: '',
                focus: key,
                questionCount: type.questionCount,
              })}
            >
              Commencer
            </button>
          </div>
        ))}
      </div>

      <div className="tips-section">
        <h2>💡 5 Conseils pour réussir</h2>
        <div className="tips-grid">
          <div className="tip-item">
            <CheckCircle2 className="tip-icon" />
            <p>Parle clairement et évite les hésitations.</p>
          </div>
          <div className="tip-item">
            <CheckCircle2 className="tip-icon" />
            <p>Structure tes réponses : Situation, Action, Résultat.</p>
          </div>
          <div className="tip-item">
            <CheckCircle2 className="tip-icon" />
            <p>Sois honnête et authentique.</p>
          </div>
          <div className="tip-item">
            <CheckCircle2 className="tip-icon" />
            <p>Respire et prends ton temps pour répondre.</p>
          </div>
          <div className="tip-item">
            <CheckCircle2 className="tip-icon" />
            <p>Utilise des mots-clés pertinents pour ton secteur.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
