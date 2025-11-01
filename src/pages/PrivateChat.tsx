import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, MoreVertical, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_interest: string | null;
  user2_interest: string | null;
}

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  verified: boolean;
}

const PrivateChat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setCurrentUserId(user.id);

      // Verify match exists and user is part of it
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (matchError || !matchData) {
        toast.error('Match not found');
        navigate('/matches');
        return;
      }

      const match = matchData as Match;

      // Verify user is part of this match
      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        toast.error('You are not authorized to view this chat');
        navigate('/matches');
        return;
      }

      // Get the other user's profile
      const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, full_name, age, verified')
        .eq('user_id', otherUserId)
        .single();

      if (profileData) {
        setMatchProfile(profileData as Profile);
      }

      // Fetch existing messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
      setLoading(false);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user.id);

      setTimeout(scrollToBottom, 100);
    };

    initChat();

    // Subscribe to new messages
    const messageChannel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();

    return () => {
      messageChannel.unsubscribe();
    };
  }, [matchId, navigate]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    setSending(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: currentUserId,
        content: newMessage.trim(),
      });

    setSending(false);

    if (error) {
      toast.error('Could not send message');
    } else {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-copper/20 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/matches')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {matchProfile && (
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="font-serif text-xl text-text-dark">
                    {matchProfile.full_name}, {matchProfile.age}
                  </h1>
                </div>
                {matchProfile.verified && (
                  <Badge variant="secondary" className="bg-sage/10 text-sage">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-copper">Report user</DropdownMenuItem>
              <DropdownMenuItem className="text-copper">Block user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-warm-gray text-lg">
                Start the conversation. Take your time — there's no rush here.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender_id === currentUserId;
              const showFade = index === messages.length - 1 && !isOwn;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                    showFade ? 'animate-in fade-in duration-200' : ''
                  }`}
                >
                  <Card
                    className={`max-w-[70%] px-4 py-3 ${
                      isOwn
                        ? 'bg-copper/10 border-copper/20'
                        : 'bg-sage/10 border-sage/20'
                    }`}
                  >
                    <p className="text-text-dark leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </Card>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-copper/20 px-4 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                placeholder="Write your message... take your time."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[80px] resize-none border-copper/20 focus:border-copper"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-warm-gray">
                  {newMessage.length} characters
                </span>
                <span className="text-xs text-warm-gray">
                  Press Enter to send, Shift + Enter for new line
                </span>
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="mb-10"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
