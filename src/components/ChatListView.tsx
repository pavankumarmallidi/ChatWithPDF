import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus, Hash, BookOpen, Sparkles } from "lucide-react";
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
      <div className="h-full bg-gray-900/60 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900/60 flex flex-col rounded-r-2xl">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-gray-800/50 px-6 py-4 rounded-tr-2xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={onBackToUpload}
            className="bg-gray-700/60 hover:bg-gray-600/80 text-white rounded-xl px-4 py-2 shadow-lg border border-gray-600/50 backdrop-blur-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search PDFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/60 border border-gray-700/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-2xl pl-10 pr-4 py-3 text-sm transition-all duration-200 backdrop-blur-sm hover:bg-gray-700/70 focus:bg-gray-700/80"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600/40">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm font-light">
              {searchTerm ? `No PDFs found matching "${searchTerm}"` : "No PDFs uploaded yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                onClick={() => onPdfSelect(pdf)}
                className={`
                  cursor-pointer transition-all duration-300 p-4 rounded-2xl backdrop-blur-sm border-2 hover:scale-[1.02] hover:shadow-lg group
                  ${selectedPdfId === pdf.id
                    ? 'bg-gray-800/80 border-gray-600/80 shadow-lg' 
                    : 'bg-gray-800/40 border-gray-700/40 hover:bg-gray-800/60 hover:border-gray-600/60'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700/80 to-gray-600/60 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-600/40 group-hover:scale-105 transition-transform duration-200">
                    <FileText className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate mb-2 tracking-tight group-hover:text-gray-100 transition-colors duration-200">
                      {pdf["PDF NAME"]}
                    </h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 font-medium">
                      {formatTimeAgo(pdf["CREATED AT"])}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed">
                      {pdf["PDF SUMMARY"] ? pdf["PDF SUMMARY"].slice(0, 80) + "..." : "Ready for questions..."}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListView;
