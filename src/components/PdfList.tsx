
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Calendar, Globe, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, createUserTableIfNotExists, type PdfMetadata } from "@/services/userTableService";

interface PdfListProps {
  userEmail: string;
  onPdfSelect: (pdf: PdfMetadata) => void;
  onBackToUpload: () => void;
}

const PdfList = ({ userEmail, onPdfSelect, onBackToUpload }: PdfListProps) => {
  const [pdfs, setPdfs] = useState<PdfMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAndFetchPdfs = async () => {
      try {
        setLoading(true);
        
        // Ensure user table exists
        await createUserTableIfNotExists(userEmail);
        
        // Fetch user's PDFs
        const userPdfs = await getUserPdfs(userEmail);
        setPdfs(userPdfs);
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
      initializeAndFetchPdfs();
    }
  }, [userEmail, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Your PDF Library</h1>
              <p className="text-gray-300">Browse and chat with your uploaded documents</p>
            </div>
          </div>
          <Button
            onClick={onBackToUpload}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Upload New PDF
          </Button>
        </div>

        {/* PDF Grid */}
        {pdfs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/25">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No PDFs uploaded yet</h3>
            <p className="text-gray-400 mb-6">Upload your first PDF to start analyzing and chatting with documents</p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Upload Your First PDF
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group hover:bg-white/10"
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {pdf.pdf_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(pdf.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {pdf.summary && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {pdf.summary}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {pdf.language && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{pdf.language}</span>
                      </div>
                    )}
                    {pdf.num_pages && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{pdf.num_pages} pages</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPdfSelect(pdf);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Document
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfList;
