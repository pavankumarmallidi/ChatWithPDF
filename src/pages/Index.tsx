import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, Brain, Shield, Star, MessageSquare, LogOut } from "lucide-react";
import AuthPage from "@/components/AuthPage";
import LoadingState from "@/components/LoadingState";
import UploadInterface from "@/components/UploadInterface";
import PdfSelectionPage from "@/components/PdfSelectionPage";
import ChatInterface from "@/components/ChatInterface";
import { useNavigate } from "react-router-dom";

type AppView = 'home' | 'auth' | 'selection' | 'upload' | 'chat';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPdfs, setSelectedPdfs] = useState<PdfData[]>([]);
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('selection');
    } else {
      setCurrentView('auth');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentView('home');
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const responseData = await uploadToWebhook(file, user.email, setUploadProgress);
      
      if (responseData && Array.isArray(responseData) && responseData.length > 0) {
        const webhookData = responseData[0];
        
        const pdfData = {
          pdfName: file.name,
          summary: webhookData.Summary || '',
          pages: webhookData.totalPages || 0,
          words: webhookData.totalWords || 0,
          language: webhookData.language || 'Unknown',
          ocrText: webhookData.ocr || ''
        };
        
        await insertPdfData(user.email, pdfData);
        
        toast({
          title: "PDF analyzed successfully!",
          description: "Your PDF has been processed and is ready for questions.",
        });
        
        setCurrentView('selection');
      } else {
        toast({
          title: "Upload incomplete",
          description: "PDF uploaded but no analysis data received.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleStartChat = (pdfs: PdfData[]) => {
    setSelectedPdfs(pdfs);
    setCurrentView('chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthPage onBackToHome={() => setCurrentView('home')} onSuccess={() => setCurrentView('selection')} />;
  }

  if (currentView === 'selection' && user?.email) {
    return (
      <PdfSelectionPage
        userEmail={user.email}
        onStartChat={handleStartChat}
        onUploadNew={() => setCurrentView('upload')}
      />
    );
  }

  if (currentView === 'chat' && user?.email) {
    return (
      <ChatInterface
        selectedPdfs={selectedPdfs}
        userEmail={user.email}
        onBackToSelection={() => setCurrentView('selection')}
      />
    );
  }

  if (currentView === 'upload' && user) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="bg-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-gray-600/40">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">PDF Upload</h2>
                  <p className="text-gray-400 text-base font-light">{user.email}</p>
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentView('selection')}
                className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                Back to Selection
              </Button>
            </div>
          </div>
        </div>

        {isUploading ? (
          <LoadingState uploadProgress={uploadProgress} />
        ) : (
          <UploadInterface onFileUpload={handleFileUpload} />
        )}
      </div>
    );
  }

  if (user) {
    setCurrentView('selection');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-2xl flex items-center justify-center animate-pulse">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">PDFChat AI</span>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/chat-history')}
                  className="bg-[#1a1a2e] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat History
                </Button>
                <Button 
                  onClick={handleSignOut}
                  className="bg-[#1a1a2e] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Unleash your Creativity with AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform PDFs with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-indigo-400">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Create production-quality insights from your documents with 
            unprecedented quality, speed, and style consistency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start analyzing for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-semibold">4.9</span>
              <span className="text-gray-400">from 80+ reviews</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-12">No credit card needed</p>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { 
                icon: Brain, 
                title: "AI-Powered Analysis", 
                desc: "Advanced AI algorithms extract and analyze content with unprecedented accuracy" 
              },
              { 
                icon: Sparkles, 
                title: "Lightning Fast", 
                desc: "Process documents in seconds, not minutes. Get instant insights and summaries" 
              },
              { 
                icon: Shield, 
                title: "Secure & Private", 
                desc: "Your documents are processed securely with enterprise-grade encryption" 
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#1a1a2e] border border-[#2d3748] rounded-3xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
