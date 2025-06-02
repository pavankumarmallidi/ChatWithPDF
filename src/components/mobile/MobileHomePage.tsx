import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, MessageCircle, Sparkles, User, Menu, X, Zap, Shield, CheckCircle, Users } from "lucide-react";
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
          className="fixed inset-0 z-50 bg-purple-950/95 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="h-full w-80 bg-purple-900 border-r border-purple-800/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">PDFOCREXTRACTOR</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="text-purple-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {user && (
              <div className="mb-8 p-4 purple-card">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{getUserDisplayName()}</p>
                    <p className="text-purple-300 text-xs">{user.email}</p>
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
                  className="w-full justify-start purple-button"
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
                    className="w-full justify-start purple-button"
                  >
                    <Upload className="w-4 h-4 mr-3" />
                    Upload PDFs
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentView('chat');
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start purple-button"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Chat with PDFs
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
    <div className="sticky top-0 z-40 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="text-purple-400 hover:text-white touch-target"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">PDFOCREXTRACTOR</span>
        </div>

        {user && (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      <MobileMenu />
      <MobileHeader />
      
      {/* Hero Section */}
      <div className="px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl purple-glow">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Chat with Your PDFs
          </h1>
          <p className="text-purple-200 text-lg font-light leading-relaxed mb-6">
            100% Free Forever — No Trial, No Limits
          </p>
          
          {/* Multiple PDF Feature Highlight */}
          <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-600/30">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Users className="w-6 h-6 text-purple-300" />
              <span className="text-purple-100 font-semibold text-lg">Multiple PDF Chat</span>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Upload multiple PDFs and ask questions across all of them simultaneously. Get comprehensive answers from all your documents at once!
            </p>
          </div>
          
          {/* Free Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20">
              <CheckCircle className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-200 text-sm font-medium">Multiple PDFs</p>
            </div>
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20">
              <Zap className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-200 text-sm font-medium">Fast Answers</p>
            </div>
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20">
              <Shield className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-200 text-sm font-medium">100% Private</p>
            </div>
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-600/20">
              <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-200 text-sm font-medium">Always Free</p>
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
                className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 backdrop-blur-sm border-purple-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center touch-target shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Start Free Now</h3>
                    <p className="text-purple-200 text-sm leading-relaxed">
                      Sign in to chat with multiple PDFs — completely free, no trial period, no limits!
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
                  className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 backdrop-blur-sm border-purple-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center touch-target shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Upload Multiple PDFs</h3>
                      <p className="text-purple-200 text-sm leading-relaxed">
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
                  className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 backdrop-blur-sm border-purple-600/40 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center touch-target shadow-lg">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Start Chatting</h3>
                      <p className="text-purple-200 text-sm leading-relaxed">
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
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-5 border border-purple-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-300 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Upload Multiple PDFs</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Drag and drop several PDF files at once. Our AI will process all of them simultaneously.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-5 border border-purple-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-300 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Ask Cross-Document Questions</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Ask questions that span across all your PDFs. Get comprehensive answers from multiple sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-5 border border-purple-600/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-300 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Get Intelligent Responses</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
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