import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect old page to new Blog page
export default function BlogCarriere() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/blog', { replace: true });
  }, [navigate]);
  return null;
}