import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_signup': return '👤';
      case 'test_completed': return '✅';
      case 'contact_form': return '📧';
      case 'bug_report': return '🐛';
      case 'payment': return '💳';
      case 'weekly_report': return '📊';
      default: return '🔔';
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button 
        className="notification-bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-slate-500">{unreadCount} non lues</span>
            )}
            <button 
              className="md:hidden p-1 text-slate-400"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>Aucune notification pour le moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="notification-item">
                  <span className="notification-icon" role="img" aria-label="icon">
                    {getNotificationIcon(notif.type)}
                  </span>
                  <div className="notification-content">
                    <div className="notification-title">{notif.title}</div>
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{formatTime(notif.created_at)}</span>
                    
                    <div className="notification-actions">
                      <button 
                        className="btn-notif-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                      >
                        <Check size={12} className="inline mr-1" /> Marquer comme lu
                      </button>
                      <button 
                        className="btn-notif-action btn-notif-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                      >
                        <Trash2 size={12} className="inline mr-1" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;