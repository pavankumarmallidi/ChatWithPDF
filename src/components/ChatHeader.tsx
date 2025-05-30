
import { MessageCircle, Zap } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="px-6 py-4 backdrop-blur-sm bg-gray-900/50 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Assistant</h2>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-400" />
            Ask anything about your document
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
