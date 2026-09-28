import { exportA4Pdf } from './a4PdfExport';

export const exportCVPDF = (elementId, filename, meta) => (
  exportA4Pdf(document.getElementById(elementId), filename || 'Mon_CV.pdf', meta)
);
