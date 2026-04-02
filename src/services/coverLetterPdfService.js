import html2pdf from 'html2pdf.js';

export const coverLetterPdfService = {
  generatePDF: (elementId, filename = 'lettre-motivation.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    return html2pdf().set(opt).from(element).save();
  },

  formatDate: (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};