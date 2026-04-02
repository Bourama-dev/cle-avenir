import React from 'react';
import { getUserProfile, isUserAdmin } from '@/services/userProfile';
import AdminBadge from './AdminBadge';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const userProfile = getUserProfile();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              CléAvenir
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="flex items-center gap-4">
                <AdminBadge />
                {isUserAdmin(userProfile) && (
                  <Link to="/admin/dashboard" className="text-violet-600 hover:text-violet-700 font-bold text-sm">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                  Mon Espace
                </Link>
              </div>
            )}
            {!userProfile && (
               <div className="flex items-center gap-4">
                 <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">Connexion</Link>
                 <Link to="/signup" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-violet-700 transition">Commencer</Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}