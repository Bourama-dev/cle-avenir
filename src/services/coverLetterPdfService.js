import { exportA4Pdf } from '@/utils/a4PdfExport';

export const coverLetterPdfService = {
  generatePDF: (elementId, filename = 'lettre-motivation.pdf') => (
    exportA4Pdf(document.getElementById(elementId), filename)
  ),

  formatDate: (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};