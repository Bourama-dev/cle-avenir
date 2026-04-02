import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import './InterviewResults.css';

const InterviewResults = ({ sessionData, onRetry }) => {
  const navigate = useNavigate();
  const { answers } = sessionData;

  // Calculate average score
  const totalScore = answers.reduce((acc, curr) => acc + curr.clarity_score + curr.confidence_score, 0);
  const averageScore = Math.round(totalScore / (answers.length * 2));

  let feedbackMsg = "Bon début !";
  let feedbackSub = "Continue de t'entraîner pour progresser.";
  
  if (averageScore >= 80) {
    feedbackMsg = "Excellent travail ! 🎉";
    feedbackSub = "Tu es prêt pour tes entretiens.";
  } else if (averageScore >= 60) {
    feedbackMsg = "Bien joué ! 👍";
    feedbackSub = "Encore quelques ajustements et ce sera parfait.";
  }

  return (
    <div className="results-container">
      <div className="results-content">
        
        {/* Overall Score */}
        <div className="score-header">
          <div className="score-circle">
            <span className="score-value">{averageScore}</span>
            <span className="score-label">Score Global</span>
          </div>
          <h2 className="feedback-message">{feedbackMsg}</h2>
          <p className="feedback-sub">{feedbackSub}</p>
        </div>

        {/* Detailed Review */}
        <div className="answers-review">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Détail de vos réponses</h3>
          
          {answers.map((ans, idx) => (
            <div key={idx} className="answer-item">
              <div className="answer-header">
                <span className="question-title">Question {ans.question_index + 1}</span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {Math.round((ans.clarity_score + ans.confidence_score) / 2)}/100
                </span>
              </div>
              
              <div className="answer-text-box">
                "{ans.user_answer}"
              </div>

              <div className="metrics-grid">
                <div className="metric-bar">
                  <span className="metric-label">Clarté ({ans.clarity_score}%)</span>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${ans.clarity_score}%` }}></div>
                  </div>
                </div>
                <div className="metric-bar">
                  <span className="metric-label">Confiance ({ans.confidence_score}%)</span>
                  <div className="progress-bg">
                    <div className="progress-fill bg-emerald-500" style={{ width: `${ans.confidence_score}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="actions-footer">
          <button className="btn-result btn-retry flex items-center gap-2" onClick={onRetry}>
            <RefreshCw size={18} /> Réessayer
          </button>
          <button className="btn-result btn-dashboard flex items-center gap-2" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={18} /> Tableau de Bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;