import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate2 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template2) || { fontClass: 'font-sans', color: '#8b5cf6' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-white flex text-slate-800 ${normalizedData.fontClass || config.fontClass} relative overflow-hidden`} id="cv-preview-content">
      {/* Sidebar */}
      <div className="w-[70mm] text-white p-8 flex flex-col" style={{ backgroundColor: '#1f2937' }}>
        <h1 className="text-3xl font-bold mb-2">{normalizedData.fullName || 'Votre Nom'}</h1>
        <p className="text-lg mb-8" style={{ color: config.color }}>{normalizedData.jobTitle || 'Titre du poste'}</p>
        
        <div className="mb-8 space-y-3 text-sm text-slate-300">
          <h2 className="text-white font-semibold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Contact</h2>
          <p>{normalizedData.email}</p>
          <p>{normalizedData.phone}</p>
          <p>{normalizedData.address}</p>
        </div>

        {skillList.length > 0 && (
          <div className="space-y-3 text-sm mb-8">
            <h2 className="text-white font-semibold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Compétences</h2>
            <div className="flex flex-col gap-2">
              {skillList.map((skill, i) => (
                <span key={i} className="text-slate-300">{typeof skill === 'string' ? skill.trim() : skill}</span>
              ))}
            </div>
          </div>
        )}

        {normalizedData.qualities.length > 0 && (
          <div className="space-y-3 text-sm">
            <h2 className="text-white font-semibold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Soft Skills</h2>
            <div className="flex flex-col gap-4">
              {normalizedData.qualities.map((qual, i) => (
                <div key={i}>
                  <div className="font-medium text-slate-200">{qual?.name || ''}</div>
                  <div className="text-xs text-slate-400 italic mb-1">{qual?.level || ''}</div>
                  {qual?.description && <div className="text-xs text-slate-400 leading-tight">{qual.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col space-y-8 bg-white">
        {normalizedData.summary && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: config.color }}>Profil</h2>
            <p className="text-sm leading-relaxed text-slate-600 text-justify">{normalizedData.summary}</p>
          </section>
        )}

        {normalizedData.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6" style={{ color: config.color }}>Formation</h2>
            <div className="space-y-6">
              {normalizedData.education.map((edu, idx) => (
                <div key={idx} className="relative pl-4 border-l-2" style={{ borderColor: config.color }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1 bg-white border-2" style={{ borderColor: config.color }}></div>
                  <div className="font-bold text-base">{edu?.degree || ''}</div>
                  <div className="text-sm text-slate-500 mb-2">{edu?.institution || ''} • {edu?.dates || ''}</div>
                  {edu?.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {normalizedData.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6" style={{ color: config.color }}>Expérience</h2>
            <div className="space-y-6">
              {normalizedData.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-2" style={{ borderColor: config.color }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1 bg-white border-2" style={{ borderColor: config.color }}></div>
                  <div className="font-bold text-base">{exp?.role || exp?.title || ''}</div>
                  <div className="text-sm text-slate-500 mb-2">{exp?.company || ''} • {exp?.dates || exp?.startDate || ''}</div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp?.description || ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};