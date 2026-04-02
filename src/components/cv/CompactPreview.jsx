import React from 'react';

const CompactPreview = ({ children }) => {
  return (
    <div className="preview-container w-full h-full py-6 px-2 sm:px-6">
      <div className="preview-scaler origin-top shadow-2xl bg-white">
        {children}
      </div>
    </div>
  );
};

export default CompactPreview;