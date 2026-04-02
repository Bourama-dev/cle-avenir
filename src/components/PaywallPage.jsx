import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect duplicate PaywallPage to PlansPage
export default function PaywallPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/forfaits', { replace: true });
  }, [navigate]);
  return null;
}