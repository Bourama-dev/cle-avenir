import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate4 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template4) || { fontClass: 'font-sans', color: '#10b981' };
  
  const skillList = Array.isArray(normalizedData.skills) ? normalizedData.skills : (normalizedData.skills || '').split(',').filter(s => s.trim());

  return (
    <div className={`w-[210mm] h-[297mm] bg-slate-900 text-slate-300 ${normalizedData.fontClass || config.fontClass} p-10 relative overflow-hidden`} id="cv-preview-content">
      <div className="border-l-4 pl-6 mb-10" style={{ borderColor: '#39ff14' }}>
        <h1 className="text-5xl font-black text-white tracking-tight uppercase mb-2">{normalizedData.fullName || 'Votre Nom'}</h1>
        <p className="text-2xl font-mono" style={{ color: config.color || '#10b981' }}>{normalizedData.jobTitle || 'Titre du poste'}</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {normalizedData.summary && (
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Profil
              </h2>
              <p className="text-sm leading-relaxed">{normalizedData.summary}</p>
            </section>
          )}

          {normalizedData.education.length > 0 && (
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Formation
              </h2>
              <div className="space-y-6">
                {normalizedData.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-base">{edu?.degree || ''}</h3>
                      <span className="font-mono text-xs" style={{ color: '#39ff14' }}>{edu?.dates || ''}</span>
                    </div>
                    <div className="text-sm font-medium mb-2" style={{ color: config.color || '#10b981' }}>{edu?.institution || ''}</div>
                    {edu?.description && <p className="text-sm leading-relaxed whitespace-pre-wrap">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {normalizedData.experience.length > 0 && (
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Expérience
              </h2>
              <div className="space-y-6">
                {normalizedData.experience.map((exp, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-base">{exp?.role || exp?.title || ''}</h3>
                      <span className="font-mono text-xs" style={{ color: '#39ff14' }}>{exp?.dates || exp?.startDate || ''}</span>
                    </div>
                    <div className="text-sm font-medium mb-2" style={{ color: config.color || '#10b981' }}>{exp?.company || ''}</div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp?.description || ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Contact
            </h2>
            <div className="space-y-3 text-sm font-mono">
              <p className="truncate text-slate-400">&gt; email: <span className="text-white">{normalizedData.email}</span></p>
              <p className="truncate text-slate-400">&gt; phone: <span className="text-white">{normalizedData.phone}</span></p>
              <p className="truncate text-slate-400">&gt; loc: <span className="text-white">{normalizedData.address}</span></p>
            </div>
          </section>

          {skillList.length > 0 && (
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Tech_Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, i) => (
                  <span key={i} className="bg-slate-800 text-xs px-2 py-1 rounded border border-slate-700 font-mono text-white">
                    {typeof skill === 'string' ? skill.trim() : skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {normalizedData.qualities.length > 0 && (
            <section>
              <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#39ff14' }}></span> Soft_Skills
              </h2>
              <div className="space-y-4">
                {normalizedData.qualities.map((qual, i) => (
                  <div key={i} className="text-sm">
                    <div className="text-white font-bold font-mono">
                      &gt; {qual?.name || ''}
                    </div>
                    <div className="text-xs font-mono mb-1" style={{ color: config.color || '#10b981' }}>[{qual?.level || ''}]</div>
                    {qual?.description && <div className="text-xs text-slate-400">{qual.description}</div>}
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