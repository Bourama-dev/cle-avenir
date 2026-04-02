import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Building, Target, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StatsGrid = ({ stats }) => {
  const { toast } = useToast();

  // 1. Safety Check: Default to 0 if stats is undefined/null
  // This prevents the "Cannot read properties of undefined" crash
  const safeStats = {
    savedJobs: stats?.savedJobs || 0,
    savedFormations: stats?.savedFormations || 0,
    savedMetiers: stats?.savedMetiers || 0,
    goalsCompleted: stats?.goalsCompleted || 0
  };

  const statsConfig = [
    { label: "Offres suivies", value: safeStats.savedJobs, icon: Briefcase, color: "text-primary bg-primary/10" },
    { label: "Formations", value: safeStats.savedFormations, icon: GraduationCap, color: "text-accent bg-accent/10" },
    { label: "Métiers favoris", value: safeStats.savedMetiers, icon: Building, color: "text-secondary bg-secondary/10" },
    { label: "Objectifs atteints", value: safeStats.goalsCompleted, icon: Target, color: "text-rose-500 bg-rose-50" },
  ];

  const handleExport = () => {
      toast({
        title: "Téléchargement lancé",
        description: "Votre synthèse de profil est en cours de génération...",
      });
      setTimeout(() => {
           // Simulate download
           const element = document.createElement("a");
           const file = new Blob(["Synthese Profil CléAvenir\n\nCeci est un export simplifié."], {type: 'text/plain'});
           element.href = URL.createObjectURL(file);
           element.download = "mon_profil_cleavenir.txt";
           document.body.appendChild(element);
           element.click();
           document.body.removeChild(element);
      }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statsConfig.map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <span className="text-2xl font-bold text-foreground block leading-none mb-1">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                </div>
            </div>
        ))}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 text-white flex flex-col justify-center items-center text-center shadow-lg cursor-pointer hover:scale-[1.02] transition-transform" onClick={handleExport}>
             <Download className="w-6 h-6 mb-2 opacity-80" />
             <span className="font-bold text-sm">Exporter CV</span>
             <span className="text-[10px] opacity-60">Format PDF / Texte</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsGrid;