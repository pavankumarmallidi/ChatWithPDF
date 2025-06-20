import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Send, User, Hash, BookOpen, Sparkles, Globe, Clock, Calendar, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPdfById, type PdfData } from "@/services/userTableService";
import { sendChatMessage } from "@/services/chatService";
import { chatHistoryService, type ChatMessage } from "@/services/chatHistoryService";
import { formatMessageDateTime } from "@/lib/utils";

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
      {/* Enhanced PDF Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-900/60 border-b border-gray-800/50 px-6 py-6 backdrop-blur-sm">
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
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-3xl flex items-center justify-center shadow-lg border border-gray-600/40">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                  {pdf["PDF NAME"]}
                </h1>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">{pdf["PAGES"]} pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">{pdf["LANGUAGE"] || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {pdf.created_at ? new Date(pdf.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Status */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/40 border border-gray-600/50 rounded-2xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm font-medium">Ready to chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Summary Section */}
      {pdf["PDF SUMMARY"] && (
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-800/40 border-b border-gray-700/50 px-6 py-5 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg border border-gray-600/40">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-white font-bold text-lg tracking-wide">AI-Generated Summary</h3>
                <div className="h-1 w-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                <span className="text-gray-400 text-xs bg-gray-700/40 px-3 py-1 rounded-xl border border-gray-600/30">
                  Auto-analyzed
                </span>
              </div>
              <div className="bg-gray-900/40 border border-gray-700/40 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-gray-200 text-sm leading-relaxed font-light">
                  {pdf["PDF SUMMARY"]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Metadata Section */}
      <div className="bg-gray-900/40 border-b border-gray-800/40 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Document Analysis Complete</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Processed {pdf.created_at ? new Date(pdf.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Ready for intelligent conversation</span>
            <div className="w-6 h-6 bg-gray-600/30 rounded-xl flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-950/90 to-gray-950">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Start Your Conversation</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              Ask me anything about "<span className="font-medium text-gray-300">{pdf["PDF NAME"]}</span>". I've analyzed all {pdf["PAGES"]} pages and {pdf["WORDS"]?.toLocaleString()} words.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-3 backdrop-blur-sm">
                <p className="text-gray-300 text-sm font-medium">Try asking:</p>
                <p className="text-gray-400 text-xs mt-1">"Summarize the main points"</p>
              </div>
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-3 backdrop-blur-sm">
                <p className="text-gray-300 text-sm font-medium">Or ask:</p>
                <p className="text-gray-400 text-xs mt-1">"What are the key topics?"</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${message.isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg border ${
              message.isUser 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600/40' 
                : 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700/50'
            }`}>
              {message.isUser ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className={`max-w-[75%] ${message.isUser ? 'text-right' : ''}`}>
              <div className={`inline-block px-5 py-4 shadow-xl transition-all duration-300 rounded-3xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-600/30'
                  : 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 text-white backdrop-blur-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
                  {message.text}
                </p>
              </div>
              <div className={`mt-2 px-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <p className="text-xs text-gray-500 font-medium">
                  {formatMessageDateTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Enhanced Loading indicator */}
        {isSending && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl px-5 py-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-300 text-sm font-light ml-2">AI is analyzing your question...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-900/60 border-t border-gray-800/50 px-6 py-5 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask anything about "${pdf["PDF NAME"]}"...`}
                className="w-full bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-3xl px-5 py-4 text-sm transition-all duration-200 backdrop-blur-sm hover:bg-gray-700/70 focus:bg-gray-700/80 font-light pr-12"
                disabled={isSending}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 px-2">
              Press Enter to send • AI will analyze {pdf["WORDS"]?.toLocaleString()} words for context
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border-0 rounded-3xl px-6 py-4 shadow-lg transition-all duration-200 disabled:opacity-50 min-w-[56px] h-14 border border-gray-600/30"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PdfChatView;
