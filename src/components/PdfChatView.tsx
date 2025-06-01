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
      console.error("Chat message failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Message failed",
        description: errorMessage,
        variant: "destructive",
      });

      const errorResponse: ChatMessage = {
        id: `error-${Date.now()}-${Math.random()}`,
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
        pdfId: pdfId
      };
      
      setMessages(prev => [...prev, errorResponse]);
      chatHistoryService.addMessage(pdfId, errorResponse);
      setMessageIdCounter(prev => prev + 1);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="loading-spinner w-16 h-16"></div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">PDF not found</h2>
          <Button onClick={onBackToList} className="btn-primary rounded-xl">
            Back to Chat List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border-color)] px-6 py-4 rounded-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                onClick={onBackToList}
                className="btn-secondary rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 btn-primary rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
                  {pdf["PDF NAME"]}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-blue-400">
                    <Hash className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["PAGES"]} pages</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-sm font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                  </div>
                  <span className="text-[var(--text-muted)] text-sm">•</span>
                  <span className="text-[var(--text-muted)] text-sm">Ready to chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      {pdf["PDF SUMMARY"] && (
        <div className="bg-blue-500/10 border-b border-[var(--border-color)] px-6 py-4 rounded-none">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 btn-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-blue-400 font-semibold text-sm">AI SUMMARY</h3>
                <div className="h-1 w-8 bg-blue-400 rounded-full"></div>
              </div>
              <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                {pdf["PDF SUMMARY"]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              message.isUser 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'btn-primary'
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
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.text}
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 btn-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-[var(--text-muted)] ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[var(--card-bg)] border-t border-[var(--border-color)] px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your document..."
              className="w-full input-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-blue-500/20 rounded-2xl px-4 py-3 text-sm transition-all duration-200"
              disabled={isSending}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 disabled:opacity-50 min-w-[44px] h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PdfChatView;
