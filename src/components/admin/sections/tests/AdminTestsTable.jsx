import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TestCompletionIndicator from './TestCompletionIndicator';

const ITEMS_PER_PAGE = 10;

const AdminTestsTable = ({ data, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase() || '??';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[250px]">Utilisateur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Top Match</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  Aucun résultat trouvé pour les filtres sélectionnés.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((test) => {
                const user = test.profiles;
                const score = test.results?.baseResults?.confidence;
                const topCareer = test.results?.baseResults?.matchedCareers?.[0]?.career?.name;
                
                return (
                  <TableRow key={test.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                           <AvatarImage src={user?.avatar_url} />
                           <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                             {getInitials(user?.first_name, user?.last_name)}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sans nom' : 'Utilisateur supprimé'}
                          </div>
                          <div className="text-xs text-slate-500 max-w-[180px] truncate">
                            {user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                       {format(new Date(test.created_at), 'dd MMM yyyy', { locale: fr })}
                       <div className="text-xs text-slate-400">{format(new Date(test.created_at), 'HH:mm')}</div>
                    </TableCell>
                    <TableCell>
                       {score ? (
                         <Badge variant="outline" className={`${score > 70 ? 'bg-green-50 text-green-700 border-green-200' : score > 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {score}%
                         </Badge>
                       ) : <span className="text-slate-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm text-slate-800 max-w-[200px] truncate" title={topCareer}>
                        {topCareer || <span className="text-slate-400 italic">Non analysé</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex justify-center">
                         <TestCompletionIndicator status={test.results ? 'completed' : 'in_progress'} score={score} />
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onView(test)} className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-slate-500">
            Affichage de {startIndex + 1} à {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} sur {data.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-[3rem] text-center">
               Page {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestsTable;