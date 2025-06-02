import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, MessageCircle, Sparkles, User, LogOut, Zap, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/AuthPage";
import UploadPage from "@/components/UploadPage";
import PdfList from "@/components/PdfList";
import ChatLayout from "@/components/ChatLayout";
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

const TabletHomePage = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'upload' | 'chat' | 'pdf-analysis'>('home');
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
  const [pdfAnalysisData, setPdfAnalysisData] = useState<PdfAnalysisData | null>(null);
  const [initialPdfId, setInitialPdfId] = useState<number | null>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdf(pdf);
    setInitialPdfId(pdf.id);
    setCurrentView('chat');
  };

  const handleUploadSuccess = (analysisData: PdfAnalysisData) => {
    setPdfAnalysisData(analysisData);
    setCurrentView('pdf-analysis');
  };

  const handleAuthSuccess = () => {
    setCurrentView('home');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentView('home');
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

  // Tablet Header
  const TabletHeader = () => (
    <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">PDFOCREXTRACTOR</h1>
              <p className="text-gray-400 text-sm font-light">AI-powered PDF analysis platform</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/40 px-4 py-2">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{getUserDisplayName()}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-800/50 text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-2xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
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
      <ChatLayout
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

  // Tablet Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <TabletHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h2 className="responsive-text-3xl font-bold mb-4 tracking-tight">
            Transform Your Document Experience
          </h2>
          <p className="text-gray-400 responsive-text-xl font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Chat with multiple PDFs simultaneously — 100% free forever! Upload, analyze, and have intelligent conversations with multiple documents using advanced AI technology.
          </p>
          
          {/* Supportive Bullet Points */}
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-6 h-6 text-gray-400" />
              <span className="font-medium">Supports multiple PDFs</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Zap className="w-6 h-6 text-gray-400" />
              <span className="font-medium">Accurate, fast answers</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Shield className="w-6 h-6 text-gray-400" />
              <span className="font-medium">Secure & private</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Sparkles className="w-6 h-6 text-gray-400" />
              <span className="font-medium">No cost, ever</span>
            </div>
          </div>
        </motion.div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card
                onClick={() => setCurrentView('auth')}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300"
              >
                <div className="flex items-center justify-between p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Start Free Forever</h3>
                      <p className="text-gray-400 text-lg">Sign in to chat with multiple PDFs simultaneously — completely free forever!</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
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
                  className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 h-full"
                >
                  <div className="flex flex-col justify-between h-full p-8">
                    <div>
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">Upload Multiple PDFs</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Add multiple documents for analysis. Our AI will extract text, understand content, and prepare them for intelligent conversations.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-gray-400 text-sm font-medium">Start analyzing</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
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
                  className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 h-full"
                >
                  <div className="flex flex-col justify-between h-full p-8">
                    <div>
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">Chat with Multiple PDFs</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Ask questions across multiple documents simultaneously. Get comprehensive answers, summaries, and insights.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-gray-400 text-sm font-medium">Browse library</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Why Choose Our Platform</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl hover:shadow-2xl hover:shadow-black/25 transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Multiple PDF Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Chat with several documents simultaneously. Ask questions that span across multiple files for comprehensive insights.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl hover:shadow-2xl hover:shadow-black/25 transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast Answers</h3>
                <p className="text-gray-400 leading-relaxed">
                  Advanced AI processing delivers accurate results in seconds. Start chatting with your PDFs immediately after upload.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-600/40 rounded-3xl hover:shadow-2xl hover:shadow-black/25 transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Completely Secure</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your documents are encrypted and secure. We prioritize your privacy and ensure your data remains confidential.
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-600/40 rounded-3xl shadow-2xl">
              <div className="p-12">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
                <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
                  Join thousands of users chatting with multiple PDFs simultaneously — completely free forever, no limits!
                </p>
                <Button
                  onClick={() => setCurrentView('auth')}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-8 py-4 text-lg rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-black/25 transition-all duration-200"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TabletHomePage; 