import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Users,
  CheckCircle,
  Zap,
  Shield,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { type PdfData } from "@/services/userTableService";

interface PdfAnalysisData {
  pdfData: {
    pdfName: string;
    summary: string;
    pages: number;
    words: number;
    language: string;
    ocrText: string;
  };
  webhookData: {
    Summary?: string;
    totalPages?: number;
    totalWords?: number;
    language?: string;
    ocr?: string;
  };
}

type AppView = 'home' | 'auth' | 'upload' | 'chat';

const MobileHomePage = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedPdfs, setSelectedPdfs] = useState<PdfData[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdfs([pdf]);
    setCurrentView('chat');
  };

  const handleUploadSuccess = (analysisData: PdfAnalysisData) => {
    console.log('PDF Analysis completed:', analysisData);
  };

  const handleAuthSuccess = () => {
    setCurrentView('home');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentView('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const MobileMenu = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isMenuOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl z-50 shadow-2xl border-r border-gray-700/50"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">PDFOCREXTRACTOR</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-2xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {user && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-4 mb-6 border border-gray-700/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-base">{getUserDisplayName()}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl"
          >
            <FileText className="w-5 h-5 mr-3" />
            Home
          </Button>
          
          {user && (
            <>
              <Button
                variant="ghost"
                onClick={() => { setCurrentView('upload'); setIsMenuOpen(false); }}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload PDF
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => { setCurrentView('chat'); setIsMenuOpen(false); }}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Chat
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-2xl mt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </>
          )}
          
          {!user && (
            <Button
              variant="ghost"
              onClick={() => { setCurrentView('auth'); setIsMenuOpen(false); }}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl"
            >
              <User className="w-5 h-5 mr-3" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </motion.div>
  );

  const MobileHeader = () => (
    <div className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-800/50 px-4 py-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(true)}
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-2xl"
        >
          <Menu className="w-6 h-6" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-base">PDFOCREXTRACTOR</span>
        </div>
        
        <div className="w-8"></div>
      </div>
    </div>
  );

  // Mobile Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <MobileMenu />
      <MobileHeader />
      
      {/* Hero Section */}
      <div className="px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 text-sm font-medium">Multiple PDF Chat</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
            100% Free Forever — No Limits
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Sign in to chat with multiple PDFs — completely free, no limits!
          </p>
          
          {/* Multiple PDF Feature Highlight */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-gray-600/30">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Users className="w-6 h-6 text-gray-400" />
              <span className="text-gray-200 font-semibold text-lg">Multiple PDF Chat</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Upload multiple PDFs and ask questions across all of them simultaneously. Get comprehensive answers from all your documents at once!
            </p>
          </div>
          
          {/* Free Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/20">
              <CheckCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm font-medium">Multiple PDFs</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/20">
              <Zap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm font-medium">Fast Answers</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/20">
              <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm font-medium">100% Private</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/20">
              <Sparkles className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm font-medium">Always Free</p>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="space-y-4">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                onClick={() => setCurrentView('auth')}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center touch-target shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Start Free Now</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Sign in to chat with multiple PDFs — completely free, no limits!
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card
                  onClick={() => setCurrentView('upload')}
                  className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center touch-target shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Upload Multiple PDFs</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Add several documents to chat with them all at once
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  onClick={() => setCurrentView('chat')}
                  className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center touch-target shadow-lg">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Start Chatting</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Ask questions across all your uploaded documents
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6">How Multiple PDF Chat Works</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-5 border border-gray-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-600/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Upload Multiple PDFs</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Drag and drop several PDF files at once. Our AI will process all of them simultaneously.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-5 border border-gray-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-600/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Ask Cross-Document Questions</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Ask questions that span across all your PDFs. Get comprehensive answers from multiple sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-5 border border-gray-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-600/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Get Intelligent Responses</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Receive accurate answers that combine information from all your uploaded documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileHomePage; 