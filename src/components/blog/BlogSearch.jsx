import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BlogSearch = ({ searchTerm, onSearchChange, categoryFilter, onCategoryChange, categories }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Rechercher un article..." 
          className="pl-9 bg-slate-50 border-slate-200"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-64">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-slate-50 border-slate-200">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id || cat} value={cat.name || cat}>
                {cat.name || cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BlogSearch;