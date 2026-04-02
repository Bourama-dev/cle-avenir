import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/customSupabaseClient';

export const UserFilterComponent = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Mocking user fetch from profiles for visual representation
        const mockUsers = [
          { id: '1', first_name: 'Jean', last_name: 'Dupont', email: 'jean.dupont@email.com', institution: 'Lycée Hugo' },
          { id: '2', first_name: 'Marie', last_name: 'Curie', email: 'marie.c@email.com', institution: 'Lycée Hugo' },
          { id: '3', first_name: 'Lucas', last_name: 'Martin', email: 'lucas.m@email.com', institution: 'Lycée Hugo' },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[280px] justify-between bg-white/50 backdrop-blur-sm"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedUser.first_name} {selectedUser.last_name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <User className="h-4 w-4" />
              <span>Filtrer par utilisateur...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un utilisateur..." />
          <CommandList>
            <CommandEmpty>{loading ? "Chargement..." : "Aucun utilisateur trouvé."}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check className={cn("mr-2 h-4 w-4", value === null ? "opacity-100" : "opacity-0")} />
                Tous les utilisateurs
              </CommandItem>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.first_name} ${user.last_name} ${user.email}`}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="font-medium truncate">{user.first_name} {user.last_name}</span>
                      <span className="text-xs text-slate-500 truncate">{user.email}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};