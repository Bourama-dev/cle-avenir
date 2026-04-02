import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate7 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_7');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-orange-50/30 text-slate-800 ${config.fontClass} p-10 flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">{content.senderName || 'Votre Nom'}</h1>
          <div className="flex gap-4 text-xs font-medium text-slate-500">
            <span>{content.senderEmail}</span>
            <span>{content.senderPhone}</span>
            <span>{content.senderAddress}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8 px-4">
        <div className="text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm">
          Le {coverLetterPdfService.formatDate(content.date)}
        </div>
        <div className="text-right bg-blue-50 px-6 py-4 rounded-3xl border border-blue-100">
          <p className="font-bold text-blue-900">{content.recipientName}</p>
          <p className="font-bold text-blue-600">{content.recipientCompany}</p>
          <p className="text-blue-800/70 text-sm mt-1">{content.recipientAddress}</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col">
        <div className="mb-6 font-bold text-lg text-pink-500 border-b border-slate-100 pb-4">
          Objet : {content.subject}
        </div>

        <div className="mb-6 font-bold text-slate-800">{content.salutation}</div>

        <div className="whitespace-pre-wrap text-justify leading-relaxed mb-8 flex-1 font-medium text-slate-700">
          {content.body || "Rédigez le corps de votre lettre ici..."}
        </div>

        <div className="mb-8 font-bold text-slate-800">{content.closing}</div>

        <div className="mt-4 font-bold text-xl text-orange-600">{content.senderName}</div>
      </div>
    </div>
  );
};