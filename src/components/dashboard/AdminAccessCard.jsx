import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import '@/styles/AdminAccess.css';

const AdminAccessCard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-quick-access">
      <div className="quick-access-card">
        <div className="card-header">
          <h3>
            <ShieldCheck size={28} />
            Espace Admin
          </h3>
          <div className="card-content">
            <p>
              Gérez les utilisateurs, surveillez les statistiques et administrez le contenu de la plateforme depuis votre interface dédiée.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/admin')} 
          className="btn-admin-access"
        >
          Accéder à l'espace admin
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminAccessCard;