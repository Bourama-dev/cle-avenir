import React, { useState, useEffect } from 'react';
import { Mic, Square, ArrowRight, Save, Clock } from 'lucide-react';
import './LiveInterview.css';

const LiveInterview = ({ 
  currentQuestion, 
  currentQuestionIndex, 
  totalQuestions, 
  isSpeaking, 
  isListening, 
  transcript,
  interimTranscript,
  onStartListening, 
  onStopListening, 
  onSubmitAnswer,
  timeLeft
}) => {
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="live-interview-container">
      {/* Header */}
      <header className="live-header">
        <div className="progress-indicator text-slate-600 font-medium">
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </div>
        <div className="timer-badge flex items-center gap-2">
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="interview-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className={`cleo-avatar-large ${isSpeaking ? 'speaking' : ''}`}>
            🤖
          </div>
          {isSpeaking && <p className="text-violet-600 mt-4 font-medium animate-pulse">Cléo parle...</p>}
        </div>

        {/* Question Card */}
        <div className="question-card">
          <p className="text-slate-500 uppercase text-xs font-bold tracking-wider">Question Actuelle</p>
          <h2 className="question-text">{currentQuestion}</h2>
        </div>

        {/* Transcript Area */}
        <div className="transcript-area">
          {isListening && (
            <div className="listening-indicator">
              <span className="pulsing-dot"></span> Écoute en cours...
            </div>
          )}
          <p className="transcript-text">
            {transcript}
            <span className="interim-text"> {interimTranscript}</span>
            {!transcript && !interimTranscript && !isListening && (
              <span className="text-slate-400 italic">Appuyez sur "Parler" pour répondre...</span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="controls-section">
          {!isListening && !transcript ? (
            <button 
              className="btn-control btn-primary"
              onClick={onStartListening}
              disabled={isSpeaking}
            >
              <Mic size={20} /> Parler
            </button>
          ) : isListening ? (
            <button 
              className="btn-control btn-danger"
              onClick={onStopListening}
            >
              <Square size={20} /> Arrêter
            </button>
          ) : (
            <>
               <button 
                className="btn-control btn-primary" // Retry/Resume recording
                onClick={onStartListening}
              >
                <Mic size={20} /> Reprendre
              </button>
              <button 
                className="btn-control btn-success"
                onClick={onSubmitAnswer}
              >
                <Save size={20} /> Valider la réponse
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;