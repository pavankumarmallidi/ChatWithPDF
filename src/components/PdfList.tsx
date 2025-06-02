import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Calendar, Globe, Hash, Upload, User, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPdfs, type PdfData } from "@/services/userTableService";
import { useAuth } from "@/hooks/useAuth";

interface PdfListProps {
  userEmail: string;
  onPdfSelect: (pdf: PdfData) => void;
  onBackToUpload: () => void;
}

const PdfList = ({ userEmail, onPdfSelect, onBackToUpload }: PdfListProps) => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        
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
      fetchPdfs();
    }
  }, [userEmail, toast]);

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
    if (user?.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return user?.email || 'User';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-800/30"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header with User Info and Logout */}
      <div className="relative z-10 backdrop-blur-xl bg-gray-900/60 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back!</h2>
                <p className="text-gray-300 text-sm font-light">{getUserDisplayName()}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-900/40 border-red-800/50 text-red-400 hover:bg-red-800/60 hover:border-red-700/70 hover:text-red-300 backdrop-blur-sm transition-all duration-300 rounded-xl"
            >
              <Power className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Your PDF Library</h1>
              <p className="text-gray-300 font-light">Browse and chat with your uploaded documents</p>
            </div>
          </div>
          <Button
            onClick={onBackToUpload}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-600/30 rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New PDF
          </Button>
        </div>

        {/* PDF Grid */}
        {pdfs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-600/25 border border-gray-600/40">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">No PDFs uploaded yet</h3>
            <p className="text-gray-400 mb-6 font-light">Upload your first PDF to start analyzing and chatting with documents</p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-600/30 rounded-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First PDF
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <Card
                key={pdf.id}
                className="bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group hover:bg-gray-800/70"
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/25 group-hover:scale-110 transition-transform duration-300 border border-gray-600/40">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1 tracking-tight">
                        {pdf["PDF NAME"]}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">Last uploaded: {formatDate(pdf.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {pdf["PDF SUMMARY"] && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed font-light">
                      {pdf["PDF SUMMARY"]}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {pdf["LANGUAGE"] && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-medium">{pdf["LANGUAGE"]}</span>
                      </div>
                    )}
                    {pdf["PAGES"] && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-medium">{pdf["PAGES"]} pages</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-600/30 rounded-xl"
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
