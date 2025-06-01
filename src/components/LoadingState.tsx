import { Card } from "@/components/ui/card";
import { Sparkles, FileText } from "lucide-react";

interface LoadingStateProps {
  uploadProgress: number;
}

const LoadingState = ({ uploadProgress }: LoadingStateProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#4169E1]/30 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#5578F0]/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-[#4169E1]/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#5578F0]/25 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#4169E1]/35 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-sm sm:max-w-md bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Shimmering gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse"></div>
        
        <div className="p-6 sm:p-8 text-center relative z-10">
          <div className="relative mb-6">
            {/* Main circular loading animation */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4169E1] border-r-[#5578F0] animate-spin shadow-lg"></div>
              
              {/* Inner pulsing ring */}
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#5578F0]/60 border-l-[#4169E1]/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              
              {/* Center icon with glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4169E1]/20 to-[#5578F0]/20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-4 h-4 text-[#4169E1] animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="absolute bottom-4 right-4">
              <Sparkles className="w-3 h-3 text-[#5578F0] animate-bounce" style={{ animationDelay: '0.8s' }} />
            </div>
            <div className="absolute bottom-4 left-4">
              <Sparkles className="w-3 h-3 text-[#4169E1] animate-bounce" style={{ animationDelay: '1.4s' }} />
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 animate-pulse">Analyzing Your PDF</h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base animate-fade-in">Our AI is extracting insights and understanding your document structure...</p>
          
          {/* Animated progress indicator without percentage */}
          <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4 overflow-hidden relative">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-[#4169E1] to-[#5578F0] transition-all duration-500 relative"
              style={{ width: `${uploadProgress}%` }}
            >
              {/* Moving shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
            
            {/* Animated dots showing activity */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-[#4169E1] font-medium">
            <span className="text-base sm:text-lg">Processing</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#5578F0] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
