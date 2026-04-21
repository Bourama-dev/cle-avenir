import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, MessageSquare, Settings, History, Lock, Search,
  Filter, MoreHorizontal, Trash2, Edit2, Zap, Loader2, Check, X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cleoService } from '@/services/cleoService';
import CleoPreferencesModal from './CleoPreferencesModal';

// Relative date helper
function relativeDate(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 2)   return 'À l\'instant';
  if (mins  < 60)  return `Il y a ${mins} min`;
  if (hours < 24)  return `Il y a ${hours}h`;
  if (days  < 7)   return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const CleoSidebar = ({
  userId,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onSessionDeleted,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const [sessions, setSessions]           = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [renamingId, setRenamingId]       = useState(null);
  const [renameValue, setRenameValue]     = useState('');
  const [showPrefs, setShowPrefs]         = useState(false);
  const renameInputRef                    = useRef(null);

  // ── Load sessions on mount, when userId changes, or when active session changes ──
  useEffect(() => {
    if (!userId || disabled) return;
    loadSessions();
  }, [userId, disabled, activeSessionId]);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus();
  }, [renamingId]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await cleoService.getAllSessions(userId);
      setSessions(data);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── New session ──────────────────────────────────────────────────────────
  const handleNewSession = () => {
    onNewSession?.();
    // Optimistically clear any active highlight; list will refresh on first message
  };

  // ── Delete session ────────────────────────────────────────────────────────
  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await cleoService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      onSessionDeleted?.(sessionId);
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // ── Rename session ────────────────────────────────────────────────────────
  const startRename = (e, session) => {
    e.stopPropagation();
    setRenamingId(session.id);
    setRenameValue(session.title || 'Discussion');
  };

  const confirmRename = async (sessionId) => {
    const trimmed = renameValue.trim();
    if (!trimmed) { cancelRename(); return; }
    try {
      await cleoService.updateSession(sessionId, { title: trimmed });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: trimmed } : s));
    } catch (err) {
      console.error('Error renaming session:', err);
    } finally {
      cancelRename();
    }
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredSessions = sessions.filter(s =>
    (s.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Infer category icon from context_data ─────────────────────────────────
  const getCategoryIcon = (session) => {
    const mode = session.context_data?.mode;
    if (mode === 'interview_coach') return <Zap size={10} className="text-amber-500" />;
    return <MessageSquare size={10} />;
  };

  return (
    <>
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
            onClick={handleNewSession}
            className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-[0.98] h-11"
            disabled={disabled}
          >
            <PlusCircle className="h-5 w-5 text-violet-300" />
            <span className="font-medium">Nouvelle discussion</span>
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* History List */}
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-2 mt-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Discussions
              </h3>
              <button
                onClick={loadSessions}
                title="Actualiser"
                className="text-slate-400 hover:text-violet-600 transition-colors"
              >
                <Filter size={12} />
              </button>
            </div>

            {disabled ? (
              <div className="px-2 py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 mx-1">
                <Lock className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Historique verrouillé</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="px-2 py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 mx-1">
                <MessageSquare className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  {searchTerm ? 'Aucun résultat' : 'Aucune discussion'}
                </p>
                {!searchTerm && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Démarre une nouvelle conversation
                  </p>
                )}
              </div>
            ) : (
              filteredSessions.map(session => (
                <div key={session.id} className="group relative">
                  {/* Rename mode */}
                  {renamingId === session.id ? (
                    <div className="flex items-center gap-1 px-2 py-2">
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') confirmRename(session.id);
                          if (e.key === 'Escape') cancelRename();
                        }}
                        className="flex-1 text-sm border border-violet-400 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                      />
                      <button
                        onClick={() => confirmRename(session.id)}
                        className="p-1 rounded hover:bg-emerald-50 text-emerald-600"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelRename}
                        className="p-1 rounded hover:bg-red-50 text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    /* Normal mode */
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={cn(
                        'w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex flex-col gap-1.5 border border-transparent',
                        activeSessionId === session.id
                          ? 'bg-violet-50 text-violet-900 border-violet-100 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:border-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium truncate pr-6">
                          {session.title || 'Discussion sans titre'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          {getCategoryIcon(session)}
                          {relativeDate(session.updated_at)}
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Actions menu (hidden during rename) */}
                  {renamingId !== session.id && (
                    <div className={cn(
                      'absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity',
                      activeSessionId === session.id && 'opacity-100'
                    )}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-white/70"
                            onClick={e => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            className="text-xs gap-2 cursor-pointer"
                            onClick={e => startRename(e, session)}
                          >
                            <Edit2 size={12} /> Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={e => handleDelete(e, session.id)}
                          >
                            <Trash2 size={12} /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 h-9 px-2"
            onClick={() => navigate('/dashboard')}
          >
            <History className="h-4 w-4" />
            <span className="text-xs font-medium">Retour au Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-500 hover:text-violet-700 hover:bg-violet-50 h-9 px-2"
            onClick={() => setShowPrefs(true)}
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs font-medium">Préférences IA</span>
          </Button>
        </div>
      </aside>

      {/* Preferences modal */}
      <CleoPreferencesModal isOpen={showPrefs} onClose={() => setShowPrefs(false)} />
    </>
  );
};

export default CleoSidebar;
