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

  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await this.api.get<ChatMessage[]>('/chat/history');

    return response.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  }

  async sendMessage(text: string): Promise<ChatMessage[]> {
    const response = await this.api.post<ChatMessage[]>('/chat/message', {
      text,
    });

    return response.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  }

  async clearHistory(): Promise<boolean> {
    await this.api.delete('/chat/history');
    return true;
  }
}

export const chatService = new ChatService();
