import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-6 mt-4 pagination-container">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
      <span className="text-sm font-semibold text-slate-700 page-info min-w-[100px] text-center">
        Page {currentPage} sur {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default Pagination;