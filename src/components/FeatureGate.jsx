import React from 'react';

// CléAvenir is fully free — every account has access to every feature,
// so this simply renders its children unconditionally.
const FeatureGate = ({ children }) => {
  return <>{children}</>;
};

export default FeatureGate;
