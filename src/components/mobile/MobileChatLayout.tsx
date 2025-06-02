import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  MessageCircle, 
  FileText, 
  User, 
  Send, 
  Menu, 
  X,
  Plus,
  Settings,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserPdfs, type PdfData } from '@/services/userTableService';
import PdfList from '@/components/PdfList';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import PdfChatView from '@/components/PdfChatView';

interface MobileChatLayoutProps {
  userEmail: string;
  onBackToUpload: () => void;
  initialPdfId?: number | null;
}

const MobileChatLayout = ({ userEmail, onBackToUpload, initialPdfId }: MobileChatLayoutProps) => {
  const [pdfs, setPdfs] = useState<PdfData[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPdfs = async () => {
      try {
        setIsLoading(true);
        const userPdfs = await getUserPdfs(userEmail);
        setPdfs(userPdfs);
        
        // Auto-select PDF if initialPdfId is provided
        if (initialPdfId && userPdfs.length > 0) {
          const targetPdf = userPdfs.find(pdf => pdf.id === initialPdfId);
          if (targetPdf) {
            setSelectedPdf(targetPdf);
            setCurrentView('chat');
          }
        }
      } catch (error) {
        console.error('Error loading PDFs:', error);
        toast({
          title: "Error",
          description: "Failed to load your documents. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfs();
  }, [userEmail, initialPdfId, toast]);

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdf(pdf);
    setCurrentView('chat');
    setIsSidebarOpen(false);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPdf(null);
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {currentView === 'chat' ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="text-gray-400 hover:text-white touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToUpload}
              className="text-gray-400 hover:text-white touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
              {currentView === 'chat' ? (
                <MessageCircle className="w-4 h-4 text-white" />
              ) : (
                <FileText className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {currentView === 'chat' && selectedPdf 
                  ? selectedPdf["PDF NAME"].length > 20 
                    ? `${selectedPdf["PDF NAME"].substring(0, 20)}...` 
                    : selectedPdf["PDF NAME"]
                  : 'My Documents'
                }
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentView === 'list' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white touch-target"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white touch-target"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm safe-area-inset"
          onClick={() => setIsSidebarOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="ml-auto h-full w-80 bg-gray-900 border-l border-gray-800/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white touch-target"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{userEmail.split('@')[0]}</p>
                    <p className="text-gray-400 text-xs">{userEmail}</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
                  onClick={() => {
                    onBackToUpload();
                    setIsSidebarOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Upload New PDF
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-400">Loading your documents...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!isLoading && pdfs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Documents Yet</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Upload your first PDF to start analyzing and chatting with your documents.
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 safe-area-inset">
      <MobileHeader />
      <MobileSidebar />
      
      <div className="pb-safe">
        {currentView === 'list' ? (
          <div className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Your Documents</h2>
                <p className="text-gray-400">Select a document to start chatting</p>
              </div>
              
              <div className="grid gap-4">
                {pdfs.map((pdf) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      onClick={() => handlePdfSelect(pdf)}
                      className="mobile-card cursor-pointer hover:bg-gray-800/60 mobile-bounce"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm mb-1 truncate">
                            {pdf["PDF NAME"]}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{pdf["PAGES"]} pages</span>
                            <span>{pdf["WORDS"]} words</span>
                          </div>
                          {pdf["PDF SUMMARY"] && (
                            <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                              {pdf["PDF SUMMARY"]}
                            </p>
                          )}
                        </div>
                        <div className="text-gray-400">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : selectedPdf ? (
          <PdfChatView 
            userEmail={userEmail}
            pdfId={selectedPdf.id}
            onBackToList={handleBackToList}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MobileChatLayout; 