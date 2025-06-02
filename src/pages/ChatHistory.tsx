import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Clock, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatThread {
  chatId: number;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  pdfIds: number[];
  pdfNames: string[];
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
          // Convert Json[] to number[] safely
          const pdfIds = Array.isArray(message.pdf_ids) ? 
            message.pdf_ids.filter(id => typeof id === 'number') as number[] : [];
          
          threadsMap.set(chatId, {
            chatId,
            lastMessage: message.MESSAGE || '',
            lastMessageTime: message.created_at,
            messageCount: 1,
            pdfIds,
            pdfNames: []
          });
        } else {
          const thread = threadsMap.get(chatId)!;
          thread.messageCount++;
          // Keep the latest message as last message
          if (new Date(message.created_at) > new Date(thread.lastMessageTime)) {
            thread.lastMessage = message.MESSAGE || '';
            thread.lastMessageTime = message.created_at;
            // Convert Json[] to number[] safely
            thread.pdfIds = Array.isArray(message.pdf_ids) ? 
              message.pdf_ids.filter(id => typeof id === 'number') as number[] : [];
          }
        }
      });

      // Convert to array and sort by last message time
      const threads = Array.from(threadsMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      // Fetch PDF names for each thread
      for (const thread of threads) {
        if (thread.pdfIds.length > 0) {
          const { data: pdfData, error: pdfError } = await supabase
            .from('PDF_DATA_INFO')
            .select('PDF NAME')
            .in('id', thread.pdfIds);

          if (!pdfError && pdfData) {
            thread.pdfNames = pdfData.map(pdf => pdf['PDF NAME']);
          }
        }
      }

      setChatThreads(threads);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error loading chat history",
        description: "Failed to load your chat history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 p-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Chat History</h1>
              <p className="text-sm text-gray-400 font-light">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
            </div>
          ) : chatThreads.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-600/40">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">No chat history yet</h3>
              <p className="text-gray-400 text-lg font-light">Start chatting with your PDFs to see your conversation history here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatThreads.map((thread) => (
                <Card
                  key={thread.chatId}
                  className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 cursor-pointer p-6 rounded-2xl hover:scale-[1.01] hover:shadow-lg group"
                  onClick={() => navigate(`/chat/${thread.chatId}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center border border-gray-600/40 group-hover:scale-105 transition-transform duration-200">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white tracking-tight">Chat #{thread.chatId}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">{formatTimeAgo(thread.lastMessageTime)}</span>
                            <span>•</span>
                            <span className="font-medium">{thread.messageCount} messages</span>
                          </div>
                        </div>
                      </div>

                      {/* Associated PDFs */}
                      {thread.pdfNames.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">PDFs in this chat:</p>
                          <div className="flex flex-wrap gap-2">
                            {thread.pdfNames.map((pdfName, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-300 truncate max-w-32 font-medium">{pdfName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Last message preview */}
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-light">
                        {thread.lastMessage.length > 150 
                          ? thread.lastMessage.substring(0, 150) + "..." 
                          : thread.lastMessage}
                      </p>
                    </div>

                    <Button
                      className="bg-gray-700/60 hover:bg-gray-600/80 text-white rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat/${thread.chatId}`);
                      }}
                    >
                      View Chat
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
