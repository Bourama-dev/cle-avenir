import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate1 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_1');
  
  return (
    <div className={`w-[210mm] h-[297mm] p-[30mm] bg-white text-slate-900 ${config.fontClass} flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="mb-12">
        <p className="font-bold text-lg mb-1">{content.senderName || 'Votre Nom'}</p>
        <p>{content.senderAddress}</p>
        <p>{content.senderPhone}</p>
        <p>{content.senderEmail}</p>
      </div>

      <div className="mb-12 text-right">
        <p className="font-bold">{content.recipientName}</p>
        <p className="font-bold">{content.recipientCompany}</p>
        <p>{content.recipientAddress}</p>
        <p className="mt-4">Fait le {coverLetterPdfService.formatDate(content.date)}</p>
      </div>

      <div className="mb-8">
        <span className="font-bold border-b pb-0.5" style={{ borderColor: config.color }}>Objet :</span>
        <span className="ml-2 font-medium">{content.subject}</span>
      </div>

      <div className="mb-6 font-medium">{content.salutation}</div>

      <div className="whitespace-pre-wrap text-justify leading-relaxed mb-8 flex-1">
        {content.body || "Rédigez le corps de votre lettre ici..."}
      </div>

      <div className="mb-12">{content.closing}</div>

      <div className="mt-auto">
        <div className="font-bold italic" style={{ color: config.color }}>{content.senderName}</div>
      </div>
    </div>
  );
};