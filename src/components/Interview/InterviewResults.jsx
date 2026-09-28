import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LayoutDashboard, ThumbsUp, TrendingUp, Lightbulb } from 'lucide-react';
import { COMPETENCIES } from '@/services/aiInterviewService';
import './InterviewResults.css';

const scoreColor = (score) => {
  if (score >= 75) return '#10b981';
  if (score >= 55) return '#4f46e5';
  return '#f59e0b';
};

const InterviewResults = ({ report, config, onRetry }) => {
  const navigate = useNavigate();
  const { overall, summary, competencies, strengths, improvements, answers } = report;

  let feedbackMsg = "Bon début !";
  let feedbackSub = "Continue de t'entraîner pour progresser.";

  if (overall >= 80) {
    feedbackMsg = "Excellent travail ! 🎉";
    feedbackSub = "Tu es prêt pour tes entretiens.";
  } else if (overall >= 60) {
    feedbackMsg = "Bien joué ! 👍";
    feedbackSub = "Encore quelques ajustements et ce sera parfait.";
  }

  return (
    <div className="results-container">
      <div className="results-content">

        {/* Overall Score */}
        <div className="score-header">
          <div className="score-circle">
            <span className="score-value">{overall}</span>
            <span className="score-label">Score Global</span>
          </div>
          <h2 className="feedback-message">{feedbackMsg}</h2>
          <p className="feedback-sub">{feedbackSub}</p>
          {config?.jobTitle && (
            <p className="text-sm text-slate-500 mt-2">
              Entretien : <strong>{config.jobTitle}</strong>{config.company ? ` · ${config.company}` : ''}
            </p>
          )}
          {summary && <p className="report-summary">{summary}</p>}
          {!report.aiPowered && (
            <p className="text-xs text-amber-600 mt-3">Analyse simplifiée : l'IA n'était pas disponible pour cette session.</p>
          )}
        </div>

        {/* Competencies */}
        <div className="report-section">
          <h3 className="report-section-title">Scores par compétence</h3>
          <div className="competency-list">
            {COMPETENCIES.map(({ key, label }) => (
              <div key={key} className="metric-bar">
                <span className="metric-label flex justify-between">
                  <span>{label}</span><span>{competencies[key]}/100</span>
                </span>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: `${competencies[key]}%`, background: scoreColor(competencies[key]) }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths / Improvements */}
        {(strengths.length > 0 || improvements.length > 0) && (
          <div className="report-section insights-grid">
            {strengths.length > 0 && (
              <div className="insight-card insight-strengths">
                <h4><ThumbsUp size={18} /> Points forts</h4>
                <ul>{strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            {improvements.length > 0 && (
              <div className="insight-card insight-improvements">
                <h4><TrendingUp size={18} /> Axes d'amélioration</h4>
                <ul>{improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed Review */}
        <div className="answers-review">
          <h3 className="report-section-title">Détail de tes réponses</h3>

          {answers.map((ans, idx) => (
            <div key={idx} className="answer-item">
              <div className="answer-header">
                <span className="question-title">Q{idx + 1}. {ans.question}</span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0 ml-3">
                  {ans.score}/100
                </span>
              </div>

              <div className="answer-text-box">
                "{ans.answer}"
              </div>

              {ans.feedback && <p className="text-slate-700 text-sm">{ans.feedback}</p>}
              {ans.betterAnswer && (
                <p className="better-answer">
                  <Lightbulb size={16} className="shrink-0 mt-0.5" />
                  <span><strong>Piste d'amélioration :</strong> {ans.betterAnswer}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="actions-footer">
          <button className="btn-result btn-retry flex items-center gap-2" onClick={onRetry}>
            <RefreshCw size={18} /> Nouvel entretien
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
