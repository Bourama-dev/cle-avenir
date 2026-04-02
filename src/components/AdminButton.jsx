import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { isUserAdmin } from '@/services/userProfile';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import '@/styles/AdminButton.css';

const AdminButton = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Only render if user is admin
  if (!isUserAdmin(userProfile)) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/admin')}
            className="admin-button"
            variant="default"
          >
            <Settings className="h-4 w-4 mr-2 animate-spin-slow" />
            <span className="font-semibold">Admin</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="admin-tooltip-content">
          <p>Accéder à la console d'administration</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminButton;