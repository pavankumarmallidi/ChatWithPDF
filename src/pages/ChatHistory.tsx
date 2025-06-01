import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Plus, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatThread {
  chatId: number;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
}

const ChatHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('CHAT_HISTORY')
        .select('*')
        .eq('EMAIL_ID', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by CHAT_ID
      const threadsMap = new Map<number, ChatThread>();
      
      data?.forEach((message) => {
        const chatId = message.CHAT_ID;
        if (!threadsMap.has(chatId)) {
          threadsMap.set(chatId, {
            chatId,
            lastMessage: message.MESSAGE || '',
            lastMessageTime: message.created_at,
            messageCount: 1
          });
        } else {
          const thread = threadsMap.get(chatId)!;
          thread.messageCount++;
          // Keep the latest message as last message
          if (new Date(message.created_at) > new Date(thread.lastMessageTime)) {
            thread.lastMessage = message.MESSAGE || '';
            thread.lastMessageTime = message.created_at;
          }
        }
      });

      setChatThreads(Array.from(threadsMap.values())
        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()));
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    const newChatId = Date.now();
    navigate(`/chat/${newChatId}`);
  };

  const continueChat = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b border-[#2d3748]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Chat History</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            
            <Button
              onClick={startNewChat}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading chat history...</p>
          </div>
        ) : chatThreads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No chat history yet</h3>
            <p className="text-gray-400 mb-6">Start your first conversation with AI</p>
            <Button
              onClick={startNewChat}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {chatThreads.map((thread) => (
              <Card key={thread.chatId} className="bg-[#1a1a2e] border-[#2d3748] rounded-2xl p-6 hover:bg-[#232347] transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Chat #{thread.chatId}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(thread.lastMessageTime)}</span>
                          <span>•</span>
                          <span>{thread.messageCount} messages</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {thread.lastMessage}
                    </p>
                  </div>
                  <Button
                    onClick={() => continueChat(thread.chatId)}
                    className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl ml-4"
                  >
                    Continue Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
