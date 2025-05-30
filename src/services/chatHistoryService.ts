
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  pdfId: number;
}

interface ChatHistory {
  [pdfId: number]: {
    messages: ChatMessage[];
    lastMessage?: string;
    lastTimestamp?: Date;
  };
}

class ChatHistoryService {
  private chatHistory: ChatHistory = {};

  addMessage(pdfId: number, message: ChatMessage) {
    if (!this.chatHistory[pdfId]) {
      this.chatHistory[pdfId] = { messages: [] };
    }
    
    this.chatHistory[pdfId].messages.push(message);
    this.chatHistory[pdfId].lastMessage = message.text;
    this.chatHistory[pdfId].lastTimestamp = message.timestamp;
  }

  getMessages(pdfId: number): ChatMessage[] {
    return this.chatHistory[pdfId]?.messages || [];
  }

  getLastMessage(pdfId: number): string | undefined {
    return this.chatHistory[pdfId]?.lastMessage;
  }

  getLastTimestamp(pdfId: number): Date | undefined {
    return this.chatHistory[pdfId]?.lastTimestamp;
  }

  initializeChat(pdfId: number, pdfName: string) {
    if (!this.chatHistory[pdfId]) {
      this.chatHistory[pdfId] = { 
        messages: [{
          id: "1",
          text: `Hi! I'm ready to answer questions about "${pdfName}". What would you like to know?`,
          isUser: false,
          timestamp: new Date(),
          pdfId: pdfId
        }]
      };
      this.chatHistory[pdfId].lastMessage = this.chatHistory[pdfId].messages[0].text;
      this.chatHistory[pdfId].lastTimestamp = this.chatHistory[pdfId].messages[0].timestamp;
    }
  }
}

export const chatHistoryService = new ChatHistoryService();
export type { ChatMessage };
