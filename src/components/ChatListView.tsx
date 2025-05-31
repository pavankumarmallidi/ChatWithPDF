
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

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const pdfDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - pdfDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="h-full bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[var(--bg-secondary)] flex flex-col">
      {/* Header */}
      <div className="card-base border-b px-6 py-4 bg-[var(--bg-primary)] rounded-none">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={onBackToUpload}
            className="btn-primary rounded-xl px-4 py-2 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search PDFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input-base text-primary placeholder:text-secondary focus:ring-2 focus:ring-purple-500/20 rounded-xl pl-10 pr-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredPdfs.length > 0 ? (
          <div className="space-y-3">
            {filteredPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl border rounded-xl ${
                  selectedPdfId === pdf.id 
                    ? 'border-purple-500 shadow-lg bg-purple-500/10' 
                    : 'card-base hover:scale-105'
                }`}
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 btn-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary truncate mb-2">
                      {pdf["PDF NAME"]}
                    </h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-purple-400">
                        <Hash className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                      </div>
                    </div>
                    <p className="text-sm text-secondary mb-2">
                      {formatTimeAgo(pdf["CREATED AT"])}
                    </p>
                    <p className="text-xs text-muted line-clamp-2">
                      {pdf["PDF SUMMARY"] ? pdf["PDF SUMMARY"].slice(0, 80) + "..." : "Ready for questions..."}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 btn-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-glow">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">No PDFs found</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-secondary">
                {searchTerm ? "Try a different search term" : "Upload your first PDF to get started"}
              </p>
            </div>
            <Button
              onClick={onBackToUpload}
              className="btn-primary shadow-lg"
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
