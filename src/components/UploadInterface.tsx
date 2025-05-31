
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

interface UploadInterfaceProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInterface = ({ onFileUpload }: UploadInterfaceProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Card className="w-full max-w-sm sm:max-w-lg card-base shadow-2xl theme-transition animate-fade-in rounded-3xl">
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full btn-primary flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">Upload Your PDF</h2>
            <p className="text-secondary text-sm sm:text-base">Select a PDF file to extract and analyze its content with AI</p>
          </div>

          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all hover:border-blue-500 theme-transition"
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
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
                <div className="text-primary">
                  <p className="font-medium text-sm sm:text-base">Click to upload PDF</p>
                  <p className="text-xs sm:text-sm text-secondary">or drag and drop</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadInterface;
