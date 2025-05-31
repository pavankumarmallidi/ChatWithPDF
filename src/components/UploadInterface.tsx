
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";

interface UploadInterfaceProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInterface = ({ onFileUpload }: UploadInterfaceProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Card className="w-full max-w-sm sm:max-w-lg card-base shadow-2xl animate-fade-in rounded-2xl">
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 btn-primary rounded-2xl flex items-center justify-center shadow-lg animate-glow">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">Upload Your PDF</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-secondary text-sm sm:text-base">AI-powered document analysis</p>
            </div>
            <p className="text-muted text-xs sm:text-sm">Select a PDF file to extract and analyze its content</p>
          </div>

          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-purple-500 hover:bg-purple-500/5 cursor-pointer group"
              style={{ 
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div className="text-primary">
                  <p className="font-medium text-sm sm:text-base">Click to upload PDF</p>
                  <p className="text-xs sm:text-sm text-secondary">or drag and drop</p>
                </div>
                <p className="text-xs text-muted">Supports PDF files up to 10MB</p>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-color">
            <div className="flex items-center justify-center gap-4 text-xs text-muted">
              <span>✓ Secure processing</span>
              <span>✓ AI analysis</span>
              <span>✓ Instant results</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadInterface;
