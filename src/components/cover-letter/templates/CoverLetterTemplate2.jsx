import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate2 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_2');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-white text-slate-800 ${config.fontClass} flex flex-col relative overflow-hidden`} id="letter-preview">
      <header className="p-10 pb-6 border-b" style={{ borderColor: config.color }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-3 text-slate-900">{content.senderName || 'Votre Nom'}</h1>
        <div className="flex gap-6 text-sm text-slate-500">
          <span>{content.senderEmail}</span>
          <span>{content.senderPhone}</span>
          <span>{content.senderAddress}</span>
        </div>
      </header>

      <div className="p-12 flex-1 flex flex-col text-[11pt]">
        <div className="mb-12 border-l-2 pl-4" style={{ borderColor: config.color }}>
          <p className="font-bold text-slate-900">{content.recipientName}</p>
          <p className="font-bold">{content.recipientCompany}</p>
          <p className="text-slate-600">{content.recipientAddress}</p>
          <p className="mt-2 text-slate-500 text-sm">{coverLetterPdfService.formatDate(content.date)}</p>
        </div>

        <div className="mb-8 font-bold text-slate-900 bg-slate-50 p-3 rounded-md">
          Objet : {content.subject}
        </div>

        <div className="mb-6 font-medium text-slate-900">{content.salutation}</div>

        <div className="whitespace-pre-wrap text-justify leading-relaxed mb-8 flex-1 text-slate-700">
          {content.body || "Rédigez le corps de votre lettre ici..."}
        </div>

        <div className="mb-10 text-slate-900">{content.closing}</div>

        <div className="font-bold uppercase tracking-wider" style={{ color: config.color }}>{content.senderName}</div>
      </div>
    </div>
  );
};