import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate8 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template8) || { fontClass: 'font-sans', color: '#0ea5e9' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-[#fdfbf7] text-slate-900 ${normalizedData.fontClass || config.fontClass} relative overflow-hidden flex flex-col`} id="cv-preview-content">
      <header className="p-12 pb-8 border-b-4 text-center" style={{ borderColor: config.color }}>
        <h1 className="text-5xl font-bold uppercase tracking-widest mb-3" style={{ color: '#1e293b' }}>{normalizedData.fullName || 'Votre Nom'}</h1>
        <p className="text-xl tracking-widest uppercase text-slate-500 mb-6">{normalizedData.jobTitle || 'Titre du poste'}</p>
        <div className="flex justify-center items-center gap-6 text-sm text-slate-600 font-sans">
          <span>{normalizedData.email}</span>
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: config.color }}></span>
          <span>{normalizedData.phone}</span>
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: config.color }}></span>
          <span>{normalizedData.address}</span>
        </div>
      </header>

      <div className="flex-1 flex p-10 gap-12">
        <div className="flex-1 space-y-8">
          {normalizedData.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-4">
                <span className="text-slate-800">Parcours</span>
                <span className="flex-1 h-px bg-slate-300"></span>
              </h2>
              <div className="space-y-6">
                {normalizedData.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg text-slate-800">{exp?.role || exp?.title || ''}</h3>
                      <span className="text-sm font-sans font-medium" style={{ color: config.color }}>{exp?.dates || exp?.startDate || ''}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">{exp?.company || ''}</div>
                    <p className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-wrap">{exp?.description || ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {normalizedData.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-4">
                <span className="text-slate-800">Formation</span>
                <span className="flex-1 h-px bg-slate-300"></span>
              </h2>
              <div className="space-y-6">
                {normalizedData.education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg text-slate-800">{edu?.degree || ''}</h3>
                      <span className="text-sm font-sans font-medium" style={{ color: config.color }}>{edu?.dates || ''}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">{edu?.institution || ''}</div>
                    {edu?.description && <p className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-1/3 space-y-8 pl-8 border-l border-slate-200">
          {normalizedData.summary && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-slate-800">Profil</h2>
              <p className="text-sm leading-relaxed text-slate-600 font-sans italic">{normalizedData.summary}</p>
            </section>
          )}

          {skillList.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-slate-800">Expertise</h2>
              <ul className="space-y-2 font-sans text-sm text-slate-700">
                {skillList.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }}></span>
                    {typeof skill === 'string' ? skill.trim() : skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {normalizedData.qualities.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-slate-800">Qualités</h2>
              <div className="space-y-4 font-sans text-sm">
                {normalizedData.qualities.map((qual, i) => (
                  <div key={i}>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }}></span>
                      {qual?.name || ''}
                    </div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider pl-3 mt-1">{qual?.level || ''}</div>
                    {qual?.description && <p className="text-slate-600 italic text-xs pl-3 mt-1 leading-relaxed">{qual.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};