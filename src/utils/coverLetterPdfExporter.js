import { exportA4Pdf } from './a4PdfExport';

export const exportCoverLetterPDF = (elementId, filename, meta) => (
  exportA4Pdf(document.getElementById(elementId), filename || 'Lettre_de_Motivation.pdf', meta)
);
