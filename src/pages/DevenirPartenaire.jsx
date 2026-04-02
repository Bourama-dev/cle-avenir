import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect old page to new PartnershipPage
export default function DevenirPartenaire() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/partenariat', { replace: true });
  }, [navigate]);
  return null;
}