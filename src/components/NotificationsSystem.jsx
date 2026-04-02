import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Badge } from '@/components/ui/badge';

const NotificationsSystem = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            
            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        };

        fetchNotifications();

        // Subscribe to real-time notifications
        const subscription = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const markAllRead = async () => {
        if (!user) return;
        
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);
            
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-red-500 text-[10px]">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="xs" className="h-auto p-1 text-xs text-primary" onClick={markAllRead}>
                            <CheckCheck className="mr-1 h-3 w-3" /> Tout lire
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Aucune notification.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map(notif => (
                                <div key={notif.id} className={`p-4 text-sm hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                    <div className="font-medium mb-1">{notif.title}</div>
                                    <p className="text-muted-foreground text-xs leading-relaxed">{notif.message}</p>
                                    <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                                        <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                                        {notif.type && <Badge variant="outline" className="text-[9px] h-4">{notif.type}</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationsSystem;