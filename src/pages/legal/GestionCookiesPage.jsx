import React from 'react';
import { Navigate } from 'react-router-dom';

// La gestion des cookies est désormais intégrée dans la politique cookies
const GestionCookiesPage = () => <Navigate to="/legal/cookies" replace />;

export default GestionCookiesPage;
