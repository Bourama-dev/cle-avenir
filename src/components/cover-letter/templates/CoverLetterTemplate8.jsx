import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate8 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_8');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-black text-slate-200 ${config.fontClass} p-[25mm] flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="border border-slate-800 rounded-lg p-10 flex-1 flex flex-col relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1" style={{ backgroundColor: config.color }}></div>
        
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-white mb-4">{content.senderName || 'Votre Nom'}</h1>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest" style={{ color: config.color }}>
            <span>{content.senderEmail}</span>
            <span>{content.senderPhone}</span>
            <span>{content.senderAddress}</span>
          </div>
        </header>

        <div className="flex justify-between items-end mb-12 font-sans text-sm">
          <div className="text-slate-500 uppercase tracking-widest">
            {coverLetterPdfService.formatDate(content.date)}
          </div>
          <div className="text-right">
            <p className="font-bold text-white text-base">{content.recipientName}</p>
            <p className="font-bold tracking-wider uppercase mt-1" style={{ color: config.color }}>{content.recipientCompany}</p>
            <p className="text-slate-400 mt-2">{content.recipientAddress}</p>
          </div>
        </div>

        <div className="mb-10 text-white border-b border-slate-800 pb-4 flex items-center gap-4">
          <span className="uppercase tracking-widest text-xs font-bold" style={{ color: config.color }}>Objet</span>
          <span className="font-medium italic">{content.subject}</span>
        </div>

        <div className="mb-6 font-bold text-white text-lg">{content.salutation}</div>

        <div className="whitespace-pre-wrap text-justify leading-loose mb-10 flex-1 font-sans font-light">
          {content.body || "Rédigez le corps de votre lettre ici..."}
        </div>

        <div className="mb-12 font-medium text-white text-lg">{content.closing}</div>

        <div className="mt-4">
          <div className="font-bold text-2xl" style={{ color: config.color }}>{content.senderName}</div>
        </div>
      </div>
    </div>
  );
};