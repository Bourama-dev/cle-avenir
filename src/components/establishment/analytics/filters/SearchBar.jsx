import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SearchBar = ({ onSearch, placeholder = "Rechercher...", className = "" }) => {
  const [query, setQuery] = useState('');

  // Debounce logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        id="global-search-input"
        type="text"
        placeholder={`${placeholder} (Ctrl+K)`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-10 w-full bg-white/50 backdrop-blur-sm border-slate-200"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};