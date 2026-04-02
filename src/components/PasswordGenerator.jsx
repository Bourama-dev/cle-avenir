import React, { useState, useEffect } from 'react';
import { generateSecurePassword, validatePassword, copyToClipboard } from '@/utils/passwordGenerator';
import { RefreshCw, Copy, Check, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import './PasswordGenerator.css';

const PasswordGenerator = ({ isOpen, onClose, onPasswordGenerated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState({ isValid: false, errors: [] });

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = () => {
    const newPassword = generateSecurePassword(16);
    setPassword(newPassword);
    setValidation(validatePassword(newPassword));
    setCopied(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = () => {
    if (validation.isValid) {
      onPasswordGenerated(password);
      onClose();
    }
  };

  if (!isOpen) return null;

  const requirements = [
    { label: "Minimum 12 caractères", test: (p) => p.length >= 12 },
    { label: "Une majuscule", test: (p) => /[A-Z]/.test(p) },
    { label: "Une minuscule", test: (p) => /[a-z]/.test(p) },
    { label: "Un chiffre", test: (p) => /[0-9]/.test(p) },
    { label: "Un caractère spécial", test: (p) => /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(p) }
  ];

  return (
    <div className="password-generator-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="password-generator-card">
        <div className="pg-header">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="pg-title">Générateur de mot de passe</h2>
          <p className="pg-subtitle">Créez un mot de passe fort et sécurisé</p>
        </div>

        <div className="pg-display-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="pg-input"
          />
          <button 
            className="pg-toggle-btn" 
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Masquer" : "Afficher"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="pg-actions">
          <button className="pg-btn pg-btn-generate" onClick={handleGenerate}>
            <RefreshCw size={16} /> Générer
          </button>
          <button className="pg-btn pg-btn-copy" onClick={handleCopy}>
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        <div className="pg-validation">
          <h4 className="pg-validation-title">Critères de sécurité</h4>
          <div className="pg-req-list">
            {requirements.map((req, index) => {
              const isValid = req.test(password);
              return (
                <div key={index} className={`pg-req-item ${isValid ? 'valid' : 'invalid'}`}>
                  {isValid ? <Check size={14} /> : <X size={14} />}
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pg-footer">
          <button className="pg-btn pg-btn-cancel" onClick={onClose}>
            Annuler
          </button>
          <button 
            className="pg-btn pg-btn-confirm" 
            onClick={handleConfirm}
            disabled={!validation.isValid}
          >
            Utiliser ce mot de passe
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;