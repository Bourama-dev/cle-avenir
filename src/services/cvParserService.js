import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for PDF.js to a CDN to ensure it works in browser without complex build config
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const cvParserService = {
  /**
   * Extracts text from a File object (PDF or DOCX)
   * @param {File} file 
   * @returns {Promise<string>} Raw text content
   */
  async extractText(file) {
    if (file.type === 'application/pdf') {
      return this.extractPdfText(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractDocxText(file);
    } else {
      throw new Error("Format de fichier non supporté. Utilisez PDF ou DOCX.");
    }
  },

  async extractPdfText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Add basic layout preservation by checking Y position or just join with space
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      throw new Error("Impossible de lire le fichier PDF. Il peut être protégé ou corrompu.");
    }
  },

  async extractDocxText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("DOCX Parsing Error:", error);
      throw new Error("Impossible de lire le fichier Word.");
    }
  }
};