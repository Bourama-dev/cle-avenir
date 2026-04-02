import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate5 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_5');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-[#fdfbf7] text-slate-800 ${config.fontClass} p-[30mm] flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4 text-slate-900">{content.senderName || 'Votre Nom'}</h1>
        <div className="flex justify-center items-center gap-4 text-xs font-sans uppercase tracking-wider text-slate-500">
          <span>{content.senderEmail}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{content.senderPhone}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{content.senderAddress}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-12 border-b pb-6 border-slate-200">
        <div className="font-sans text-sm text-slate-500">
          Le {coverLetterPdfService.formatDate(content.date)}
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">{content.recipientName}</p>
          <p className="font-bold text-slate-600">{content.recipientCompany}</p>
          <p className="text-slate-500 font-sans text-sm mt-1">{content.recipientAddress}</p>
        </div>
      </div>

      <div className="mb-8 font-bold italic text-slate-900">
        Objet : {content.subject}
      </div>

      <div className="mb-6 font-medium text-slate-900">{content.salutation}</div>

      <div className="whitespace-pre-wrap text-justify leading-loose mb-8 flex-1 font-sans text-slate-700">
        {content.body || "Rédigez le corps de votre lettre ici..."}
      </div>

      <div className="mb-12 font-medium text-slate-900">{content.closing}</div>

      <div className="mt-auto text-right">
        <div className="font-bold text-2xl italic" style={{ color: config.color }}>{content.senderName}</div>
      </div>
    </div>
  );
};