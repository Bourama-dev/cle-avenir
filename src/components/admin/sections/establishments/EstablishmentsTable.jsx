import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, GraduationCap, Copy, ShieldCheck, Mail, LayoutDashboard, Loader2, Lock, Key } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const EstablishmentsTable = ({ 
  data, 
  loading,
  onEdit, 
  onDelete, 
  onAccessDashboard,
  sort, 
  onSort, 
  pagination, 
  onPageChange,
  onRetry
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const SortIcon = ({ column }) => {
    if (sort.column !== column) return null;
    return <span className="ml-1 text-xs">{sort.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({ 
      title: "Copié !",
      description: "Code copié dans le presse-papier.",
      className: "bg-green-50 border-green-200",
      duration: 1500 
    });
  };

  const handleDashboardClick = (id) => {
    console.log('[Navigation] Accessing dashboard for establishment ID:', id);
    if (onAccessDashboard) {
      onAccessDashboard(id);
    } else {
      // Fallback if prop isn't passed correctly
      navigate(`/admin/establishment/${id}/dashboard`);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading && (!data || data.length === 0)) {
    return (
      <div className="rounded-md border bg-white overflow-hidden shadow-sm p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2 flex-1">
               <Skeleton className="h-4 w-[250px]" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
             <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <GraduationCap className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun établissement trouvé</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          Aucun résultat ne correspond à vos critères de recherche. Essayez de modifier les filtres.
        </p>
        <Button variant="outline" onClick={onRetry}>
          <Loader2 className="mr-2 h-4 w-4" />
          Rafraîchir les données
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
             <div className="bg-white p-2 rounded-full shadow-lg">
                <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
             </div>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort('name')}>Nom <SortIcon column="name"/></TableHead>
              <TableHead className="font-semibold text-center">Identifiants</TableHead>
              <TableHead className="font-semibold text-center">Contacts</TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort('city')}>Localisation <SortIcon column="city"/></TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              if (!item || !item.id) return null;
              
              const code = item.establishment_code || item.uai || item.code;
              const hasPassword = !!item.activation_password;
              
              return (
                <TableRow key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-semibold group-hover:text-purple-700 transition-colors">{item.name || 'Sans nom'}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                         <GraduationCap size={12}/> {item.type || 'Non spécifié'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                        {code ? (
                          <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit" title="Code UAI généré">
                              <span className="font-mono text-xs text-slate-700 font-bold">{code}</span>
                              <button onClick={() => copyCode(code)} className="text-slate-400 hover:text-purple-600 transition-colors">
                                  <Copy size={12} />
                              </button>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-[10px]">
                            Code manquant
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1 mt-1">
                            {hasPassword ? (
                                <span className="text-[10px] text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100" title="Mot de passe défini">
                                    <Lock size={10} /> MDP Défini
                                </span>
                            ) : (
                                <span className="text-[10px] text-red-500 flex items-center gap-0.5 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100" title="Mot de passe non défini">
                                    <Key size={10} /> MDP Manquant
                                </span>
                            )}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                          <div className="inline-flex items-center justify-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100" title={`${item.email_count || item.emails?.length || 0} emails autorisés`}>
                              <Mail size={12} />
                              <span className="font-bold">{item.email_count || item.emails?.length || 0}</span>
                          </div>
                          {item.contact_email && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={item.contact_email}>
                                {item.contact_email}
                            </span>
                          )}
                      </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                       <MapPin className="h-4 w-4 text-slate-400" />
                       {item.city || <span className="text-slate-300 italic">N/A</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col gap-1">
                        <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className={item.status === 'active' ? 'bg-green-100 text-green-700 border-green-200 w-fit' : 'bg-slate-100 text-slate-700 border-slate-200 w-fit'}>
                          {item.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                        {item.last_access ? (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title={`Dernière activité: ${new Date(item.last_access).toLocaleDateString()}`}>
                               Actif le {new Date(item.last_access).toLocaleDateString()}
                            </span>
                        ) : (
                            <span className="text-[10px] text-slate-300 italic">Jamais connecté</span>
                        )}
                     </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => handleDashboardClick(item.id)}
                               className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                             >
                                <LayoutDashboard className="h-4 w-4" />
                             </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Accéder au dashboard</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Modifier</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Supprimer</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-slate-500 order-2 sm:order-1">
          Affichage de {Math.min(((pagination.page - 1) * pagination.limit) + 1, pagination.total)} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} résultats
        </div>
        <div className="order-1 sm:order-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) onPageChange(pagination.page - 1);
                  }}
                  className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => e.preventDefault()} isActive>
                  {pagination.page}
                </PaginationLink>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page < totalPages) onPageChange(pagination.page + 1);
                  }}
                  className={pagination.page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentsTable;