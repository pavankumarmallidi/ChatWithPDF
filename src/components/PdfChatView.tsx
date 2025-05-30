
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPdfById, type PdfData } from "@/services/userTableService";
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

interface PdfChatViewProps {
  userEmail: string;
  pdfId: number;
  onBackToList: () => void;
}

const PdfChatView = ({ userEmail, pdfId, onBackToList }: PdfChatViewProps) => {
  const [pdf, setPdf] = useState<PdfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const pdfData = await getPdfById(userEmail, pdfId);
        
        if (!pdfData) {
          toast({
            title: "PDF not found",
            description: "The requested document could not be found.",
            variant: "destructive",
          });
          onBackToList();
          return;
        }

        setPdf(pdfData);
        
        // Initialize chat with welcome message
        setMessages([
          {
            id: "1",
            text: `Welcome! I'm ready to answer questions about "${pdfData["PDF NAME"]}". ${pdfData["PDF SUMMARY"] ? `Here's a summary: ${pdfData["PDF SUMMARY"]}` : ''} What would you like to know?`,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch PDF:', error);
        toast({
          title: "Error loading PDF",
          description: "Failed to load the document. Please try again.",
          variant: "destructive",
        });
        onBackToList();
      } finally {
        setLoading(false);
      }
    };

    if (userEmail && pdfId) {
      fetchPdf();
    }
  }, [userEmail, pdfId, onBackToList, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !userEmail || !pdf) return;

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
      const response = await sendChatMessage(messageToSend, pdfId);
      
      let botMessageText = "I understand you'd like to know more about your PDF. Could you be more specific about what aspect you'd like me to elaborate on?";
      let relevanceScore: number | undefined;

      if (response && Array.isArray(response) && response.length > 0 && response[0].output) {
        const output = response[0].output;
        if (output.answer) {
          botMessageText = output.answer;
        }
        if (output.relevanceScore !== undefined) {
          relevanceScore = output.relevanceScore;
        }
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
        relevanceScore: relevanceScore,
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat message failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Message failed",
        description: errorMessage,
        variant: "destructive",
      });

      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">PDF not found</h2>
          <Button onClick={onBackToList}>Back to Library</Button>
        </div>
      </div>
    );
  }

  const pdfAnalysisData = {
    summary: pdf["PDF SUMMARY"] || "No summary available",
    totalPages: pdf["PAGES"] || 0,
    totalWords: pdf["WORDS"] || 0,
    language: pdf["LANGUAGE"] || "Unknown"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToList}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">{pdf["PDF NAME"]}</h1>
                <p className="text-gray-300 text-sm">Chat with your document</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel - Document Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <DocumentSidebar pdfAnalysisData={pdfAnalysisData} />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex-1 min-w-0">
            <Card className="h-full flex flex-col bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/20 rounded-3xl overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white">Chat with your document</h2>
                <p className="text-gray-400 text-sm">Ask questions about the content and get intelligent answers</p>
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

export default PdfChatView;
