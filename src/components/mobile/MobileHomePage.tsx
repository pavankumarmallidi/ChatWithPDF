import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, MessageCircle, Sparkles, User, Menu, X, Zap, Shield, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/AuthPage";
import UploadPage from "@/components/UploadPage";
import PdfList from "@/components/PdfList";
import MobileChatLayout from "@/components/mobile/MobileChatLayout";
import ChatSummary from "@/components/ChatSummary";
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

const MobileHomePage = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'upload' | 'chat' | 'pdf-analysis'>('home');
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
  const [pdfAnalysisData, setPdfAnalysisData] = useState<PdfAnalysisData | null>(null);
  const [initialPdfId, setInitialPdfId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdf(pdf);
    setInitialPdfId(pdf.id);
    setCurrentView('chat');
    setIsMenuOpen(false);
  };

  const handleUploadSuccess = (analysisData: PdfAnalysisData) => {
    setPdfAnalysisData(analysisData);
    setCurrentView('pdf-analysis');
  };

  const handleAuthSuccess = () => {
    setCurrentView('home');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentView('home');
    setIsMenuOpen(false);
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
    return user?.email?.split('@')[0] || 'User';
  };

  // Mobile Navigation Menu
  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="h-full w-80 bg-gray-900 border-r border-gray-800/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">PDFOCREXTRACTOR</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {user && (
              <div className="mb-8 p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{getUserDisplayName()}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="space-y-3">
              {!user ? (
                <Button
                  onClick={() => {
                    setCurrentView('auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Sign In / Sign Up
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setCurrentView('upload');
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50"
                  >
                    <Upload className="w-4 h-4 mr-3" />
                    Upload PDF
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentView('chat');
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    My Documents
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start border-red-800/50 text-red-400 hover:bg-red-900/20"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Header
  const MobileHeader = () => (
    <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="text-gray-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">PDFOCREXTRACTOR</span>
        </div>

        {user && (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  // Render different views
  if (currentView === 'auth') {
    return <AuthPage onSuccess={handleAuthSuccess} onBackToHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'upload') {
    return <UploadPage onUploadSuccess={handleUploadSuccess} onBackToHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'chat' && user) {
    return (
      <MobileChatLayout
        userEmail={user.email!}
        onBackToUpload={() => setCurrentView('home')}
        initialPdfId={initialPdfId}
      />
    );
  }

  if (currentView === 'pdf-analysis' && pdfAnalysisData) {
    return (
      <ChatSummary
        onBackToHome={() => setCurrentView('home')}
        pdfAnalysisData={pdfAnalysisData}
      />
    );
  }

  // Mobile Home View
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <MobileMenu />
      <MobileHeader />
      
      {/* Hero Section */}
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">
            AI-Powered PDF Analysis
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Upload, analyze, and chat with your documents using advanced AI technology
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="space-y-4 mb-8">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                onClick={() => setCurrentView('auth')}
                className="bg-gray-900/60 border-gray-800/50 p-6 cursor-pointer hover:bg-gray-800/60 transition-all duration-300 active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Get Started</h3>
                    <p className="text-gray-400 text-sm">Sign in or create an account to begin</p>
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
                  className="bg-gray-900/60 border-gray-800/50 p-6 cursor-pointer hover:bg-gray-800/60 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Upload PDF</h3>
                      <p className="text-gray-400 text-sm">Add a new document for analysis</p>
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
                  className="bg-gray-900/60 border-gray-800/50 p-6 cursor-pointer hover:bg-gray-800/60 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">My Documents</h3>
                      <p className="text-gray-400 text-sm">View and chat with uploaded PDFs</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
          
          <div className="grid gap-4">
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <h3 className="text-white font-medium">AI-Powered Analysis</h3>
              </div>
              <p className="text-gray-400 text-sm">Advanced OCR and content understanding</p>
            </div>

            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-gray-400" />
                <h3 className="text-white font-medium">Instant Processing</h3>
              </div>
              <p className="text-gray-400 text-sm">Fast document processing and analysis</p>
            </div>

            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-gray-400" />
                <h3 className="text-white font-medium">Secure & Private</h3>
              </div>
              <p className="text-gray-400 text-sm">Your documents are protected and private</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileHomePage; 