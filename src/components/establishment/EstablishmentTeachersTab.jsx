import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentTeachersTab = ({ establishmentId }) => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await establishmentService.getEstablishmentTeachers(establishmentId);
        setTeachers(data);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger les professeurs', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [establishmentId]);

  const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Équipe pédagogique</h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un professeur..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Matières</TableHead>
              <TableHead>Nombre de classes</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : filteredTeachers.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Aucun professeur trouvé</TableCell></TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    <div>{teacher.name}</div>
                    <div className="text-xs text-slate-500">{teacher.email}</div>
                  </TableCell>
                  <TableCell>{teacher.subjects}</TableCell>
                  <TableCell>{teacher.classes}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'Actif' ? 'default' : 'secondary'}>{teacher.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Non implémenté" })}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EstablishmentTeachersTab;