
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
      const webhookUrl = "https://pavankumarmallidi.app.n8n.cloud/webhook/message-receive";
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b border-[#2d3748] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToSelection}
              className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Chat with PDFs</h1>
              <p className="text-sm text-gray-400">
                Chatting with {selectedPdfs.length} PDF{selectedPdfs.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected PDFs */}
      <div className="bg-[#1e1e2e] border-b border-[#2d3748] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {selectedPdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center gap-2 bg-[#232347] border border-[#2d3748] rounded-xl px-3 py-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white truncate max-w-48">{pdf["PDF NAME"]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Start your conversation</h3>
              <p className="text-gray-400">Ask me anything about your selected PDFs!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' 
                      : 'bg-[#232347]'
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                      : 'bg-[#1a1a2e] border border-[#2d3748] text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-white/70' : 'text-gray-400'
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
            placeholder="Ask a question about your PDFs..."
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

export default ChatInterface;
