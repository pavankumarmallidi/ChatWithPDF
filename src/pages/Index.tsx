
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import ChatSummary from "@/components/ChatSummary";
import AuthPage from "@/components/AuthPage";
import HomePage from "@/components/HomePage";
import UserHeader from "@/components/UserHeader";
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
      
      if (responseData && responseData.length > 0 && responseData[0].output) {
        const analysisData = responseData[0].output;
        console.log('Analysis data:', analysisData);
        
        // Store PDF data in database
        console.log('Storing PDF data...');
        const pdfData = {
          pdfName: file.name,
          summary: analysisData.summary || '',
          pages: analysisData.totalPages || 0,
          words: analysisData.totalWords || 0,
          language: analysisData.language || 'Unknown',
          ocrText: analysisData.ocrText || ''
        };
        console.log('PDF data to insert:', pdfData);
        
        const pdfId = await insertPdfData(user.email, pdfData);
        console.log('PDF data stored with ID:', pdfId);
        
        setPdfAnalysisData({
          summary: analysisData.summary,
          totalPages: analysisData.totalPages,
          totalWords: analysisData.totalWords,
          language: analysisData.language
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
        <UserHeader 
          getUserDisplayName={getUserDisplayName}
          onHomeClick={() => setCurrentView('list')}
          onLogout={handleLogout}
        />

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
