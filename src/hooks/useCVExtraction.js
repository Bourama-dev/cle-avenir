import { useState, useEffect } from 'react';
import { extractTextFromPDF } from '@/utils/cvExtraction';
import { extractStructuredCVData } from '@/utils/cvDataExtractor';
import { validateCVData } from '@/utils/cvDataValidator';
import { initPdfWorker, getPdfWorkerStatus } from '@/utils/pdfWorkerSetup';

export const useCVExtraction = () => {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [error, setError] = useState(null);
  const [workerStatus, setWorkerStatus] = useState({ isInitialized: false, error: null });

  useEffect(() => {
    const setupWorker = async () => {
      const result = await initPdfWorker();
      setWorkerStatus({ isInitialized: result.success, error: result.error });
    };
    setupWorker();
  }, []);

  const processCV = async (file) => {
    setExtracting(true);
    setError(null);
    setExtractedData(null);
    setValidation(null);

    try {
      if (!workerStatus.isInitialized) {
        const retryResult = await initPdfWorker();
        if (!retryResult.success) {
          throw new Error(`PDF Worker non initialisé: ${retryResult.error?.message || 'Erreur inconnue'}`);
        }
        setWorkerStatus({ isInitialized: true, error: null });
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Le fichier doit être au format PDF.');
      }

      const rawText = await extractTextFromPDF(file);
      const structuredData = extractStructuredCVData(rawText);
      const validationResult = validateCVData(structuredData);
      
      setExtractedData(structuredData);
      setValidation(validationResult);
      setExtracting(false);
      return { data: structuredData, validation: validationResult };
    } catch (err) {
      console.error('Extraction Error:', err);
      setError(err.message || 'Erreur lors de l\'analyse du CV.');
      setExtracting(false);
      throw err;
    }
  };

  const clearData = () => {
    setExtractedData(null);
    setValidation(null);
    setError(null);
  };

  return { processCV, extractedData, validation, extracting, error, clearData, workerStatus };
};