
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus, Hash, BookOpen } from "lucide-react";
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

  const recentPdfs = filteredPdfs.slice(0, 3);
  const allPdfs = filteredPdfs;

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const pdfDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - pdfDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1d';
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
    return `${Math.floor(diffInDays / 30)}m`;
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={onBackToUpload}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-4 py-2 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search PDFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 focus:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Recent PDFs */}
        {recentPdfs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent PDFs</h3>
            <div className="space-y-3">
              {recentPdfs.map((pdf) => (
                <Card
                  key={pdf.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl border backdrop-blur-sm ${
                    selectedPdfId === pdf.id 
                      ? 'border-orange-500 bg-gradient-to-r from-orange-500/20 to-red-500/20 shadow-lg shadow-orange-500/25' 
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/80'
                  }`}
                  onClick={() => onPdfSelect(pdf)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate mb-2">
                        {pdf["PDF NAME"]}
                      </h4>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-orange-400">
                          <Hash className="w-3 h-3" />
                          <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <BookOpen className="w-3 h-3" />
                          <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {formatTimeAgo(pdf["CREATED AT"])}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {pdf["PDF SUMMARY"] ? pdf["PDF SUMMARY"].slice(0, 80) + "..." : "Ready for questions..."}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All PDFs */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">All PDFs</h3>
          <div className="space-y-3">
            {allPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl border backdrop-blur-sm ${
                  selectedPdfId === pdf.id 
                    ? 'border-orange-500 bg-gradient-to-r from-orange-500/20 to-red-500/20 shadow-lg shadow-orange-500/25' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/80'
                }`}
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate mb-2">
                      {pdf["PDF NAME"]}
                    </h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Hash className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {formatTimeAgo(pdf["CREATED AT"])}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {pdf["PDF SUMMARY"] ? pdf["PDF SUMMARY"].slice(0, 80) + "..." : "Ready for questions..."}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredPdfs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No PDFs found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? "Try a different search term" : "Upload your first PDF to get started"}
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            >
              Upload PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListView;
