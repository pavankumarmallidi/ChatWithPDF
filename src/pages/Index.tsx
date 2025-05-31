
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData, type PdfData } from "@/services/userTableService";
import { Button } from "@/components/ui/button";
import { User, Power, Star, ArrowRight } from "lucide-react";
import AuthPage from "@/components/AuthPage";
import LoadingState from "@/components/LoadingState";
import UploadInterface from "@/components/UploadInterface";
import ChatLayout from "@/components/ChatLayout";
import ThemeToggle from "@/components/ThemeToggle";

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
      
      if (responseData && Array.isArray(responseData) && responseData.length > 0) {
        const webhookData = responseData[0];
        console.log('Processing webhook data:', webhookData);
        
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
      <div className="min-h-screen bg-background flex items-center justify-center theme-transition">
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
      <div className="min-h-screen bg-background theme-transition">
        <div className="bg-card border-b border-border theme-transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">PDF Upload</h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button
                  onClick={() => setCurrentView('chat-layout')}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent"
                >
                  Back to Chats
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
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

  if (user) {
    setCurrentView('chat-layout');
    return null;
  }

  return (
    <div className="min-h-screen bg-background theme-transition">
      <nav className="bg-card border-b border-border theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-2xl font-bold text-foreground">PDFChat AI</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 animate-fade-in">
          <p className="text-primary font-medium mb-4">AI-powered PDF analysis platform</p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Empowering businesses with{" "}
            <span className="text-primary">
              intelligent
            </span>{" "}
            PDF analysis
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Upload your documents and get instant AI-powered insights, summaries, and answers. 
            Transform your document workflow with cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              Start your project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-current" />
                ))}
              </div>
              <span className="text-foreground font-semibold">4.9</span>
              <span className="text-muted-foreground">from 80+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "Process PDFs in seconds with our advanced AI engine" },
              { icon: "🎯", title: "Accurate Analysis", desc: "Get precise insights and summaries from your documents" },
              { icon: "💬", title: "Smart Chat", desc: "Ask questions and get instant answers about your content" }
            ].map((item, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 theme-transition">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-foreground font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
