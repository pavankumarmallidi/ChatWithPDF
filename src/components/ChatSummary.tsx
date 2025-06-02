import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Globe, Hash, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendChatMessage } from "@/services/chatService";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import DocumentSidebar from "./DocumentSidebar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relevanceScore?: number;
}

interface PdfAnalysisData {
  fileName: string;
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

interface ChatSummaryProps {
  onBackToHome: () => void;
  pdfAnalysisData: PdfAnalysisData;
}

const ChatSummary = ({ onBackToHome, pdfAnalysisData }: ChatSummaryProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Great! I've analyzed your PDF. Here's what I found: ${pdfAnalysisData.summary}. Feel free to ask me any questions about the document!`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage;
    setInputMessage("");

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageToSend, 1); // Assuming pdfId = 1 for demo
      
      console.log('Chat response:', response);
      
      let botMessageText = "I understand you'd like to know more about your PDF. Could you be more specific about what aspect you'd like me to elaborate on?";

      // Handle the response format
      if (Array.isArray(response) && response.length > 0) {
        const firstResult = response[0];
        if (firstResult.output && firstResult.output.answer) {
          botMessageText = firstResult.output.answer;
        }
      } else if (response && response.output && response.output.answer) {
        botMessageText = response.output.answer;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-800/30"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-gray-900/60 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="bg-gray-800/60 border-gray-700/50 text-white hover:bg-gray-700/80 hover:border-gray-600/70 backdrop-blur-sm rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">PDF Analysis Complete</h1>
                <p className="text-gray-300 text-sm font-light">Chat with your document</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel - Document Analysis */}
          <div className="lg:w-80 flex-shrink-0">
            <DocumentSidebar pdfAnalysisData={pdfAnalysisData} />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex-1 min-w-0">
            <Card className="h-full flex flex-col bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-2xl shadow-black/20 rounded-3xl overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-800/50 bg-gray-900/40 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white tracking-tight">Chat with your document</h2>
                <p className="text-gray-400 text-sm font-light">Ask questions about the content and get intelligent answers</p>
              </div>
              
              {/* Chat Messages Area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MessageList 
                  messages={messages} 
                  isLoading={isLoading}
                />
              </div>

              {/* Message Input */}
              <MessageInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary;
