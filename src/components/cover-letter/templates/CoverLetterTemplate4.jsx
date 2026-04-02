import React from 'react';
import { CL_TEMPLATES_CONFIG } from '@/data/coverLetterTemplateConfig';
import { coverLetterPdfService } from '@/services/coverLetterPdfService';

export const CoverLetterTemplate4 = ({ content }) => {
  const config = CL_TEMPLATES_CONFIG.find(t => t.id === 'cl_template_4');
  
  return (
    <div className={`w-[210mm] h-[297mm] bg-slate-900 text-slate-300 ${config.fontClass} p-[25mm] flex flex-col relative overflow-hidden text-[11pt]`} id="letter-preview">
      <div className="flex justify-between items-start mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">{content.senderName || 'Votre Nom'}</h1>
          <div className="text-xs font-mono space-y-1" style={{ color: config.color }}>
            <p>E: {content.senderEmail}</p>
            <p>T: {content.senderPhone}</p>
            <p>L: {content.senderAddress}</p>
          </div>
        </div>
        <div className="text-right font-mono text-sm border-l-2 pl-4 border-slate-700">
          <p className="text-white font-bold">{content.recipientName}</p>
          <p style={{ color: '#39ff14' }}>{content.recipientCompany}</p>
          <p className="text-slate-500 text-xs mt-1">{content.recipientAddress}</p>
          <p className="text-slate-600 text-xs mt-4">DATE: {coverLetterPdfService.formatDate(content.date)}</p>
        </div>
      </div>

      <div className="mb-8 font-mono text-sm bg-slate-800/50 p-2 rounded text-white border-l-2" style={{ borderColor: '#39ff14' }}>
        <span style={{ color: '#39ff14' }}>&gt;</span> OBJET: {content.subject}
      </div>

      <div className="mb-6 font-bold text-white">{content.salutation}</div>

      <div className="whitespace-pre-wrap text-justify leading-loose mb-8 flex-1">
        {content.body || "Rédigez le corps de votre lettre ici..."}
      </div>

      <div className="mb-8 text-slate-400">{content.closing}</div>

      <div className="mt-4 font-mono font-bold text-lg" style={{ color: config.color }}>{content.senderName}</div>
    </div>
  );
};