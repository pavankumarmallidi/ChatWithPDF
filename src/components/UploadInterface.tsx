import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";

interface UploadInterfaceProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInterface = ({ onFileUpload }: UploadInterfaceProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-6 sm:p-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Card className="w-full max-w-lg bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-600/30 backdrop-blur-sm shadow-2xl rounded-3xl">
        <div className="p-8 sm:p-10 text-center">
          <div className="mb-8 sm:mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 tracking-tight">Upload Your PDF</h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gray-400" />
              <p className="text-gray-300 text-lg font-light">AI-powered document analysis</p>
            </div>
            <p className="text-gray-400 text-base font-light">Select a PDF file to extract and analyze its content with advanced AI</p>
          </div>

          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={onFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload" 
              className="block w-full p-8 border-2 border-dashed border-gray-600/40 rounded-3xl hover:border-gray-500/60 transition-all duration-200 cursor-pointer bg-gray-800/20 hover:bg-gray-700/30 backdrop-blur-sm group"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600/60 to-gray-800/60 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm font-light">PDF files only • Max size: 10MB</p>
                </div>
              </div>
            </label>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-gray-600/30 rounded-2xl flex items-center justify-center mx-auto border border-gray-500/30">
                  <FileText className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Extract Text</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-gray-600/30 rounded-2xl flex items-center justify-center mx-auto border border-gray-500/30">
                  <Sparkles className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 font-medium">AI Analysis</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-gray-600/30 rounded-2xl flex items-center justify-center mx-auto border border-gray-500/30">
                  <Upload className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Fast Upload</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadInterface;
