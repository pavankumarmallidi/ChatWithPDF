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

  const handlePdfSelect = (pdf: PdfData, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPdfs(prev => [...prev, pdf]);
    } else {
      setSelectedPdfs(prev => prev.filter(p => p.id !== pdf.id));
    }
  };

  const handleStartChat = () => {
    if (selectedPdfs.length === 0) {
      toast({
        title: "No PDFs selected",
        description: "Please select at least one PDF to start chatting.",
        variant: "destructive",
      });
      return;
    }
    onStartChat(selectedPdfs);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <div className="bg-[#1e1e2e] border-b border-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welcome back, {getUserDisplayName()}!</h2>
                <p className="text-gray-400 text-sm">Select the PDFs to ask your questions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/chat-history')}
                className="bg-[#232347] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl transition-all duration-300"
              >
                <History className="w-4 h-4 mr-2" />
                Chat History
              </Button>
              <Button
                onClick={onUploadNew}
                className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white rounded-xl transition-all duration-300"
              >
                Upload New PDF
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300"
              >
                <Power className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Box */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for keywords inside PDF content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 rounded-2xl pl-12 pr-4 py-4 text-base transition-all duration-300"
            />
          </div>
        </div>

        {/* PDF Cards Container */}
        {filteredPdfs.length > 0 ? (
          <div className="bg-[#1e1e2e] border border-[#2d3748] rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPdfs.map((pdf) => (
                <Card
                  key={pdf.id}
                  className={`bg-[#1a1a2e] border-[#2d3748] rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer ${
                    selectedPdfs.some(p => p.id === pdf.id) 
                      ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'hover:border-blue-400'
                  }`}
                  onClick={() => handlePdfSelect(pdf, !selectedPdfs.some(p => p.id === pdf.id))}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedPdfs.some(p => p.id === pdf.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePdfSelect(pdf, e.target.checked);
                      }}
                      className="mt-1 w-5 h-5 rounded-md accent-blue-500"
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {pdf["PDF NAME"]}
                    </h3>
                    {pdf["PDF SUMMARY"] && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                        {pdf["PDF SUMMARY"]}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-blue-400">
                        <Hash className="w-3 h-3" />
                        <span>{pdf["PAGES"]} pages</span>
                      </div>
                      {pdf["WORDS"] && (
                        <div className="flex items-center gap-1 text-blue-400">
                          <BookOpen className="w-3 h-3" />
                          <span>{pdf["WORDS"].toLocaleString()} words</span>
                        </div>
                      )}
                    </div>
                    {pdf["LANGUAGE"] && (
                      <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded-lg">
                        {pdf["LANGUAGE"]}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No PDFs found' : 'No PDFs uploaded yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try a different search term' : 'Upload your first PDF to start analyzing documents'}
            </p>
            <Button
              onClick={onUploadNew}
              className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white shadow-lg hover:scale-105 rounded-2xl"
            >
              Upload Your First PDF
            </Button>
          </div>
        )}

        {/* Start Chat Button */}
        {filteredPdfs.length > 0 && (
          <div className="text-center">
            <Button
              onClick={handleStartChat}
              disabled={selectedPdfs.length === 0}
              className={`px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300 ${
                selectedPdfs.length > 0
                  ? 'bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white shadow-lg hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask questions about {selectedPdfs.length > 0 ? `${selectedPdfs.length} PDF${selectedPdfs.length > 1 ? 's' : ''}` : 'these PDFs'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSelectionPage;
