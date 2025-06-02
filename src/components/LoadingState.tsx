import { Card } from "@/components/ui/card";
import { Sparkles, FileText } from "lucide-react";

interface LoadingStateProps {
  uploadProgress: number;
}

const LoadingState = ({ uploadProgress }: LoadingStateProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-6 sm:p-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-gray-400/30 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-500/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-gray-400/35 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-gray-500/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-lg bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-600/30 backdrop-blur-sm shadow-2xl rounded-3xl">
        <div className="p-8 sm:p-10 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 tracking-tight">Processing Your PDF</h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gray-400 animate-pulse" />
              <p className="text-gray-300 text-lg font-light">AI analysis in progress</p>
            </div>
            <p className="text-gray-400 text-base font-light">Please wait while we extract and analyze your document content</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 font-medium">Processing</span>
              <span className="text-sm text-gray-300 font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-900/40 rounded-full h-3 overflow-hidden border border-gray-700/40">
              <div 
                className="bg-gradient-to-r from-gray-600 to-gray-800 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            <div className={`flex items-center justify-center gap-2 text-sm transition-opacity duration-500 ${
              uploadProgress >= 25 ? 'text-gray-300 opacity-100' : 'text-gray-500 opacity-60'
            }`}>
              <div className={`w-2 h-2 rounded-full ${uploadProgress >= 25 ? 'bg-green-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
              <span className="font-medium">Document uploaded</span>
            </div>
            <div className={`flex items-center justify-center gap-2 text-sm transition-opacity duration-500 ${
              uploadProgress >= 50 ? 'text-gray-300 opacity-100' : 'text-gray-500 opacity-60'
            }`}>
              <div className={`w-2 h-2 rounded-full ${uploadProgress >= 50 ? 'bg-green-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
              <span className="font-medium">Text extraction complete</span>
            </div>
            <div className={`flex items-center justify-center gap-2 text-sm transition-opacity duration-500 ${
              uploadProgress >= 75 ? 'text-gray-300 opacity-100' : 'text-gray-500 opacity-60'
            }`}>
              <div className={`w-2 h-2 rounded-full ${uploadProgress >= 75 ? 'bg-green-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
              <span className="font-medium">AI analysis running</span>
            </div>
            <div className={`flex items-center justify-center gap-2 text-sm transition-opacity duration-500 ${
              uploadProgress >= 100 ? 'text-gray-300 opacity-100' : 'text-gray-500 opacity-60'
            }`}>
              <div className={`w-2 h-2 rounded-full ${uploadProgress >= 100 ? 'bg-green-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
              <span className="font-medium">Processing complete</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
