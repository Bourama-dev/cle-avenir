import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate3 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_3');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-white text-slate-800 ${config.fontClass} flex relative overflow-hidden`} id="letter-preview">
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-500 text-white p-10 flex flex-col shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight leading-none mb-10">{content.senderName || 'Votre Nom'}</h1>
        <div className="space-y-4 text-sm font-medium opacity-90 mb-auto">
          <p className="border-b border-white/20 pb-2">Contact</p>
          <p>{content.senderEmail}</p>
          <p>{content.senderPhone}</p>
          <p>{content.senderAddress}</p>
        </div>
        <div className="mt-auto text-sm opacity-80">
          {coverLetterPdfService.formatDate(content.date)}
        </div>
      </div>

      <div className="w-2/3 p-12 flex flex-col text-[11pt]">
        <div className="mb-10 text-right">
          <p className="font-bold text-lg text-slate-900">{content.recipientName}</p>
          <p className="font-bold text-purple-600">{content.recipientCompany}</p>
          <p className="text-slate-500">{content.recipientAddress}</p>
        </div>

        <div className="mb-8 text-pink-600 font-bold">
          Objet : {content.subject}
        </div>

        <div className="mb-6 font-semibold text-slate-900">{content.salutation}</div>

        <div className="whitespace-pre-wrap text-justify leading-relaxed mb-8 flex-1">
          {content.body || "Rédigez le corps de votre lettre ici..."}
        </div>

        <div className="mb-8 font-medium">{content.closing}</div>

        <div className="mt-4 font-bold text-xl text-slate-900">{content.senderName}</div>
      </div>
    </div>
  );
};