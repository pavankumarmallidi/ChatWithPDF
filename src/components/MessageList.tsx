import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles } from "lucide-react";
import { forwardRef } from "react";
import { formatMessageDateTime } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relevanceScore?: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <div className="h-full flex flex-col" ref={ref}>
        <ScrollArea className="flex-1 px-6 py-4 h-full">
          <div className="space-y-6 pb-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-3 group`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-600/25 border border-gray-600/40">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] ${
                    message.isUser
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-[20px_20px_4px_20px] shadow-lg shadow-gray-600/25 border border-gray-600/30'
                      : 'bg-gray-800/60 backdrop-blur-sm text-white rounded-[20px_20px_20px_4px] border border-gray-700/50 shadow-lg'
                  } px-4 py-3 transition-all duration-300 hover:shadow-xl`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
                    {message.text}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600/30">
                    <p className="text-xs opacity-70 font-medium">
                      {formatMessageDateTime(message.timestamp)}
                    </p>
                    
                    {!message.isUser && message.relevanceScore !== undefined && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400 font-medium">
                          {message.relevanceScore.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-600/25 border border-gray-600/40">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 px-4 py-3 rounded-[20px_20px_20px_4px] shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300 ml-2 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
