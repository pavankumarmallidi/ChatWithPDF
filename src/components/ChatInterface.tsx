import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, User, Bot, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type PdfData } from "@/services/userTableService";
import { supabase } from "@/integrations/supabase/client";

interface ChatInterfaceProps {
  selectedPdfs: PdfData[];
  userEmail: string;
  onBackToSelection: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = ({ selectedPdfs, userEmail, onBackToSelection }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId] = useState(() => Date.now()); // Generate unique chat ID
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessageToHistory = async (message: string, sender: 'user' | 'ai') => {
    try {
      const pdfIds = selectedPdfs.map(pdf => pdf.id);
      
      const { error } = await supabase
        .from('CHAT_HISTORY')
        .insert({
          CHAT_ID: chatId,
          EMAIL_ID: userEmail,
          SENDER: sender,
          RECIVER: sender === 'user' ? 'ai' : 'user',
          MESSAGE: message,
          pdf_ids: pdfIds
        });

      if (error) {
        console.error('Error saving message to history:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI
    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userChatMessage]);

    // Save user message to database
    await saveMessageToHistory(userMessage, 'user');

    try {
      // Send to webhook
      const webhookUrl = "https://pavan.every-ai.com/webhook/message-receive";
      const pdfIds = selectedPdfs.map(pdf => pdf.id);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          pdfIds: pdfIds,
          userEmail: userEmail,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);

      let aiMessageText = "I understand you'd like to know more about your PDFs. Could you be more specific about what aspect you'd like me to elaborate on?";

      // Handle the response format: array with output object
      if (Array.isArray(data) && data.length > 0) {
        const firstResult = data[0];
        if (firstResult.output && firstResult.output.answer) {
          aiMessageText = firstResult.output.answer;
        }
      }

      // Add AI message to UI
      const aiChatMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: aiMessageText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiChatMessage]);

      // Save AI message to database
      await saveMessageToHistory(aiMessageText, 'ai');

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I encountered an error while processing your message. Please try again.",
        isUser: false,
        timestamp: new Date()
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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 p-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToSelection}
              className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Chat with PDFs</h1>
              <p className="text-base text-gray-400 font-light">
                Chatting with {selectedPdfs.length} PDF{selectedPdfs.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected PDFs */}
      <div className="bg-gray-900/40 border-b border-gray-800/50 p-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {selectedPdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 truncate max-w-48 font-medium">{pdf["PDF NAME"]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-600/40">
                <Bot className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Start your conversation</h3>
              <p className="text-gray-400 text-lg font-light">Ask me anything about your selected PDFs!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-4 max-w-3xl ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                    message.isUser 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600/40' 
                      : 'bg-gray-800/60 border-gray-700/50'
                  }`}>
                    {message.isUser ? (
                      <User className="w-5 h-5 text-gray-300" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-5 backdrop-blur-sm ${
                    message.isUser
                      ? 'bg-gray-700/60 border border-gray-600/50 text-white'
                      : 'bg-gray-900/60 border border-gray-800/50 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed font-light">{message.text}</p>
                    <p className={`text-xs mt-3 ${
                      message.isUser ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="w-10 h-10 bg-gray-800/60 border border-gray-700/50 rounded-2xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
                <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-5 backdrop-blur-sm">
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
      <div className="border-t border-gray-800/50 p-6 bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your PDFs..."
            disabled={isLoading}
            className="flex-1 bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-2xl px-6 py-4 transition-all duration-200 backdrop-blur-sm hover:bg-gray-700/70 focus:bg-gray-700/80 text-lg"
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

export default ChatInterface;
