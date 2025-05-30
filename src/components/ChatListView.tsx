
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllPdfs, type PdfData } from "@/services/userTableService";

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
        const userPdfs = await getAllPdfs(userEmail);
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
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={onBackToUpload}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2"
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
            className="w-full bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Recent PDFs */}
        {recentPdfs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent PDFs</h3>
            <div className="space-y-3">
              {recentPdfs.map((pdf) => (
                <Card
                  key={pdf.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border ${
                    selectedPdfId === pdf.id 
                      ? 'border-orange-200 bg-orange-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => onPdfSelect(pdf)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate mb-1">
                        {pdf["PDF NAME"]}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatTimeAgo(pdf["CREATED AT"])}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        You: Got it, thanks!
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All PDFs</h3>
          <div className="space-y-3">
            {allPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border ${
                  selectedPdfId === pdf.id 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate mb-1">
                      {pdf["PDF NAME"]}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatTimeAgo(pdf["CREATED AT"])}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      AI: {pdf["SUMMARY"] ? pdf["SUMMARY"].slice(0, 50) + "..." : "Ready for questions..."}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredPdfs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try a different search term" : "Upload your first PDF to get started"}
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-orange-500 hover:bg-orange-600 text-white"
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
