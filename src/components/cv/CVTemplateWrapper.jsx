import React from 'react';

const DEFAULT_CV_DATA = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  experience: [],
  education: [],
  skills: '',
  qualities: [],
  fontClass: 'font-sans',
  colorScheme: 'default'
};

const CVTemplateWrapper = ({ template: TemplateComponent, cvData }) => {
  if (!TemplateComponent) {
    return (
      <div className="p-8 text-center text-slate-500">
        Modèle de CV introuvable.
      </div>
    );
  }

  // Ensure all nested arrays/objects exist to prevent map/filter errors in templates
  const safeData = {
    ...DEFAULT_CV_DATA,
    ...(cvData || {}),
    experience: Array.isArray(cvData?.experience) ? cvData.experience : [],
    education: Array.isArray(cvData?.education) ? cvData.education : [],
    qualities: Array.isArray(cvData?.qualities) ? cvData.qualities : [],
    personalInfo: {
      name: cvData?.fullName || cvData?.personalInfo?.name || '',
      email: cvData?.email || cvData?.personalInfo?.email || '',
      phone: cvData?.phone || cvData?.personalInfo?.phone || '',
      location: cvData?.address || cvData?.personalInfo?.location || ''
    }
  };

  return <TemplateComponent cvData={safeData} />;
};

export default CVTemplateWrapper;