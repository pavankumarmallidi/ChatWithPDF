
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, User, Bot, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    const webhookUrl = "https://pavankumarmallidi.app.n8n.cloud/webhook/message-receive";
    
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
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b border-[#2d3748] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/chat-history')}
              className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Chat #{chatId}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Associated PDFs */}
      {pdfNames.length > 0 && (
        <div className="bg-[#1e1e2e] border-b border-[#2d3748] p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-2">Chatting with PDFs:</p>
            <div className="flex flex-wrap gap-2">
              {pdfNames.map((pdfName, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#232347] border border-[#2d3748] rounded-xl px-3 py-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white truncate max-w-48">{pdfName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {loadingHistory ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Continue your conversation</h3>
              <p className="text-gray-400">Ask me anything about your PDFs!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' 
                      : 'bg-[#232347]'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                      : 'bg-[#1a1a2e] border border-[#2d3748] text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.message}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="w-8 h-8 bg-[#232347] rounded-2xl flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-[#2d3748] p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 rounded-2xl px-4 py-3 transition-all duration-300"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white rounded-2xl px-6 transition-all duration-300 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
