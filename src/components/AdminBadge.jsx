import React from 'react';
import { getUserProfile, isUserAdmin } from '@/services/userProfile';

export default function AdminBadge() {
  const userProfile = getUserProfile();

  if (!isUserAdmin(userProfile)) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-700 rounded-full">
      <span className="text-red-400 text-xs font-bold">🔐 ADMIN</span>
    </div>
  );
}