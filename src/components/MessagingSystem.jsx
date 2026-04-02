import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MoreVertical, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessagingSystem = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        
        // Fetch unique conversations
        const fetchConversations = async () => {
            // Simplified logic: fetch messages where user is sender or receiver
            // In a real robust system, you'd have a 'conversations' table
            const { data, error } = await supabase
                .from('direct_messages')
                .select(`
                    *,
                    sender:profiles!sender_id(first_name, last_name, avatar_url),
                    receiver:profiles!receiver_id(first_name, last_name, avatar_url)
                `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (data) {
                // Group by conversation partner
                const grouped = {};
                data.forEach(msg => {
                    const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
                    const partner = msg.sender_id === user.id ? msg.receiver : msg.sender;
                    
                    if (!grouped[partnerId]) {
                        grouped[partnerId] = {
                            partnerId,
                            partner,
                            lastMessage: msg,
                            unreadCount: (msg.receiver_id === user.id && !msg.is_read) ? 1 : 0
                        };
                    }
                });
                setConversations(Object.values(grouped));
            }
        };

        fetchConversations();
        
        // Subscribe to new messages
        const subscription = supabase
            .channel('public:direct_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
                // Logic to update UI on new message
                fetchConversations(); // Refresh list for now
                if (selectedConversation && (payload.new.sender_id === selectedConversation.partnerId || payload.new.receiver_id === selectedConversation.partnerId)) {
                    setMessages(prev => [...prev, payload.new]);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, selectedConversation]);

    useEffect(() => {
        if (selectedConversation) {
            const fetchMessages = async () => {
                const { data } = await supabase
                    .from('direct_messages')
                    .select('*')
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation.partnerId}),and(sender_id.eq.${selectedConversation.partnerId},receiver_id.eq.${user.id})`)
                    .order('created_at', { ascending: true });
                setMessages(data || []);
                
                // Mark as read
                await supabase.from('direct_messages')
                    .update({ is_read: true })
                    .eq('sender_id', selectedConversation.partnerId)
                    .eq('receiver_id', user.id)
                    .eq('is_read', false);
            };
            fetchMessages();
        }
    }, [selectedConversation, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const { error } = await supabase.from('direct_messages').insert({
            sender_id: user.id,
            receiver_id: selectedConversation.partnerId,
            content: newMessage,
            is_read: false
        });

        if (!error) {
            setNewMessage('');
            // Optimistic update handled by subscription or local state
        }
    };

    return (
        <div className="flex h-[600px] border rounded-xl bg-background overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b bg-muted/30">
                    <h2 className="font-semibold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher..." className="pl-8 bg-background" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Aucune conversation.</div>
                    ) : (
                        conversations.map(conv => (
                            <div 
                                key={conv.partnerId}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors flex gap-3 ${selectedConversation?.partnerId === conv.partnerId ? 'bg-muted' : ''}`}
                            >
                                <Avatar>
                                    <AvatarImage src={conv.partner?.avatar_url} />
                                    <AvatarFallback>{conv.partner?.first_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-medium truncate">{conv.partner?.first_name} {conv.partner?.last_name}</span>
                                        <span className="text-xs text-muted-foreground">{format(new Date(conv.lastMessage.created_at), 'HH:mm')}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedConversation.partner?.avatar_url} />
                                    <AvatarFallback>{selectedConversation.partner?.first_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium">{selectedConversation.partner?.first_name} {selectedConversation.partner?.last_name}</h3>
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-600 rounded-full"></span> En ligne
                                    </span>
                                </div>
                             </div>
                             <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg ${
                                            msg.sender_id === user.id 
                                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                            : 'bg-muted text-foreground rounded-tl-none'
                                        }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <span className="text-[10px] opacity-70 block text-right mt-1">
                                                {format(new Date(msg.created_at), 'HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-background flex gap-2">
                            <Input 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..." 
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Send className="h-8 w-8 opacity-50" />
                        </div>
                        <p>Sélectionnez une conversation pour commencer à discuter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingSystem;