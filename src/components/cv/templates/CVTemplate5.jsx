import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate5 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template5) || { fontClass: 'font-sans', color: '#3b82f6' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-white text-slate-800 ${normalizedData.fontClass || config.fontClass} p-10 relative overflow-hidden`} id="cv-preview-content">
      <div className="flex items-center gap-8 mb-10 pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white font-bold" style={{ backgroundColor: config.color || '#3b82f6' }}>
          {(normalizedData.fullName || 'V N').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-1">{normalizedData.fullName || 'Votre Nom'}</h1>
          <p className="text-xl font-medium text-indigo-500">{normalizedData.jobTitle || 'Titre du poste'}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-8">
          <div className="p-5 bg-indigo-50 rounded-xl text-sm">
            <p className="font-semibold mb-2">Contact</p>
            <div className="space-y-2 text-slate-600">
              <p>{normalizedData.email}</p>
              <p>{normalizedData.phone}</p>
              <p>{normalizedData.address}</p>
            </div>
          </div>

          {skillList.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase tracking-wide mb-4">Compétences clés</h2>
              <div className="space-y-3">
                {skillList.slice(0, 8).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{typeof skill === 'string' ? skill.trim() : skill}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(40, 100 - i * 10)}%`, backgroundColor: config.color || '#3b82f6' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {normalizedData.qualities.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase tracking-wide mb-4">Qualités</h2>
              <div className="space-y-4">
                {normalizedData.qualities.map((qual, i) => (
                  <div key={i} className="text-sm">
                    <div className="font-bold text-slate-800">{qual?.name || ''}</div>
                    <div className="text-xs text-indigo-500 mb-1 font-medium">{qual?.level || ''}</div>
                    {qual?.description && <p className="text-xs text-slate-500 leading-relaxed">{qual.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8 space-y-8">
          {normalizedData.summary && (
            <section>
              <h2 className="font-bold text-slate-900 uppercase tracking-wide mb-3">À propos de moi</h2>
              <p className="text-sm leading-relaxed text-slate-600">{normalizedData.summary}</p>
            </section>
          )}

          {normalizedData.education.length > 0 && (
            <section>
              <h2 className="font-bold text-slate-900 uppercase tracking-wide mb-6">Formation</h2>
              <div className="space-y-6">
                {normalizedData.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-24 shrink-0 text-right">
                      <div className="text-xs font-bold text-indigo-500">{edu?.dates || ''}</div>
                    </div>
                    <div className="relative pb-6 border-l-2 border-slate-100 pl-4">
                      <div className="absolute w-3 h-3 rounded-full bg-indigo-500 -left-[7px] top-0"></div>
                      <h3 className="font-bold text-slate-900 text-base">{edu?.degree || ''}</h3>
                      <div className="text-sm font-medium text-slate-500 mb-2">{edu?.institution || ''}</div>
                      {edu?.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {normalizedData.experience.length > 0 && (
            <section>
              <h2 className="font-bold text-slate-900 uppercase tracking-wide mb-6">Parcours</h2>
              <div className="space-y-6">
                {normalizedData.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-24 shrink-0 text-right">
                      <div className="text-xs font-bold text-indigo-500">{exp?.dates || exp?.startDate || ''}</div>
                    </div>
                    <div className="relative pb-6 border-l-2 border-slate-100 pl-4">
                      <div className="absolute w-3 h-3 rounded-full bg-indigo-500 -left-[7px] top-0"></div>
                      <h3 className="font-bold text-slate-900 text-base">{exp?.role || exp?.title || ''}</h3>
                      <div className="text-sm font-medium text-slate-500 mb-2">{exp?.company || ''}</div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp?.description || ''}</p>
                    </div>
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