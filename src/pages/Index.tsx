
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import { Button } from "@/components/ui/button";
import { User, Power, Star, ArrowRight } from "lucide-react";
import AuthPage from "@/components/AuthPage";
import HomePage from "@/components/HomePage";
import LoadingState from "@/components/LoadingState";
import UploadInterface from "@/components/UploadInterface";
import ChatLayout from "@/components/ChatLayout";

type AppView = 'home' | 'auth' | 'upload' | 'chat-layout';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('chat-layout');
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
        
        // Set the PDF ID and go directly to chat layout
        setSelectedPdfId(pdfId);
        setCurrentView('chat-layout');
        
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
    setSelectedPdfId(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthPage onBackToHome={() => setCurrentView('home')} onSuccess={() => setCurrentView('chat-layout')} />;
  }

  if (currentView === 'chat-layout' && user?.email) {
    return (
      <ChatLayout
        userEmail={user.email}
        onBackToUpload={() => setCurrentView('upload')}
        initialPdfId={selectedPdfId}
      />
    );
  }

  if (currentView === 'upload' && user) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background effects inspired by Modal */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-black to-red-500/10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl"></div>

        {/* Header with user info and back button */}
        <div className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">PDF Upload</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setCurrentView('chat-layout')}
                  variant="outline"
                  className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 backdrop-blur-sm"
                >
                  Back to Chats
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
    setCurrentView('chat-layout');
    return null; // Will re-render with chat-layout view
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects inspired by Modal */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-black to-red-500/10"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Header Navigation */}
      <nav className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">PDFChat AI</span>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <p className="text-orange-400 font-medium mb-4">AI-powered PDF analysis platform</p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering businesses with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              intelligent
            </span>{" "}
            PDF analysis that outranks competitors
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Upload your documents and get instant AI-powered insights, summaries, and answers. 
            Transform your document workflow with cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
            >
              Start your project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                ))}
              </div>
              <span className="text-white font-semibold">4.9</span>
              <span className="text-gray-400">from 80+ reviews</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Process PDFs in seconds with our advanced AI engine</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Accurate Analysis</h3>
              <p className="text-gray-400">Get precise insights and summaries from your documents</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Smart Chat</h3>
              <p className="text-gray-400">Ask questions and get instant answers about your content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
