import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate7 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template7) || { fontClass: 'font-sans', color: '#1e293b' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-gray-50 text-slate-800 ${normalizedData.fontClass || config.fontClass} p-8 relative overflow-hidden`} id="cv-preview-content">
      <div className="bg-white rounded-3xl p-8 shadow-sm mb-6 border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{normalizedData.fullName || 'Votre Nom'}</h1>
          <p className="text-xl font-semibold" style={{ color: config.color }}>{normalizedData.jobTitle || 'Titre du poste'}</p>
        </div>
        <div className="text-right text-sm font-medium text-slate-500 space-y-1">
          <p>{normalizedData.email}</p>
          <p>{normalizedData.phone}</p>
          <p>{normalizedData.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {normalizedData.summary && (
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
              <h2 className="text-lg font-bold text-orange-600 mb-3">À propos</h2>
              <p className="text-sm text-orange-900 leading-relaxed font-medium">{normalizedData.summary}</p>
            </div>
          )}

          {skillList.length > 0 && (
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-blue-600 mb-3">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, i) => (
                  <span key={i} className="bg-white text-blue-700 text-xs px-3 py-1.5 rounded-xl font-bold shadow-sm">{typeof skill === 'string' ? skill.trim() : skill}</span>
                ))}
              </div>
            </div>
          )}

          {normalizedData.qualities.length > 0 && (
            <div className="bg-teal-50 rounded-3xl p-6 border border-teal-100">
              <h2 className="text-lg font-bold text-teal-600 mb-4">Qualités</h2>
              <div className="space-y-4">
                {normalizedData.qualities.map((qual, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-teal-900 text-sm">{qual?.name || ''}</div>
                    <div className="text-xs font-semibold text-teal-600 mb-1">{qual?.level || ''}</div>
                    {qual?.description && <p className="text-xs text-teal-800 leading-relaxed">{qual.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {normalizedData.education.length > 0 && (
            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <h2 className="text-lg font-bold text-indigo-600 mb-5">Formation</h2>
              <div className="space-y-6">
                {normalizedData.education.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <h3 className="font-bold text-slate-900">{edu?.degree || ''}</h3>
                    <div className="text-sm font-bold text-indigo-400 mb-2">{edu?.institution || ''} <span className="text-slate-400 font-normal">| {edu?.dates || ''}</span></div>
                    {edu?.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {normalizedData.experience.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-pink-500 mb-5">Expérience</h2>
              <div className="space-y-6">
                {normalizedData.experience.map((exp, idx) => (
                  <div key={idx} className="relative">
                    <h3 className="font-bold text-slate-900">{exp?.role || exp?.title || ''}</h3>
                    <div className="text-sm font-bold text-pink-400 mb-2">{exp?.company || ''} <span className="text-slate-400 font-normal">| {exp?.dates || exp?.startDate || ''}</span></div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp?.description || ''}</p>
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