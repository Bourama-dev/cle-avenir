import React from 'react';
import { CV_TEMPLATES_CONFIG, TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

export const CVTemplate6 = ({ cvData, data }) => {
  const normalizedData = normalizeCVData(cvData || data);
  const config = CV_TEMPLATES_CONFIG.find(t => t.id === TEMPLATE_UUIDS.template6) || { fontClass: 'font-sans', color: '#ec4899' };
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-white text-black ${normalizedData.fontClass || config.fontClass} p-[25mm] relative overflow-hidden`} id="cv-preview-content">
      <header className="mb-16">
        <h1 className="text-5xl font-normal tracking-tight mb-4">{normalizedData.fullName || 'Votre Nom'}</h1>
        <p className="text-xl text-gray-500 font-light">{normalizedData.jobTitle || 'Titre du poste'}</p>
        <div className="mt-8 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2">
          <span>{normalizedData.email}</span>
          <span>{normalizedData.phone}</span>
          <span>{normalizedData.address}</span>
        </div>
      </header>

      <div className="space-y-12">
        {normalizedData.summary && (
          <section className="grid grid-cols-4 gap-8">
            <h2 className="col-span-1 text-sm font-semibold uppercase tracking-widest text-gray-400">Profil</h2>
            <div className="col-span-3">
              <p className="text-sm leading-loose text-gray-800">{normalizedData.summary}</p>
            </div>
          </section>
        )}

        {normalizedData.education.length > 0 && (
          <section className="grid grid-cols-4 gap-8">
            <h2 className="col-span-1 text-sm font-semibold uppercase tracking-widest text-gray-400">Formation</h2>
            <div className="col-span-3 space-y-8">
              {normalizedData.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-base">{edu?.degree || ''}</h3>
                    <span className="text-xs text-gray-500">{edu?.dates || ''}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{edu?.institution || ''}</div>
                  {edu?.description && <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {normalizedData.experience.length > 0 && (
          <section className="grid grid-cols-4 gap-8">
            <h2 className="col-span-1 text-sm font-semibold uppercase tracking-widest text-gray-400">Expérience</h2>
            <div className="col-span-3 space-y-8">
              {normalizedData.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-base">{exp?.role || exp?.title || ''}</h3>
                    <span className="text-xs text-gray-500">{exp?.dates || exp?.startDate || ''}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{exp?.company || ''}</div>
                  <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{exp?.description || ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {normalizedData.skills && (
          <section className="grid grid-cols-4 gap-8">
            <h2 className="col-span-1 text-sm font-semibold uppercase tracking-widest text-gray-400">Expertise</h2>
            <div className="col-span-3 text-sm leading-loose text-gray-800">
              {Array.isArray(normalizedData.skills) ? normalizedData.skills.join(', ') : normalizedData.skills}
            </div>
          </section>
        )}

        {normalizedData.qualities.length > 0 && (
          <section className="grid grid-cols-4 gap-8">
            <h2 className="col-span-1 text-sm font-semibold uppercase tracking-widest text-gray-400">Qualités</h2>
            <div className="col-span-3 grid grid-cols-2 gap-6 text-sm">
              {normalizedData.qualities.map((qual, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-gray-800 mb-1">{qual?.name || ''} <span className="font-normal text-gray-400">| {qual?.level || ''}</span></div>
                  {qual?.description && <p className="text-gray-600 leading-relaxed text-xs">{qual.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};