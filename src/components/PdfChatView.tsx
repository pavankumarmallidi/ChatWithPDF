
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPdfById, type PdfData } from "@/services/userTableService";
import { sendChatMessage } from "@/services/chatService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            text: `Hi! I'm ready to answer questions about "${pdfData["PDF NAME"]}". What would you like to know?`,
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
    if (!inputMessage.trim() || !userEmail || !pdf || isSending) return;

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
    setIsSending(true);

    try {
      const response = await sendChatMessage(messageToSend, pdfId);
      
      let botMessageText = "I understand you'd like to know more about your PDF. Could you be more specific about what aspect you'd like me to elaborate on?";

      if (response && Array.isArray(response) && response.length > 0 && response[0].output) {
        const output = response[0].output;
        if (output.answer) {
          botMessageText = output.answer;
        }
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
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
      setIsSending(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToList}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
                  {pdf["PDF NAME"]}
                </h1>
                <p className="text-gray-300 text-sm">Chat with your document</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <Card className="h-[calc(100vh-200px)] max-h-[600px] flex flex-col bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] ${
                    message.isUser
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-[20px_20px_4px_20px] shadow-lg'
                      : 'bg-white/10 backdrop-blur-sm text-white rounded-[20px_20px_20px_4px] border border-white/10 shadow-lg'
                  } px-4 py-3 transition-all duration-300`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <p className="text-xs opacity-70 mt-2 pt-2 border-t border-white/10">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isSending && (
              <div className="flex justify-start items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-[20px_20px_20px_4px] shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 backdrop-blur-sm bg-white/5 border-t border-white/10">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything about your PDF..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500/20 rounded-2xl px-4 py-3 text-sm transition-all duration-300 hover:border-white/30 focus:bg-white/15"
                  disabled={isSending}
                />
              </div>
              <Button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 min-w-[48px] h-12"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <p className="text-center text-xs text-gray-400 mt-3 opacity-70">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PdfChatView;
