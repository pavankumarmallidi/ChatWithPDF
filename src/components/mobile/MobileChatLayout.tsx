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
  Search,
  Users,
  BookOpen,
  Hash,
  Clock
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

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently uploaded';
      
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return 'Recently';
    } catch (error) {
      return 'Recently uploaded';
    }
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-950/95 to-indigo-950/95 backdrop-blur-xl border-b border-purple-700/30 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={currentView === 'chat' ? handleBackToList : onBackToUpload}
          className="text-purple-300 hover:text-white hover:bg-purple-800/50 rounded-2xl touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">
            {currentView === 'chat' && selectedPdf ? selectedPdf["PDF NAME"] : 'Chat with PDFs'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="text-purple-300 hover:text-white hover:bg-purple-800/50 rounded-2xl touch-target"
        >
          <Menu className="w-5 h-5" />
        </Button>
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

  // PDF List View
  const PdfListView = () => (
    <div className="flex-1 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      <MobileHeader />
      
      <div className="px-6 py-6 space-y-6">
        {/* Multiple PDF Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 backdrop-blur-sm rounded-3xl p-6 border border-purple-600/40"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Chat with Multiple PDFs</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                You can chat with multiple PDFs at once! Select any document below to start asking questions across all your uploaded files simultaneously.
              </p>
              <Button
                onClick={onBackToUpload}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl px-4 py-2 text-sm font-medium shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload More PDFs
              </Button>
            </div>
          </div>
        </motion.div>

        {/* PDF Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Your Documents ({pdfs.length})</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
          ) : pdfs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-purple-800/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">No PDFs uploaded yet</h3>
              <p className="text-purple-300 text-sm mb-6">
                Upload your first PDF to start chatting with multiple documents
              </p>
              <Button
                onClick={onBackToUpload}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl px-6 py-3 font-medium shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload PDFs
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {pdfs.map((pdf, index) => (
                <motion.div
                  key={pdf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => handlePdfSelect(pdf)}
                    className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm border-purple-600/40 rounded-3xl p-5 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 active:scale-95"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg mb-2 truncate">
                          {pdf["PDF NAME"]}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{pdf["PAGES"]} pages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            <span>{pdf["WORDS"]} words</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(pdf.created_at)}</span>
                          </div>
                        </div>

                        {pdf["PDF SUMMARY"] && (
                          <p className="text-purple-200 text-sm line-clamp-2 leading-relaxed mb-3">
                            {pdf["PDF SUMMARY"]}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-purple-400 text-xs font-medium">
                            Tap to start chatting →
                          </span>
                          <div className="w-6 h-6 bg-purple-600/30 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-purple-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Chat View
  if (currentView === 'chat' && selectedPdf) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
        <MobileHeader />
        <PdfChatView
          userEmail={userEmail}
          pdfId={selectedPdf.id}
          onBackToList={handleBackToList}
          showBackButton={false}
        />
      </div>
    );
  }

  return <PdfListView />;
};

export default MobileChatLayout; 