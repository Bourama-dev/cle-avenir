import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout flex min-h-screen w-full bg-[var(--bg-secondary)]">
      <AdminSidebar />
      <div className="admin-content flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}