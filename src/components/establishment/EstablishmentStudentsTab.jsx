import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, BarChart, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentStudentsTab = ({ establishmentId }) => {
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await establishmentService.getEstablishmentStudents(establishmentId);
        setStudents(data);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger les étudiants', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [establishmentId]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des étudiants</h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un étudiant..." 
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
              <TableHead>Classe</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Tests Complétés</TableHead>
              <TableHead>Profil Dominant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Aucun étudiant trouvé</TableCell></TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div>{student.name}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Actif' ? 'default' : 'secondary'}>{student.status}</Badge>
                  </TableCell>
                  <TableCell>{student.tests_completed}</TableCell>
                  <TableCell>{student.dominant_profile}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Non implémenté" })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Non implémenté" })}>
                      <BarChart className="h-4 w-4" />
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

export default EstablishmentStudentsTab;