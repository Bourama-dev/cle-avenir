import html2pdf from 'html2pdf.js';

export const exportCoverLetterPDF = (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 0,
    filename: filename || 'Lettre_de_Motivation.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};