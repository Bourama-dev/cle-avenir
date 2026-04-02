import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate6 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_6');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-white text-gray-800 ${config.fontClass} p-[30mm] flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="flex justify-between items-start mb-16">
        <div className="space-y-1 text-sm text-gray-500">
          <h1 className="text-2xl font-light text-black mb-3 tracking-tight">{content.senderName || 'Votre Nom'}</h1>
          <p>{content.senderAddress}</p>
          <p>{content.senderPhone}</p>
          <p>{content.senderEmail}</p>
        </div>
        <div className="text-right space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
          <p className="font-medium text-black">{content.recipientName}</p>
          <p className="font-medium text-black">{content.recipientCompany}</p>
          <p className="text-gray-500">{content.recipientAddress}</p>
          <p className="text-gray-400 mt-2 text-xs">{coverLetterPdfService.formatDate(content.date)}</p>
        </div>
      </div>

      <div className="mb-8 text-sm uppercase tracking-widest text-gray-400 font-semibold">
        Objet: <span className="text-black font-normal normal-case tracking-normal ml-2">{content.subject}</span>
      </div>

      <div className="mb-6 font-medium text-black">{content.salutation}</div>

      <div className="whitespace-pre-wrap text-justify leading-loose mb-10 flex-1 text-gray-700">
        {content.body || "Rédigez le corps de votre lettre ici..."}
      </div>

      <div className="mb-12">{content.closing}</div>

      <div className="mt-8">
        <div className="text-lg text-black">{content.senderName}</div>
      </div>
    </div>
  );
};