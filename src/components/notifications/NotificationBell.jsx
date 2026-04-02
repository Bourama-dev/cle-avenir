import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { notificationService } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    const res = await notificationService.getUnreadNotifications(user.id);
    if (res.success) {
      setUnreadCount(res.count);
      setRecentNotifs(res.data.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (!user) return;
    
    // Real-time subscription for notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        setUnreadCount(prev => prev + 1);
        setRecentNotifs(prev => [payload.new, ...prev].slice(0, 5));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setUnreadCount(prev => Math.max(0, prev - 1));
    setRecentNotifs(prev => prev.filter(n => n.id !== id));
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white rounded-full border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl border-slate-200" align="end">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
          <h4 className="font-bold text-slate-800">Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer" onClick={() => notificationService.markAllAsRead(user.id).then(fetchNotifications)}>
              Tout marquer comme lu
            </Badge>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {recentNotifs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              Aucune nouvelle notification
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {recentNotifs.map(notif => (
                <div 
                  key={notif.id} 
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    if (notif.action_url) navigate(notif.action_url);
                    setIsOpen(false);
                  }}
                >
                  <p className="text-sm font-semibold text-slate-800 mb-1">{notif.title}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg">
          <Button 
            variant="ghost" 
            className="w-full text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium"
            onClick={() => {
              navigate('/notifications');
              setIsOpen(false);
            }}
          >
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;