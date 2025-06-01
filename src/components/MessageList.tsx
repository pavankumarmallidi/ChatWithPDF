import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles } from "lucide-react";
import { forwardRef } from "react";

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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-[20px_20px_4px_20px] shadow-lg shadow-blue-600/25'
                      : 'bg-white/10 backdrop-blur-sm text-white rounded-[20px_20px_20px_4px] border border-white/10 shadow-lg'
                  } px-4 py-3 transition-all duration-300 hover:shadow-xl`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    {!message.isUser && message.relevanceScore !== undefined && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400 font-medium">
                          {message.relevanceScore.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-[20px_20px_20px_4px] shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300 ml-2">AI is thinking...</span>
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
