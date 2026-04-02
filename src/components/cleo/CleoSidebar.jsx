import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, MessageSquare, Settings, History, Lock, Search, 
  Tag, Filter, MoreHorizontal, Trash2, Edit2, Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CleoSidebar = ({ activeSessionId, onSelectSession, onNewSession, disabled = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock history data enriched with tags and categories
  const history = [
    { 
      id: '1', 
      title: 'Réorientation vers la tech', 
      date: 'Il y a 2 jours',
      tags: ['Carrière', 'Tech'],
      category: 'career_advisor'
    },
    { 
      id: '2', 
      title: 'Analyse de mon CV', 
      date: 'Il y a 1 semaine',
      tags: ['CV', 'Optimisation'],
      category: 'career_advisor'
    },
    { 
      id: '3', 
      title: 'Simulation Entretien Python', 
      date: 'Il y a 2 semaines',
      tags: ['Entretien', 'Python'],
      category: 'interview_coach'
    },
  ];

  const filteredHistory = history.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full hidden md:flex shrink-0 font-sans">
      {/* Header & New Chat */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">Cléo</h1>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Coach IA</div>
          </div>
          <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold px-2">
            PRO
          </Badge>
        </div>
        
        <Button 
          onClick={onNewSession} 
          className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-[0.98] h-11"
          disabled={disabled}
        >
          <PlusCircle className="h-5 w-5 text-violet-300" />
          <span className="font-medium">Nouvelle discussion</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-9 h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between px-2 mb-2 mt-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Récent</h3>
              <button className="text-slate-400 hover:text-violet-600 transition-colors">
                <Filter size={12} />
              </button>
            </div>
            
            {disabled ? (
              <div className="px-2 py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 mx-1">
                <Lock className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Historique verrouillé</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredHistory.map((session) => (
                  <div key={session.id} className="group relative">
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={cn(
                        "w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex flex-col gap-1.5 border border-transparent",
                        activeSessionId === session.id 
                          ? 'bg-violet-50 text-violet-900 border-violet-100 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:border-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium truncate pr-6">{session.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-slate-400 flex items-center gap-1">
                           {session.category === 'interview_coach' ? <Zap size={10} className="text-amber-500"/> : <MessageSquare size={10}/>}
                           {session.date}
                         </span>
                         {session.tags.slice(0, 1).map((tag, i) => (
                           <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500">
                             #{tag}
                           </span>
                         ))}
                      </div>
                    </button>

                    {/* Quick Actions Menu */}
                    <div className={cn(
                      "absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity",
                      activeSessionId === session.id && "opacity-100"
                    )}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/50">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-xs gap-2">
                            <Edit2 size={12} /> Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2">
                            <Tag size={12} /> Ajouter un tag
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2 text-red-600 focus:text-red-600">
                            <Trash2 size={12} /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 h-9 px-2" onClick={() => navigate('/dashboard')}>
          <History className="h-4 w-4" />
          <span className="text-xs font-medium">Retour au Dashboard</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 h-9 px-2">
          <Settings className="h-4 w-4" />
          <span className="text-xs font-medium">Préférences IA</span>
        </Button>
      </div>
    </aside>
  );
};

export default CleoSidebar;