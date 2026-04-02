import * as pdfjsLib from 'pdfjs-dist';
import { initPdfWorker, getPdfWorkerStatus } from './pdfWorkerSetup';

/**
 * Extracts raw text from a PDF file using pdfjs-dist.
 * @param {File} file - The PDF file to extract text from.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPDF = async (file) => {
  try {
    const status = getPdfWorkerStatus();
    if (!status.isInitialized) {
      const initResult = await initPdfWorker();
      if (!initResult.success) {
        throw new Error(`Worker initialization failed: ${initResult.error?.message}`);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Better handling of layout/columns by sorting by Y then X
      const items = textContent.items.sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) > 5) {
          return b.transform[5] - a.transform[5]; // Sort by Y
        }
        return a.transform[4] - b.transform[4]; // Sort by X
      });

      let lastY = null;
      let pageText = '';

      items.forEach(item => {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n'; // New line
        } else if (lastY !== null) {
          pageText += ' '; // Same line
        }
        pageText += item.str;
        lastY = item.transform[5];
      });

      fullText += pageText + '\n\n';
    }
    
    if (!fullText.trim()) {
      throw new Error("Le document semble vide ou n'est pas un PDF lisible (ex: image scannée sans OCR).");
    }
    
    return fullText;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error);
    throw new Error(`Impossible de lire le fichier PDF: ${error.message}`);
  }
};