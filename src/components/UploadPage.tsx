import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import { insertPdfData } from "@/services/userTableService";
import { ArrowLeft, FileText } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import UploadInterface from "@/components/UploadInterface";
import { Helmet } from "react-helmet-async";

interface UploadPageProps {
  onUploadSuccess?: (data: any) => void;
  onBackToHome?: () => void;
}

const UploadPage = ({ onUploadSuccess, onBackToHome }: UploadPageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

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
        
        await insertPdfData(user.email, pdfData);
        
        toast({
          title: "PDF analyzed successfully!",
          description: "Your PDF has been processed and is ready for questions.",
        });
        
        if (onUploadSuccess) {
          onUploadSuccess({
            pdfData,
            webhookData
          });
        }
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

  return (
    <>
      <Helmet>
        <title>Upload PDF - ChatWithPDF</title>
        <meta name="description" content="Upload your PDF to ChatWithPDF for instant AI-powered extraction, search, and chat. Secure and fast PDF analysis." />
        <meta property="og:title" content="Upload PDF - ChatWithPDF" />
        <meta property="og:description" content="Upload your PDF to ChatWithPDF for instant AI-powered extraction, search, and chat. Secure and fast PDF analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.svg" />
        <meta property="og:url" content="https://yourdomain.com/upload" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upload PDF - ChatWithPDF" />
        <meta name="twitter:description" content="Upload your PDF to ChatWithPDF for instant AI-powered extraction, search, and chat. Secure and fast PDF analysis." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900/60 to-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">PDF Upload</h2>
                  <p className="text-gray-400 text-base font-light">{user?.email}</p>
                </div>
              </div>
              
              {onBackToHome && (
                <Button
                  onClick={onBackToHome}
                  className="bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white rounded-3xl backdrop-blur-sm transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isUploading ? (
          <LoadingState uploadProgress={uploadProgress} />
        ) : (
          <UploadInterface onFileUpload={handleFileUpload} />
        )}
      </div>
    </>
  );
};

export default UploadPage; 