import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import ChatListView from "@/components/ChatListView";
import PdfChatView from "@/components/PdfChatView";
import { getUserPdfs, type PdfData } from "@/services/userTableService";

interface ChatLayoutProps {
  userEmail: string;
  onBackToUpload: () => void;
  initialPdfId?: number | null;
}

const ChatLayout = ({ userEmail, onBackToUpload, initialPdfId }: ChatLayoutProps) => {
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(initialPdfId || null);

  useEffect(() => {
    if (initialPdfId) {
      setSelectedPdfId(initialPdfId);
    }
  }, [initialPdfId]);

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdf(pdf);
    setSelectedPdfId(pdf.id);
  };

  const handleBackToList = () => {
    setSelectedPdf(null);
    setSelectedPdfId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Chat with PDFs</h1>
          </div>
          
          <Button
            onClick={onBackToUpload}
            className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-3xl backdrop-blur-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800/50 bg-gray-900/60 rounded-r-3xl">
          <ChatListView
            userEmail={userEmail}
            onPdfSelect={handlePdfSelect}
            onBackToUpload={onBackToUpload}
            selectedPdfId={selectedPdfId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedPdf && selectedPdfId ? (
            <PdfChatView
              userEmail={userEmail}
              pdfId={selectedPdfId}
              onBackToList={handleBackToList}
              showBackButton={false}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950">
              <div className="text-center max-w-md px-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 tracking-tight">Select a PDF to start chatting</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-400 text-lg font-light">AI-powered document conversation</p>
                </div>
                <p className="text-gray-500 font-light">Choose a document from the list to begin your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
