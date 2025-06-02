import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, FileText, Power, User, MessageCircle, BookOpen, Hash, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, type PdfData } from "@/services/userTableService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PdfSelectionPageProps {
  userEmail: string;
  onStartChat: (selectedPdfs: PdfData[]) => void;
  onUploadNew: () => void;
}

const PdfSelectionPage = ({ userEmail, onStartChat, onUploadNew }: PdfSelectionPageProps) => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [filteredPdfs, setFilteredPdfs] = useState<PdfData[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<PdfData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const userPdfs = await getUserPdfs(userEmail);
        setPdfs(userPdfs);
        setFilteredPdfs(userPdfs);
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPdfs(pdfs);
    } else {
      const filtered = pdfs.filter(pdf => 
        pdf["PDF NAME"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pdf["OCR TEXT"] && pdf["OCR TEXT"].toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pdf["PDF SUMMARY"] && pdf["PDF SUMMARY"].toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPdfs(filtered);
    }
  }, [searchTerm, pdfs]);

  const togglePdfSelection = (pdf: PdfData) => {
    setSelectedPdfs(prev => {
      const isSelected = prev.some(p => p.id === pdf.id);
      if (isSelected) {
        return prev.filter(p => p.id !== pdf.id);
      } else {
        return [...prev, pdf];
      }
    });
  };

  const handleStartChat = () => {
    if (selectedPdfs.length > 0) {
      onStartChat(selectedPdfs);
    }
  };

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
    return user?.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-gray-600/40">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back, {getUserDisplayName()}!</h2>
                <p className="text-gray-400 text-base font-light">Select the PDFs to ask your questions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/chat-history')}
                className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <History className="w-4 h-4 mr-2" />
                Chat History
              </Button>
              <Button
                onClick={onUploadNew}
                className="bg-gray-700/60 hover:bg-gray-600/80 text-white rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
              >
                Upload New PDF
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-900/40 border border-red-800/50 text-red-400 hover:bg-red-800/50 hover:text-red-300 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <Power className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Search Box */}
        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for keywords inside PDF content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/50 rounded-2xl pl-14 pr-6 py-5 text-lg transition-all duration-200 backdrop-blur-sm hover:bg-gray-800/60 focus:bg-gray-800/70"
            />
          </div>
        </div>

        {/* PDF Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 animate-pulse backdrop-blur-sm">
                <div className="h-6 bg-gray-700/50 rounded mb-4"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
              </div>
            ))
          ) : filteredPdfs.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-600/30">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No PDFs found</h3>
              <p className="text-gray-400 text-lg mb-8 font-light">
                {searchTerm ? `No PDFs found matching "${searchTerm}"` : "Upload your first PDF to get started"}
              </p>
              <Button
                onClick={onUploadNew}
                className="bg-gray-700/60 hover:bg-gray-600/80 text-white px-8 py-3 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm"
              >
                Upload PDF
              </Button>
            </div>
          ) : (
            filteredPdfs.map((pdf) => (
              <Card
                key={pdf.id}
                onClick={() => togglePdfSelection(pdf)}
                className={`
                  relative cursor-pointer transition-all duration-300 p-6 rounded-2xl backdrop-blur-sm border-2 hover:scale-[1.02] hover:shadow-2xl group
                  ${selectedPdfs.some(p => p.id === pdf.id)
                    ? 'bg-gray-800/70 border-gray-600/70 shadow-xl' 
                    : 'bg-gray-900/50 border-gray-800/50 hover:bg-gray-800/60 hover:border-gray-700/60'
                  }
                `}
              >
                {selectedPdfs.some(p => p.id === pdf.id) && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700/80 to-gray-800/60 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-600/40 group-hover:scale-105 transition-transform duration-200">
                    <FileText className="w-7 h-7 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-gray-100 transition-colors duration-200 tracking-tight">
                      {pdf["PDF NAME"]}
                    </h3>
                    {pdf["PDF SUMMARY"] && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
                        {pdf["PDF SUMMARY"]}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="font-medium">{pdf["PAGES"]} pages</span>
                    </div>
                    {pdf["WORDS"] && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="font-medium">{pdf["WORDS"].toLocaleString()} words</span>
                      </div>
                    )}
                  </div>
                  {pdf["LANGUAGE"] && (
                    <span className="text-gray-400 text-xs bg-gray-700/40 px-3 py-1.5 rounded-lg border border-gray-600/30 font-medium">
                      {pdf["LANGUAGE"]}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Chat Button */}
        {selectedPdfs.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={handleStartChat}
              className="bg-gray-700/80 hover:bg-gray-600/90 text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-2xl transition-all duration-200 backdrop-blur-sm border border-gray-600/50 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Chat with {selectedPdfs.length} PDF{selectedPdfs.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSelectionPage;
