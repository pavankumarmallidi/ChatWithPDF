
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Upload, User, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, type PdfData } from "@/services/userTableService";
import { useAuth } from "@/hooks/useAuth";
import { chatHistoryService } from "@/services/chatHistoryService";

interface ChatListViewProps {
  userEmail: string;
  onPdfSelect: (pdf: PdfData) => void;
  onBackToUpload: () => void;
  selectedPdfId?: number | null;
}

const ChatListView = ({ userEmail, onPdfSelect, onBackToUpload, selectedPdfId }: ChatListViewProps) => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const userPdfs = await getUserPdfs(userEmail);
        setPdfs(userPdfs);
        
        // Initialize chat history for each PDF
        userPdfs.forEach(pdf => {
          chatHistoryService.initializeChat(pdf.id, pdf["PDF NAME"]);
        });
      } catch (error) {
        console.error('Failed to fetch PDFs:', error);
        toast({
          title: "Error loading PDFs",
          description: "Failed to load your document library. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchPdfs();
    }
  }, [userEmail, toast]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return user?.email || 'User';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-xl border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{getUserDisplayName()}</h2>
              <p className="text-gray-400 text-sm">Your PDF Chats</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300"
          >
            <Power className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          onClick={onBackToUpload}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New PDF
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {pdfs.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No PDFs uploaded yet</h3>
            <p className="text-gray-400 text-sm">Upload your first PDF to start chatting</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {pdfs.map((pdf) => {
              const lastMessage = chatHistoryService.getLastMessage(pdf.id);
              const lastTimestamp = chatHistoryService.getLastTimestamp(pdf.id);
              const isSelected = selectedPdfId === pdf.id;
              
              return (
                <Card
                  key={pdf.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-violet-600/20 border-violet-500/50' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                  onClick={() => onPdfSelect(pdf)}
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-violet-400 to-purple-500 shadow-violet-500/25' 
                          : 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-violet-500/25'
                      }`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-medium truncate text-sm">
                            {pdf["PDF NAME"]}
                          </h3>
                          {lastTimestamp && (
                            <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
                              {formatTime(lastTimestamp)}
                            </span>
                          )}
                        </div>
                        
                        {lastMessage && (
                          <p className="text-gray-400 text-xs truncate leading-relaxed">
                            {lastMessage}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MessageCircle className="w-3 h-3" />
                            <span>{pdf["PAGES"]} pages</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListView;
