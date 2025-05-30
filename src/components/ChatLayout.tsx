
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { type PdfData } from "@/services/userTableService";
import ChatListView from "./ChatListView";
import PdfChatView from "./PdfChatView";

interface ChatLayoutProps {
  userEmail: string;
  onBackToUpload: () => void;
  initialPdfId?: number | null;
}

const ChatLayout = ({ userEmail, onBackToUpload, initialPdfId }: ChatLayoutProps) => {
  const [selectedPdf, setSelectedPdf] = useState<PdfData | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(initialPdfId || null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const handlePdfSelect = (pdf: PdfData) => {
    setSelectedPdf(pdf);
    setSelectedPdfId(pdf.id);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
    // Don't clear selectedPdf to maintain desktop state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        {/* Mobile: Show either list or chat */}
        <div className="lg:hidden w-full">
          {!showChatOnMobile ? (
            <ChatListView
              userEmail={userEmail}
              onPdfSelect={handlePdfSelect}
              onBackToUpload={onBackToUpload}
              selectedPdfId={selectedPdfId}
            />
          ) : (
            selectedPdf && (
              <PdfChatView
                userEmail={userEmail}
                pdfId={selectedPdf.id}
                onBackToList={handleBackToList}
                showBackButton={true}
              />
            )
          )}
        </div>

        {/* Desktop: Side-by-side panels */}
        <div className="hidden lg:flex w-full">
          {/* Left Panel - Chat List */}
          <div className="w-80 flex-shrink-0 border-r border-gray-200">
            <ChatListView
              userEmail={userEmail}
              onPdfSelect={handlePdfSelect}
              onBackToUpload={onBackToUpload}
              selectedPdfId={selectedPdfId}
            />
          </div>

          {/* Right Panel - Chat */}
          <div className="flex-1">
            {selectedPdf ? (
              <PdfChatView
                userEmail={userEmail}
                pdfId={selectedPdf.id}
                onBackToList={handleBackToList}
                showBackButton={false}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a PDF to start chatting</h3>
                  <p className="text-gray-500">Choose a document from the list to begin your conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
