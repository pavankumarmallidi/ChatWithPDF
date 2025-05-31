
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import { Button } from "@/components/ui/button";
import { User, Power, Star, ArrowRight, FileText, Sparkles, Brain, Shield } from "lucide-react";
import AuthPage from "@/components/AuthPage";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
        
        const pdfId = await insertPdfData(user.email, pdfData);
        setSelectedPdfId(pdfId);
        setCurrentView('chat-layout');
        
        toast({
          title: "PDF analyzed successfully!",
          description: "Your PDF has been processed and is ready for questions.",
        });
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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      } else {
        setCurrentView('home');
        setSelectedPdfId(null);
        toast({
          title: "Logged out",
          description: "See you next time!",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="loading-spinner w-16 h-16"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        <div className="bg-[var(--card-bg)] border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 btn-primary rounded-3xl flex items-center justify-center shadow-lg animate-glow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">PDF Upload</h2>
                  <p className="text-[var(--text-secondary)] text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setCurrentView('chat-layout')}
                  className="btn-secondary rounded-xl"
                >
                  Back to Chats
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300"
                >
                  <Power className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
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

  if (user) {
    setCurrentView('chat-layout');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
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
            <div className="w-10 h-10 btn-primary rounded-2xl flex items-center justify-center animate-glow">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--text-primary)]">PDFChat AI</span>
          </div>
          <Button 
            onClick={handleGetStarted}
            className="btn-primary px-6 py-2 rounded-xl"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Unleash your Creativity with AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            Transform PDFs with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Create production-quality insights from your documents with 
            unprecedented quality, speed, and style consistency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              className="btn-primary px-8 py-4 text-lg animate-glow rounded-2xl"
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
              <span className="text-[var(--text-primary)] font-semibold">4.9</span>
              <span className="text-[var(--text-secondary)]">from 80+ reviews</span>
            </div>
          </div>

          <p className="text-sm text-[var(--text-muted)] mb-12">No credit card needed</p>

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
              <div key={index} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="w-12 h-12 btn-primary rounded-2xl flex items-center justify-center mb-4 animate-glow">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
