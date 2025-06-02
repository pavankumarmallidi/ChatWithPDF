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
import ResponsiveHomePage from "@/components/ResponsiveHomePage";
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <div className="bg-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-lg border border-gray-600/40">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">PDF Upload</h2>
                  <p className="text-gray-400 text-base font-light">{user.email}</p>
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentView('selection')}
                className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-2xl backdrop-blur-sm transition-all duration-200"
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

  // Redirect logged-in users to selection page
  if (user) {
    setCurrentView('selection');
    return null;
  }

  // Home page - use ResponsiveHomePage for device-specific layouts
  return <ResponsiveHomePage onGetStarted={handleGetStarted} />;
};

export default Index;
