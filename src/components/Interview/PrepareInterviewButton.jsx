import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { interviewPrefill } from '@/services/interviewPrefill';

/**
 * Opens the AI interview simulator pre-filled with a job offer.
 * @param offer {title, company, description, level?}
 */
const PrepareInterviewButton = ({ offer, label = "Préparer l'entretien", className = '', ...buttonProps }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    interviewPrefill.save(offer);
    navigate('/interview');
  };

  return (
    <Button type="button" onClick={handleClick} className={`gap-1.5 ${className}`} {...buttonProps}>
      <Mic className="w-3.5 h-3.5" /> {label}
    </Button>
  );
};

export default PrepareInterviewButton;
