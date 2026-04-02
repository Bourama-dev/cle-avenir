import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate1 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template1) || { fontClass: 'font-sans', color: '#475569' };
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-white p-[20mm] text-slate-800 ${normalizedData.fontClass || config.fontClass} flex flex-col relative overflow-hidden`} id="cv-preview-content">
      <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: config.color }}>
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2" style={{ color: config.color }}>{normalizedData.fullName || 'Votre Nom'}</h1>
        <p className="text-xl italic text-slate-600 mb-4">{normalizedData.jobTitle || 'Titre du poste'}</p>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <span>{normalizedData.email}</span> | <span>{normalizedData.phone}</span> | <span>{normalizedData.address}</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {normalizedData.summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: config.color }}>Profil Professionnel</h2>
            <p className="text-sm leading-relaxed text-justify">{normalizedData.summary}</p>
          </section>
        )}

        {normalizedData.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: config.color }}>Formation</h2>
            <div className="space-y-4">
              {normalizedData.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold text-base">
                    <span>{edu?.degree || ''}</span>
                    <span className="font-normal text-slate-600">{edu?.dates || ''}</span>
                  </div>
                  <div className="italic text-sm text-slate-700 mb-1">{edu?.institution || ''}</div>
                  {edu?.description && <p className="text-sm leading-relaxed whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {normalizedData.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: config.color }}>Expérience Professionnelle</h2>
            <div className="space-y-4">
              {normalizedData.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold text-base">
                    <span>{exp?.role || exp?.title || ''}</span>
                    <span className="font-normal text-slate-600">{exp?.dates || exp?.startDate || ''}</span>
                  </div>
                  <div className="italic text-sm text-slate-700 mb-1">{exp?.company || ''}</div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp?.description || ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {normalizedData.skills && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: config.color }}>Compétences</h2>
            <p className="text-sm leading-relaxed">
               {Array.isArray(normalizedData.skills) ? normalizedData.skills.join(', ') : normalizedData.skills}
            </p>
          </section>
        )}

        {normalizedData.qualities.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: config.color }}>Qualités & Soft Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {normalizedData.qualities.map((qual, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold mb-1">
                    {qual?.name || ''} <span className="font-normal italic text-slate-500">- {qual?.level || ''}</span>
                  </div>
                  {qual?.description && <p className="text-slate-600 leading-relaxed text-xs">{qual.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};