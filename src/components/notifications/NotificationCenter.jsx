import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Bell, CheckCircle, Trash2, Clock, Briefcase, BookOpen, Target, Settings, Info } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import NotificationPreferences from './NotificationPreferences';

const getIconForType = (type) => {
  switch(type) {
    case 'job_offer': return <Briefcase className="w-5 h-5 text-blue-500" />;
    case 'formation': return <BookOpen className="w-5 h-5 text-emerald-500" />;
    case 'plan': return <Target className="w-5 h-5 text-purple-500" />;
    case 'system': return <Info className="w-5 h-5 text-amber-500" />;
    default: return <Bell className="w-5 h-5 text-indigo-500" />;
  }
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
};

const NotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const res = await notificationService.getNotifications(user.id);
    if (res.success) {
      setNotifications(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    const res = await notificationService.markAsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleDelete = async (id) => {
    const res = await notificationService.deleteNotification(id);
    if (res.success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({ title: "Notification supprimée" });
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await notificationService.markAllAsRead(user.id);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({ title: "Tout est marqué comme lu" });
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-600" />
            Centre de notifications
          </h1>
          <p className="text-slate-500 mt-2">Gérez vos alertes et préférences de communication.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-2">
          <TabsList className="bg-transparent space-x-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-full px-4">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 rounded-full px-4 flex items-center gap-2">
              Non lues
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="secondary" className="bg-indigo-600 text-white hover:bg-indigo-700">{notifications.filter(n => !n.read).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-full px-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Préférences
            </TabsTrigger>
          </TabsList>
          
          {activeTab !== 'settings' && notifications.some(n => !n.read) && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
              <CheckCircle className="w-4 h-4 mr-2" /> Tout marquer comme lu
            </Button>
          )}
        </div>

        <TabsContent value="all" className="mt-0">
          <NotificationList 
            loading={loading} 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <NotificationList 
            loading={loading} 
            notifications={filteredNotifications} 
            onRead={handleMarkAsRead} 
            onDelete={handleDelete} 
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NotificationList = ({ loading, notifications, onRead, onDelete }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse h-24 bg-slate-50 border-slate-100" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Aucune notification</h3>
        <p className="text-slate-500">Vous êtes à jour !</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card 
            key={notif.id} 
            className={`transition-all duration-300 ${!notif.read ? 'bg-indigo-50/30 border-indigo-100 shadow-md' : 'bg-white border-slate-200 shadow-sm'} hover:shadow-md group`}
            onClick={() => !notif.read && onRead(notif.id)}
          >
            <CardContent className="p-4 sm:p-5 flex gap-4 cursor-pointer">
              <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                {getIconForType(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(notif.created_at)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className={`text-sm mt-1 line-clamp-2 ${!notif.read ? 'text-slate-700' : 'text-slate-500'}`}>
                  {notif.message}
                </p>
                {notif.action_url && (
                  <Button variant="link" className="px-0 h-auto mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold" onClick={(e) => { e.stopPropagation(); window.location.href = notif.action_url; }}>
                    {notif.action_label || "Voir les détails"} &rarr;
                  </Button>
                )}
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationCenter;