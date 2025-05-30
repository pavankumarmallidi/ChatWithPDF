
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Send, Bot, User, Download, Paperclip, Hash, BookOpen, Sparkles } from "lucide-react";
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
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">PDF not found</h2>
          <Button onClick={onBackToList} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            Back to Chat List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                onClick={onBackToList}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  {pdf["PDF NAME"]}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Hash className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["PAGES"]} pages</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                  </div>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">Uploaded {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-gray-700 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-blue-400 font-semibold text-sm">AI SUMMARY</h3>
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {pdf["PDF SUMMARY"] || "This document is ready for analysis. Ask me any questions about its content and I'll help you understand it better."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              message.isUser 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              {message.isUser ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </div>
            
            <div className={`max-w-[70%] ${message.isUser ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                message.isUser
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gray-800/80 border border-gray-700 text-gray-100'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.text}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-800/80 border border-gray-700 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-t border-gray-700 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-300 hover:bg-gray-700 p-2 rounded-xl"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your document..."
              className="w-full bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 focus:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-2xl px-4 py-3 text-sm transition-all duration-200"
              disabled={isSending}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 disabled:opacity-50 min-w-[44px] h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PdfChatView;
