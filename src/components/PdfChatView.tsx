import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Send, User, Hash, BookOpen, Sparkles } from "lucide-react";
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
  const [messageIdCounter, setMessageIdCounter] = useState(0);
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
        
        chatHistoryService.initializeChat(pdfId, pdfData["PDF NAME"]);
        const chatHistory = chatHistoryService.getMessages(pdfId);
        setMessages(chatHistory);
        setMessageIdCounter(chatHistory.length);
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

    const messageToSend = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
      pdfId: pdfId
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    chatHistoryService.addMessage(pdfId, userMessage);
    setMessageIdCounter(prev => prev + 1);

    try {
      const response = await sendChatMessage(messageToSend, pdfId);
      
      console.log('Chat response:', response);
      
      let botMessageText = "I understand you'd like to know more about your PDF. Could you be more specific about what aspect you'd like me to elaborate on?";

      // Handle the new response format: array with output object
      if (Array.isArray(response) && response.length > 0) {
        const firstResult = response[0];
        if (firstResult.output && firstResult.output.answer) {
          botMessageText = firstResult.output.answer;
        }
      } else if (response && response.output && response.output.answer) {
        // Handle single object response format
        botMessageText = response.output.answer;
      }

      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random()}`,
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
        pdfId: pdfId
      };
      
      setMessages(prev => [...prev, botResponse]);
      chatHistoryService.addMessage(pdfId, botResponse);
      setMessageIdCounter(prev => prev + 1);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}-${Math.random()}`,
        text: "I'm sorry, I encountered an error while processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
        pdfId: pdfId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pdf) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 px-6 py-4 rounded-none backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                onClick={onBackToList}
                className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg border border-gray-600/40">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  {pdf["PDF NAME"]}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Hash className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["PAGES"]} pages</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                  </div>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm font-light">Ready to chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      {pdf["PDF SUMMARY"] && (
        <div className="bg-gray-800/40 border-b border-gray-800/50 px-6 py-4 rounded-none backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-gray-600/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-300 font-semibold text-sm tracking-wide">AI SUMMARY</h3>
                <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                {pdf["PDF SUMMARY"]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border ${
              message.isUser 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600/40' 
                : 'bg-gray-800/60 border-gray-700/50'
            }`}>
              {message.isUser ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </div>
            
            <div className={`max-w-[70%] ${message.isUser ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-3 shadow-lg transition-all duration-300 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-600/30'
                  : 'bg-gray-800/60 border border-gray-700/50 text-white backdrop-blur-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
                  {message.text}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2 px-2 font-medium">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isSending && (
          <div className="flex justify-start items-start gap-3">
            <div className="w-10 h-10 bg-gray-800/60 border border-gray-700/50 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl px-4 py-3 backdrop-blur-sm">
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

      {/* Message Input */}
      <div className="bg-gray-900/40 border-t border-gray-800/50 px-6 py-4 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your document..."
              className="w-full bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-2xl px-4 py-3 text-sm transition-all duration-200 backdrop-blur-sm hover:bg-gray-700/70 focus:bg-gray-700/80 font-light"
              disabled={isSending}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border-0 rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 disabled:opacity-50 min-w-[44px] h-11 border border-gray-600/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PdfChatView;
