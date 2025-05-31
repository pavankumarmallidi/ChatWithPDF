
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { type PdfData } from "@/services/userTableService";
import ChatListView from "./ChatListView";
import PdfChatView from "./PdfChatView";
import ThemeToggle from "./ThemeToggle";

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
  };

  return (
    <div className="min-h-screen bg-primary theme-transition">
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
          <div className="w-80 flex-shrink-0 border-r theme-transition" style={{ borderColor: 'var(--border-color)' }}>
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
              <div className="h-full flex items-center justify-center bg-primary">
                <div className="text-center animate-fade-in">
                  <div className="w-24 h-24 btn-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Select a PDF to start chatting</h3>
                  <p className="text-secondary text-lg">Choose a document from the list to begin your conversation</p>
                  <div className="mt-6">
                    <ThemeToggle className="mx-auto" />
                  </div>
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
