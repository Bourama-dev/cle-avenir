import { DataExportService } from '../DataExportService';

export const ReportGenerationService = {
  generateGeneralReport(data, format = 'csv') {
    if (format === 'csv' || format === 'excel') {
      DataExportService.exportToCSV(data, 'rapport_general');
    } else if (format === 'pdf') {
      DataExportService.exportToPDF();
    }
  },

  generateClassReport(classId, data, format = 'csv') {
    const classData = data.filter(d => d.classId === classId);
    DataExportService.exportToCSV(classData, `rapport_classe_${classId}`);
  },

  generateTrendForecast(trends, format = 'pdf') {
    DataExportService.exportToPDF();
  }
};