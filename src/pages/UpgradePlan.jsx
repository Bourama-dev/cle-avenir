import React from 'react';
import { Navigate } from 'react-router-dom';

// CléAvenir is fully free — there is nothing to upgrade to.
const UpgradePlan = () => <Navigate to="/plans" replace />;

export default UpgradePlan;
