import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

export const EnhancedDataTable = ({ data = [], columns = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { toast } = useToast();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const triggerAction = (action) => {
    toast({
      title: "Action exécutée",
      description: `Action ${action} en cours de développement.`,
    });
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              {columns.map((col) => (
                <TableHead 
                  key={col.key} 
                  className={`cursor-pointer hover:bg-slate-100 transition-colors ${col.className || ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? sortedData.map((row, i) => (
              <TableRow key={row.id || i} className="hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => triggerAction('Détails')}>Voir les détails</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => triggerAction('Exporter')}>Exporter</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-slate-500">
                  Aucune donnée disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t flex justify-between items-center text-sm text-slate-500 bg-slate-50/50">
        <span>Affichage de {sortedData.length} résultats</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Précédent</Button>
          <Button variant="outline" size="sm" disabled>Suivant</Button>
        </div>
      </div>
    </div>
  );
};