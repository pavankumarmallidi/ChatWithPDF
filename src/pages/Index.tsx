
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import { Button } from "@/components/ui/button";
import { User, Power } from "lucide-react";
import ChatSummary from "@/components/ChatSummary";
import AuthPage from "@/components/AuthPage";
import HomePage from "@/components/HomePage";
import LoadingState from "@/components/LoadingState";
import UploadInterface from "@/components/UploadInterface";
import PdfList from "@/components/PdfList";
import PdfChatView from "@/components/PdfChatView";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

type AppView = 'home' | 'auth' | 'upload' | 'list' | 'chat' | 'pdf-chat';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfAnalysisData, setPdfAnalysisData] = useState<PdfAnalysisData | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('list');
    } else {
      setCurrentView('auth');
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

    console.log('Starting PDF upload for user:', user.email);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log('Starting webhook upload...');
      const responseData = await uploadToWebhook(file, user.email, setUploadProgress);
      console.log('Webhook response received:', responseData);
      
      // Handle new webhook response format
      if (responseData && Array.isArray(responseData) && responseData.length > 0) {
        const webhookData = responseData[0];
        console.log('Processing webhook data:', webhookData);
        
        // Map webhook response to database format
        const pdfData = {
          pdfName: file.name,
          summary: webhookData.Summary || '',
          pages: webhookData.totalPages || 0,
          words: webhookData.totalWords || 0,
          language: webhookData.language || 'Unknown',
          ocrText: webhookData.ocr || ''
        };
        
        console.log('PDF data to insert:', pdfData);
        
        const pdfId = await insertPdfData(user.email, pdfData);
        console.log('PDF data stored with ID:', pdfId);
        
        setPdfAnalysisData({
          summary: pdfData.summary,
          totalPages: pdfData.pages,
          totalWords: pdfData.words,
          language: pdfData.language
        });
        setCurrentView('chat');
        
        toast({
          title: "PDF analyzed successfully!",
          description: "Your PDF has been processed and is ready for questions.",
        });
      } else {
        console.warn('No valid analysis data received from webhook');
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

  const handleLogout = async () => {
    await signOut();
    setCurrentView('home');
    setPdfAnalysisData(null);
    setSelectedPdfId(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdfId(pdf.id);
    setCurrentView('pdf-chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthPage onBackToHome={() => setCurrentView('home')} onSuccess={() => setCurrentView('list')} />;
  }

  if (currentView === 'chat' && pdfAnalysisData) {
    return <ChatSummary onBackToHome={() => setCurrentView('list')} pdfAnalysisData={pdfAnalysisData} />;
  }

  if (currentView === 'pdf-chat' && selectedPdfId && user?.email) {
    return (
      <PdfChatView
        userEmail={user.email}
        pdfId={selectedPdfId}
        onBackToList={() => setCurrentView('list')}
      />
    );
  }

  if (currentView === 'list' && user?.email) {
    return (
      <PdfList
        userEmail={user.email}
        onPdfSelect={handlePdfSelect}
        onBackToUpload={() => setCurrentView('upload')}
      />
    );
  }

  if (currentView === 'upload' && user) {
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

        {/* Header with user info and back button */}
        <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">PDF Upload</h2>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setCurrentView('list')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
                >
                  Back to Library
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 backdrop-blur-sm"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
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

  // Default view based on authentication status
  if (user) {
    setCurrentView('list');
    return null; // Will re-render with list view
  }

  return <HomePage onGetStarted={handleGetStarted} />;
};

export default Index;
