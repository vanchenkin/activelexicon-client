import { ApiService } from './api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

class ChatService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Get chat history
  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await this.api.get<ChatMessage[]>('/chat/history');

    // Convert string dates to Date objects
    return response.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  }

  // Send message and get AI response
  async sendMessage(text: string): Promise<ChatMessage[]> {
    const response = await this.api.post<ChatMessage[]>('/chat/message', {
      text,
    });

    // Convert string dates to Date objects
    return response.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  }

  // Clear chat history
  async clearHistory(): Promise<boolean> {
    await this.api.delete('/chat/history');
    return true;
  }
}

export const chatService = new ChatService();
