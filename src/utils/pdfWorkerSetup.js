import * as pdfjsLib from 'pdfjs-dist';

let isInitialized = false;
let initError = null;

/**
 * Centralizes PDF.js worker initialization.
 * Detects if already initialized, sets path, and validates.
 */
export const initPdfWorker = async () => {
  if (isInitialized) {
    return { success: true };
  }
  
  try {
    // Vite handles this URL resolution during build and development
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).href;
    
    isInitialized = true;
    initError = null;
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize PDF worker:', error);
    initError = error;
    isInitialized = false;
    return { success: false, error };
  }
};

export const getPdfWorkerStatus = () => {
  return { isInitialized, error: initError };
};