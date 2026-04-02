import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate3 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template3) || { fontClass: 'font-sans', color: '#0f172a' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-slate-50 text-slate-800 ${normalizedData.fontClass || config.fontClass} p-8 relative overflow-hidden`} id="cv-preview-content">
      {/* Header asymmetric */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-3xl text-white mb-8 shadow-lg transform -skew-y-2">
        <div className="transform skew-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">{normalizedData.fullName || 'Votre Nom'}</h1>
          <p className="text-2xl font-medium text-pink-100">{normalizedData.jobTitle || 'Titre du poste'}</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main */}
        <div className="w-2/3 space-y-6">
          {normalizedData.summary && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-3 text-purple-700">À propos</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{normalizedData.summary}</p>
            </div>
          )}

          {normalizedData.education.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-5 text-purple-700">Formation</h2>
              <div className="space-y-5">
                {normalizedData.education.map((edu, idx) => (
                  <div key={idx} className="border-l-4 pl-4" style={{ borderColor: config.color || '#000' }}>
                    <h3 className="font-bold text-base">{edu?.degree || ''}</h3>
                    <p className="text-sm font-medium text-pink-500 mb-1">{edu?.institution || ''} | {edu?.dates || ''}</p>
                    {edu?.description && <p className="text-sm text-slate-600 whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {normalizedData.experience.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-5 text-purple-700">Expérience</h2>
              <div className="space-y-5">
                {normalizedData.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 pl-4" style={{ borderColor: config.color || '#000' }}>
                    <h3 className="font-bold text-base">{exp?.role || exp?.title || ''}</h3>
                    <p className="text-sm font-medium text-pink-500 mb-1">{exp?.company || ''} | {exp?.dates || exp?.startDate || ''}</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp?.description || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar embedded */}
        <div className="w-1/3 space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-900">
            <h2 className="text-lg font-bold mb-4">Contact</h2>
            <div className="space-y-2 text-sm font-medium">
              <p>{normalizedData.email}</p>
              <p>{normalizedData.phone}</p>
              <p>{normalizedData.address}</p>
            </div>
          </div>

          {skillList.length > 0 && (
            <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 text-pink-900">
              <h2 className="text-lg font-bold mb-4">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{typeof skill === 'string' ? skill.trim() : skill}</span>
                ))}
              </div>
            </div>
          )}

          {normalizedData.qualities.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-purple-900">
              <h2 className="text-lg font-bold mb-4">Qualités</h2>
              <div className="space-y-4">
                {normalizedData.qualities.map((qual, i) => (
                  <div key={i}>
                    <div className="font-bold text-sm">{qual?.name || ''}</div>
                    <div className="text-xs text-purple-500 mb-1">{qual?.level || ''}</div>
                    {qual?.description && <p className="text-xs text-purple-800/80 leading-snug">{qual.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};