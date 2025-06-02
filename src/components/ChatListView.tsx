import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus, Hash, BookOpen, Sparkles, Users, User, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, type PdfData } from "@/services/userTableService";

interface ChatListViewProps {
  userEmail: string;
  onPdfSelect: (pdf: PdfData) => void;
  onBackToUpload: () => void;
  selectedPdfId: number | null;
}

const ChatListView = ({ userEmail, onPdfSelect, onBackToUpload, selectedPdfId }: ChatListViewProps) => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const userPdfs = await getUserPdfs(userEmail);
        setPdfs(userPdfs);
      } catch (error) {
        console.error('Failed to fetch PDFs:', error);
        toast({
          title: "Error loading PDFs",
          description: "Failed to load your documents. Please try again.",
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

  const filteredPdfs = pdfs.filter(pdf =>
    pdf["PDF NAME"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently uploaded';
      }
      
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    } catch (error) {
      return 'Recently uploaded';
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900/60 flex items-center justify-center rounded-r-3xl">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900/60 flex flex-col rounded-r-3xl">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-gray-800/50 px-6 py-4 rounded-tr-3xl">
        {/* User Welcome */}
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/40 rounded-3xl mb-6 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Welcome back!</h2>
              <p className="text-gray-400 text-sm">{userEmail.split('@')[0]}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-3xl backdrop-blur-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={onBackToUpload}
            className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-3xl px-4 py-2 font-medium shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload PDFs
          </Button>
        </div>

        {/* PDF Selection Instructions */}
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/40 rounded-3xl mb-4 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">How to Start Chatting</h3>
              <div className="space-y-2 text-gray-400 text-sm leading-relaxed">
                <p><span className="font-medium text-gray-300">1. Select PDFs:</span> Click on documents below to select them</p>
                <p><span className="font-medium text-gray-300">2. Enter Chat:</span> Selected PDF will open in chat mode automatically</p>
                <p><span className="font-medium text-gray-300">3. Ask Questions:</span> Chat with multiple PDFs simultaneously for comprehensive answers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/40 border border-gray-700/50 rounded-3xl text-white placeholder-gray-400 focus:border-gray-600/60 focus:outline-none transition-all duration-200 text-sm backdrop-blur-sm"
          />
        </div>
      </div>

      {/* PDF List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {searchTerm ? 'No PDFs found' : 'No PDFs uploaded yet'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {searchTerm 
                ? `No documents match "${searchTerm}"`
                : 'Upload your first PDF to start chatting with multiple documents'
              }
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-3xl px-4 py-2 font-medium shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload PDFs
            </Button>
          </div>
        ) : (
          filteredPdfs.map((pdf) => (
            <Card
              key={pdf.id}
              onClick={() => onPdfSelect(pdf)}
              className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-600/40 rounded-3xl p-4 cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 ${
                selectedPdfId === pdf.id ? 'ring-2 ring-gray-600/50 bg-gradient-to-r from-gray-700/60 to-gray-800/60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 truncate">
                    {pdf["PDF NAME"]}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{pdf["PAGES"]} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      <span>{pdf["WORDS"]} words</span>
                    </div>
                  </div>

                  {pdf["PDF SUMMARY"] && (
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {pdf["PDF SUMMARY"]}
                    </p>
                  )}
                  
                  <p className="text-gray-500 text-xs mt-2">
                    {formatTimeAgo(pdf.created_at)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListView;
