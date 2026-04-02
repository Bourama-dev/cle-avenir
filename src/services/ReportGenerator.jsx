import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export const ReportGenerator = ({ data, title }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
      <FileDown className="h-4 w-4" />
      Générer Rapport PDF
    </Button>
  );
};