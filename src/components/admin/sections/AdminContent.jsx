import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Redirect to the dedicated content management page
const AdminContent = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/admin/content', { replace: true }); }, [navigate]);
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
    </div>
  );
};

export default AdminContent;
