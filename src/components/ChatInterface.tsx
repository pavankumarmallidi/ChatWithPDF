
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, FileText, ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type PdfData } from "@/services/userTableService";

interface ChatInterfaceProps {
  selectedPdfs: PdfData[];
  userEmail: string;
  onBackToSelection: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  pdfIds?: number[];
}

const ChatInterface = ({ selectedPdfs, userEmail, onBackToSelection }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToWebhook = async (message: string, pdfIds: number[]) => {
    const webhookUrl = "https://pavankumarmallidi.app.n8n.cloud/webhook/5221a79c-7222-4245-98ec-01d6b56d20c7";
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          pdfIds,
          userEmail,
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
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const pdfIds = selectedPdfs.map(pdf => pdf.id);
      const response = await sendToWebhook(userMessage.content, pdfIds);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || response.response || "I received your message and I'm processing it.",
        sender: 'ai',
        timestamp: new Date(),
        pdfIds: response.pdfIds || pdfIds,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your message. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex">
      {/* Left Sidebar - Selected PDFs */}
      <div className="w-80 bg-[#1a1a2e] border-r border-[#2d3748] flex flex-col">
        <div className="p-4 border-b border-[#2d3748]">
          <Button
            onClick={onBackToSelection}
            className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl mb-4 w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          <h2 className="text-lg font-semibold text-white mb-2">Selected PDFs</h2>
          <p className="text-sm text-gray-400">{selectedPdfs.length} document{selectedPdfs.length > 1 ? 's' : ''} selected</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedPdfs.map((pdf) => (
            <Card key={pdf.id} className="bg-[#232347] border-[#2d3748] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm truncate mb-1">
                    {pdf["PDF NAME"]}
                  </h3>
                  <p className="text-xs text-gray-400">{pdf["PAGES"]} pages</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-[#1a1a2e] border-b border-[#2d3748] p-4">
          <h1 className="text-xl font-semibold text-white">Chat with Your PDFs</h1>
          <p className="text-sm text-gray-400">Ask questions about the selected documents</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Start your conversation</h3>
              <p className="text-gray-400">Ask any question about your selected PDFs</p>
            </div>
          )}

          {messages.map((message) => (
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
                    <FileText className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 bg-[#1a1a2e] border border-[#2d3748] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white border-none'
                    : 'text-white'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="w-8 h-8 bg-[#232347] rounded-2xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
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

        {/* Message Input */}
        <div className="border-t border-[#2d3748] p-4">
          <div className="flex gap-3">
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
    </div>
  );
};

export default ChatInterface;
