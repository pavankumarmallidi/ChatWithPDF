import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, ArrowLeft, Plus, Hash, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, type PdfData } from "@/services/userTableService";
import ThemeToggle from "./ThemeToggle";

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
      <div className="h-full bg-background flex items-center justify-center theme-transition">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col theme-transition">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 theme-transition">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBackToUpload}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={onBackToUpload}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search PDFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input border border-border text-foreground placeholder:text-muted-foreground focus:bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200 theme-transition"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Recent PDFs */}
        {recentPdfs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent PDFs</h3>
            <div className="space-y-3">
              {recentPdfs.map((pdf) => (
                <Card
                  key={pdf.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl border theme-transition ${
                    selectedPdfId === pdf.id 
                      ? 'border-primary bg-primary/10 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onClick={() => onPdfSelect(pdf)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FileText className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate mb-2">
                        {pdf["PDF NAME"]}
                      </h4>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-primary">
                          <Hash className="w-3 h-3" />
                          <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500">
                          <BookOpen className="w-3 h-3" />
                          <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatTimeAgo(pdf["CREATED AT"])}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
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
          <h3 className="text-lg font-semibold text-foreground mb-4">All PDFs</h3>
          <div className="space-y-3">
            {allPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl border theme-transition message-bubble ${
                  selectedPdfId === pdf.id 
                    ? 'border-primary bg-primary/10 shadow-lg' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                }`}
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate mb-2">
                      {pdf["PDF NAME"]}
                    </h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-primary">
                        <Hash className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["PAGES"]} pages</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-medium">{pdf["WORDS"]?.toLocaleString() || 0} words</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatTimeAgo(pdf["CREATED AT"])}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {pdf["PDF SUMMARY"] ? pdf["PDF SUMMARY"].slice(0, 80) + "..." : "Ready for questions..."}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredPdfs.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No PDFs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term" : "Upload your first PDF to get started"}
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
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
