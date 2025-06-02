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
  Clock,
  Upload,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserPdfs, type PdfData } from '@/services/userTableService';
import PdfList from '@/components/PdfList';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import PdfChatView from '@/components/PdfChatView';
import { useAuth } from "@/hooks/useAuth";

interface MobileChatLayoutProps {
  userEmail: string;
  onBackToUpload: () => void;
  initialPdfId?: number | null;
}

const MobileChatLayout = ({ userEmail, onBackToUpload, initialPdfId }: MobileChatLayoutProps) => {
  const { user } = useAuth();
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
    <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-950/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-700/30 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={currentView === 'chat' ? handleBackToList : onBackToUpload}
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-2xl touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1 mx-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {currentView === 'chat' && selectedPdf ? (
              <>
                <span className="text-white font-bold text-sm block truncate">
                  {selectedPdf["PDF NAME"]}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span>{selectedPdf["PAGES"]} pages</span>
                  <span>•</span>
                  <span>{selectedPdf["WORDS"]?.toLocaleString()} words</span>
                  <span>•</span>
                  <span>{selectedPdf["LANGUAGE"] || 'Unknown'}</span>
                </div>
              </>
            ) : (
              <span className="text-white font-bold text-sm">Chat with PDFs</span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-2xl touch-target"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Enhanced PDF Status Bar for Chat Mode */}
      {currentView === 'chat' && selectedPdf && (
        <div className="mt-3 bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-2xl px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-xs font-medium">Ready to chat</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>AI analyzed</span>
            </div>
          </div>
        </div>
      )}
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
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <MobileHeader />
      
      <div className="px-6 py-8 space-y-6">
        {/* User Welcome - Name First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back,
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-6">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
          </h2>
        </motion.div>

        {/* PDF Selection Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/40"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">How to Start Chatting</h3>
          </div>
          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p><span className="font-semibold text-white">Select your PDFs:</span> Choose one or multiple documents from the list below</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p><span className="font-semibold text-white">Start chatting:</span> Click "Start Chatting" button to enter the chat system</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p><span className="font-semibold text-white">Ask questions:</span> Chat with multiple PDFs simultaneously for comprehensive answers</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            onClick={onBackToUpload}
            className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-3xl py-4 font-medium shadow-lg transition-all duration-200"
          >
            <Upload className="w-5 h-5 mb-2" />
            <span className="text-sm">Upload New PDF</span>
          </Button>
          
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-3xl py-4 font-medium transition-all duration-200"
          >
            <Settings className="w-5 h-5 mb-2" />
            <span className="text-sm">Settings</span>
          </Button>
        </motion.div>

        {/* PDF Selection */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
          </div>
        ) : pdfs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-800/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No PDFs uploaded yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              Upload your first PDF to start chatting with documents
            </p>
            <Button
              onClick={onBackToUpload}
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-3xl px-6 py-3 font-medium shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload First PDF
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/30 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Select PDFs to Chat</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tap on the PDFs below to select them, then click "Start Chatting" to enter the chat system. You can select multiple documents to ask questions across all of them.
              </p>
            </div>
            
            <PdfSelectionComponent 
              pdfs={pdfs} 
              onStartChat={(pdfs) => {
                setSelectedPdf(pdfs[0]);
                setCurrentView('chat');
              }}
              selectedPdfs={selectedPdf ? [selectedPdf] : []}
              setSelectedPdfs={(pdfs) => setSelectedPdf(pdfs[0])}
            />
          </motion.div>
        )}
      </div>
    </div>
  );

  // Chat View
  if (currentView === 'chat' && selectedPdf) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
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

// PDF Selection Component
interface PdfSelectionComponentProps {
  pdfs: PdfData[];
  onStartChat: (pdfs: PdfData[]) => void;
  selectedPdfs: PdfData[];
  setSelectedPdfs: (pdfs: PdfData[]) => void;
}

const PdfSelectionComponent = ({ pdfs, onStartChat, selectedPdfs, setSelectedPdfs }: PdfSelectionComponentProps) => {
  const togglePdfSelection = (pdf: PdfData) => {
    const isSelected = selectedPdfs.some(p => p.id === pdf.id);
    if (isSelected) {
      setSelectedPdfs(selectedPdfs.filter(p => p.id !== pdf.id));
    } else {
      setSelectedPdfs([...selectedPdfs, pdf]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection Status */}
      {selectedPdfs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-3xl p-4 border border-gray-600/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">
                  {selectedPdfs.length} PDF{selectedPdfs.length > 1 ? 's' : ''} Selected
                </h4>
                <p className="text-gray-300 text-sm">Ready to start chatting</p>
              </div>
            </div>
            <Button
              onClick={() => onStartChat(selectedPdfs)}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white rounded-2xl px-4 py-2 text-sm font-medium shadow-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* PDF List */}
      <div className="space-y-4">
        {pdfs.map((pdf) => {
          const isSelected = selectedPdfs.some(p => p.id === pdf.id);
          return (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pdf.id * 0.1 }}
            >
              <Card
                onClick={() => togglePdfSelection(pdf)}
                className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-600/40 rounded-3xl p-5 cursor-pointer hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 active:scale-95 ${isSelected ? 'ring-2 ring-gray-600/50 bg-gradient-to-r from-gray-700/60 to-gray-800/60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gray-600/50 border-gray-400' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-lg" />
                      )}
                    </div>
                  </div>

                  {/* PDF Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg truncate pr-2">{pdf["PDF NAME"]}</h3>
                      {isSelected && (
                        <div className="px-2 py-1 bg-gray-600/30 rounded-xl">
                          <span className="text-white text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        {pdf["PAGES"]} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        {pdf["WORDS"]?.toLocaleString()} words
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        {pdf["LANGUAGE"] || 'Unknown'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed mb-3">
                      {pdf["PDF SUMMARY"] || 'No summary available for this document.'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {isSelected ? 'Tap to deselect' : 'Tap to select'}
                      </span>
                      <span className="text-gray-500 text-xs font-medium">
                        {new Date(pdf.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Start Chat Button (fixed at bottom if pdfs selected) */}
      {selectedPdfs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-6 z-30"
        >
          <Button
            onClick={() => onStartChat(selectedPdfs)}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-3xl py-4 text-lg font-medium shadow-2xl"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Start Chatting with {selectedPdfs.length} PDF{selectedPdfs.length > 1 ? 's' : ''}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MobileChatLayout; 