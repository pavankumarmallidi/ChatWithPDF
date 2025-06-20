import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, User, Bot, FileText, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatMessageDateTime } from "@/lib/utils";

interface ChatMessage {
  id: number;
  chatId: number;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const ChatThread = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pdfIds, setPdfIds] = useState<number[]>([]);
  const [pdfNames, setPdfNames] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user?.email && chatId) {
      loadChatMessages();
    }
  }, [user, chatId]);

  const loadChatMessages = async () => {
    if (!user?.email || !chatId) return;

    try {
      const { data, error } = await supabase
        .from('CHAT_HISTORY')
        .select('*')
        .eq('EMAIL_ID', user.email)
        .eq('CHAT_ID', parseInt(chatId))
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = data?.map((msg) => ({
        id: msg.id,
        chatId: msg.CHAT_ID,
        sender: msg.SENDER.toLowerCase() as 'user' | 'ai',
        message: msg.MESSAGE || '',
        timestamp: msg.created_at
      })) || [];

      // Get PDF IDs from the first message (they should be consistent across the chat)
      if (data && data.length > 0) {
        // Convert Json[] to number[] safely
        const chatPdfIds = Array.isArray(data[0].pdf_ids) ? 
          data[0].pdf_ids.filter(id => typeof id === 'number') as number[] : [];
        setPdfIds(chatPdfIds);
        
        // Fetch PDF names
        if (chatPdfIds.length > 0) {
          const { data: pdfData } = await supabase
            .from('PDF_DATA_INFO')
            .select('"PDF NAME"')
            .in('id', chatPdfIds);
          
          setPdfNames(pdfData?.map(pdf => pdf['PDF NAME']) || []);
        }
      }

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveMessageToHistory = async (message: string, sender: 'user' | 'ai') => {
    if (!user?.email || !chatId) return;

    try {
      const { error } = await supabase
        .from('CHAT_HISTORY')
        .insert({
          CHAT_ID: parseInt(chatId),
          EMAIL_ID: user.email,
          SENDER: sender,
          RECIVER: sender === 'user' ? 'ai' : 'user',
          MESSAGE: message,
          pdf_ids: pdfIds
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive",
      });
    }
  };

  const sendToWebhook = async (message: string) => {
    const webhookUrl = "https://pavan.every-ai.com/webhook/message-receive";
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          pdfIds: pdfIds, // Send the actual PDF IDs from this chat
          userEmail: user?.email,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user?.email) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const userChatMessage: ChatMessage = {
      id: Date.now(),
      chatId: parseInt(chatId!),
      sender: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userChatMessage]);

    // Save user message to database
    await saveMessageToHistory(userMessage, 'user');

    try {
      // Get AI response
      const response = await sendToWebhook(userMessage);
      
      let aiMessageContent = "I received your message and I'm processing it.";

      // Handle the webhook response format: array with output object
      if (Array.isArray(response) && response.length > 0) {
        const firstResult = response[0];
        if (firstResult.output && firstResult.output.answer) {
          aiMessageContent = firstResult.output.answer;
        }
      }

      // Add AI message to UI
      const aiChatMessage: ChatMessage = {
        id: Date.now() + 1,
        chatId: parseInt(chatId!),
        sender: 'ai',
        message: aiMessageContent,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiChatMessage]);

      // Save AI message to database
      await saveMessageToHistory(aiMessageContent, 'ai');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to UI
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        chatId: parseInt(chatId!),
        sender: 'ai',
        message: "I'm sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-[#4169E1] to-[#5578F0]">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 p-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/chat-history')}
              className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Chat #{chatId}</h1>
              <p className="text-sm text-gray-400 font-light">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Associated PDFs */}
      {pdfNames.length > 0 && (
        <div className="bg-gray-900/40 border-b border-gray-800/50 p-4 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-2 font-medium">Chatting with PDFs:</p>
            <div className="flex flex-wrap gap-2">
              {pdfNames.map((pdfName, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-xl px-3 py-2 backdrop-blur-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300 truncate max-w-48 font-medium">{pdfName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-600/40">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">No messages found</h3>
              <p className="text-gray-400 text-lg font-light">This chat thread appears to be empty</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {message.sender !== 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-600/25 border border-gray-600/40">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 shadow-lg transition-all duration-300 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-600/30'
                      : 'bg-gray-800/60 border border-gray-700/50 text-white backdrop-blur-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
                      {message.message}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 px-2 font-medium">
                    {formatMessageDateTime(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-600/25 border border-gray-600/40">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-800/50 p-6 bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Continue the conversation..."
            disabled={isLoading}
            className="flex-1 bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-2xl px-6 py-4 transition-all duration-200 backdrop-blur-sm hover:bg-gray-700/70 focus:bg-gray-700/80 text-lg font-light"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gray-700/60 hover:bg-gray-600/80 text-white rounded-2xl px-8 transition-all duration-200 hover:scale-105 border border-gray-600/50 backdrop-blur-sm disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
