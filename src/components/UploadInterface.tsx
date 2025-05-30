
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

interface UploadInterfaceProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInterface = ({ onFileUpload }: UploadInterfaceProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Card className="w-full max-w-sm sm:max-w-lg bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Upload Your PDF</h2>
            <p className="text-gray-300 text-sm sm:text-base">Select a PDF file to extract and analyze its content with AI</p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/5">
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
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                <div className="text-white">
                  <p className="font-medium text-sm sm:text-base">Click to upload PDF</p>
                  <p className="text-xs sm:text-sm text-gray-400">or drag and drop</p>
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
