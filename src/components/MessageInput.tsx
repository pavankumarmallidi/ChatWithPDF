import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const MessageInput = ({ inputMessage, setInputMessage, onSendMessage, isLoading }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputMessage.trim()) {
        onSendMessage(e as any);
      }
    }
  };

  return (
    <div className="p-6 backdrop-blur-sm bg-white/5 border-t border-white/10 flex-shrink-0">
      <form onSubmit={onSendMessage} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about your PDF..."
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl px-4 py-3 text-sm resize-none transition-all duration-300 hover:border-white/30 focus:bg-white/15 min-h-[48px] max-h-[120px]"
            disabled={isLoading}
            rows={1}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white border-0 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95 min-w-[48px] h-12"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-3 opacity-70">
        AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
};

export default MessageInput;
