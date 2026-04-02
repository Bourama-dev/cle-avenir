import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText, Printer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const AdminTestsExport = ({ data }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        throw new Error("Aucune donnée à exporter");
      }

      const headers = ["ID", "Utilisateur", "Email", "Date", "Score", "Métier Top 1", "Statut"];
      const csvContent = [
        headers.join(","),
        ...data.map(item => {
          const score = item.results?.baseResults?.confidence || 0;
          const topMatch = item.results?.baseResults?.matchedCareers?.[0]?.career?.name || "N/A";
          const user = item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : "Utilisateur supprimé";
          const email = item.profiles?.email || "N/A";
          
          return [
            item.id,
            `"${user}"`,
            email,
            format(new Date(item.created_at), 'yyyy-MM-dd HH:mm'),
            score,
            `"${topMatch}"`,
            "Complété"
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `test_results_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été généré avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) throw new Error("Aucune donnée");

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `test_results_${format(new Date(), 'yyyy-MM-dd')}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export JSON réussi" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: e.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Choisir un format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4 text-blue-500" />
          <span>Excel (CSV)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} disabled={isExporting}>
          <FileJson className="mr-2 h-4 w-4 text-orange-500" />
          <span>JSON Brut</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4 text-slate-500" />
          <span>Imprimer / PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminTestsExport;