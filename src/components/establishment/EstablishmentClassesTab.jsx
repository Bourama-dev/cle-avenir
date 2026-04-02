import React, { useState, useEffect } from 'react';
import { establishmentService } from '@/services/establishmentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EstablishmentClassesTab = ({ establishmentId }) => {
  const { toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await establishmentService.getEstablishmentClasses(establishmentId);
        setClasses(data);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger les classes', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [establishmentId]);

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des classes</h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher une classe..." 
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
              <TableHead>Nom de la classe</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Élèves</TableHead>
              <TableHead>Professeur Principal</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : filteredClasses.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Aucune classe trouvée</TableCell></TableRow>
            ) : (
              filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
                  <TableCell>{cls.student_count}</TableCell>
                  <TableCell>{cls.teacher}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'Active' ? 'default' : 'secondary'}>{cls.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Non implémenté" })}>
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Non implémenté" })}>
                      <Settings className="h-4 w-4" />
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

export default EstablishmentClassesTab;