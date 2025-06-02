import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus, Hash, BookOpen, Sparkles, Users } from "lucide-react";
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
      <div className="h-full bg-purple-900/60 flex items-center justify-center rounded-r-2xl">
        <div className="w-12 h-12 border-2 border-purple-600 border-t-purple-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-purple-900/60 flex flex-col rounded-r-2xl">
      {/* Header */}
      <div className="bg-purple-900/80 border-b border-purple-800/50 px-6 py-4 rounded-tr-2xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            className="purple-button backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={onBackToUpload}
            className="purple-button purple-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload PDFs
          </Button>
        </div>

        {/* Multiple PDF Instructions */}
        <div className="purple-card mb-4 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Chat with Multiple PDFs</h3>
              <p className="text-purple-300 text-sm leading-relaxed">
                You can chat with multiple PDFs at once — just upload them here. Select documents below to start asking questions across all of them simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="purple-input w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* PDF List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {searchTerm ? 'No PDFs found' : 'No PDFs uploaded yet'}
            </h3>
            <p className="text-purple-300 text-sm mb-4">
              {searchTerm 
                ? `No documents match "${searchTerm}"`
                : 'Upload your first PDF to start chatting with multiple documents'
              }
            </p>
            <Button
              onClick={onBackToUpload}
              className="purple-button purple-glow"
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
              className={`pdf-card cursor-pointer ${
                selectedPdfId === pdf.id ? 'pdf-card-active' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 truncate">
                    {pdf["PDF NAME"]}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-purple-300 mb-2">
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
                    <p className="text-purple-300 text-sm line-clamp-2 leading-relaxed">
                      {pdf["PDF SUMMARY"]}
                    </p>
                  )}
                  
                  <p className="text-purple-400 text-xs mt-2">
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
