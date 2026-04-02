import React from 'react';
import { interviewService } from '@/services/interviewService';
import { Clock, HelpCircle, Target, User, CheckCircle2 } from 'lucide-react';
import './InterviewSetup.css';

const icons = {
  pitch: <Target size={28} />,
  recruiter: <User size={28} />,
  technical: <HelpCircle size={28} />,
  motivation: <CheckCircle2 size={28} />
};

const InterviewSetup = ({ onStart }) => {
  return (
    <div className="interview-setup-container">
      <div className="setup-header">
        <h1>Simulateur d'Entretien IA</h1>
        <p>Prépare-toi à réussir avec nos simulations réalistes</p>
      </div>

      <div className="cards-grid">
        {Object.entries(interviewService.types).map(([key, type]) => (
          <div key={key} className="interview-card">
            <div className="card-icon">
              {icons[key]}
            </div>
            <h3 className="card-title">{type.name}</h3>
            <p className="card-description">{type.description}</p>
            
            <div className="card-meta">
              <span className="flex items-center gap-1"><Clock size={14}/> {type.duration}</span>
              <span>{type.questionCount} Questions</span>
            </div>

            <button 
              className="start-button"
              onClick={() => onStart(key)}
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