export const DataExportService = {
  exportToCSV(data, filename) {
    if (!data || !data.length) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToExcel(data, filename) {
    // Fallback to CSV for environment compatibility
    this.exportToCSV(data, filename);
  },

  exportToPDF() {
    window.print();
  }
};