
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPdfById, type PdfData } from "@/services/userTableService";
import { sendChatMessage } from "@/services/chatService";
import { chatHistoryService, type ChatMessage } from "@/services/chatHistoryService";

interface PdfChatViewProps {
  userEmail: string;
  pdfId: number;
  onBackToList: () => void;
  showBackButton?: boolean;
}

const PdfChatView = ({ userEmail, pdfId, onBackToList, showBackButton = true }: PdfChatViewProps) => {
  const [pdf, setPdf] = useState<PdfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
        
        // Initialize and load chat history
        chatHistoryService.initializeChat(pdfId, pdfData["PDF NAME"]);
        const chatHistory = chatHistoryService.getMessages(pdfId);
        setMessages(chatHistory);
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
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
      pdfId: pdfId
    };

    // Add to local state and chat history
    setMessages(prev => [...prev, userMessage]);
    chatHistoryService.addMessage(pdfId, userMessage);
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

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
        pdfId: pdfId
      };
      
      // Add to local state and chat history
      setMessages(prev => [...prev, botResponse]);
      chatHistoryService.addMessage(pdfId, botResponse);
    } catch (error) {
      console.error("Chat message failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Message failed",
        description: errorMessage,
        variant: "destructive",
      });

      const errorResponse: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
        pdfId: pdfId
      };
      
      setMessages(prev => [...prev, errorResponse]);
      chatHistoryService.addMessage(pdfId, errorResponse);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">PDF not found</h2>
          <Button onClick={onBackToList}>Back to Chat List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              onClick={onBackToList}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white tracking-tight truncate">
                {pdf["PDF NAME"]}
              </h1>
              <p className="text-gray-300 text-sm truncate">
                {pdf["PAGES"]} pages • {pdf["WORDS"]} words • {pdf["LANGUAGE"]}
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default PdfChatView;
