import { ApiService } from './api';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  isPerfect?: boolean;
  correction?: string;
}

interface ApiChatHistory {
  history: {
    content: string;
    role: string;
  }[];
}

class ChatService {
  private api: ApiService;
  private currentTopic: string = 'new';

  constructor() {
    this.api = new ApiService();
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await this.api.get<ApiChatHistory>('/chat/history');

    return response.history.map((message) => ({
      text: message.content,
      isUser: message.role === 'user',
    }));
  }

  async sendMessage(text: string): Promise<ChatMessage[]> {
    const response = await this.api.post<{
      message: string;
      is_perfect?: boolean;
      correction?: string;
    }>('/chat/message', {
      message: text,
    });

    const userMessage: ChatMessage = {
      text: text,
      isUser: true,
      isPerfect: response.is_perfect,
      correction: response.correction,
    };

    const botMessage: ChatMessage = {
      text: response.message,
      isUser: false,
    };

    return [userMessage, botMessage];
  }

  async startNewChat(topic: string): Promise<ChatMessage[]> {
    this.currentTopic = topic;
    const response = await this.api.post<{ message: string }>('/chat/start', {
      topic,
    });

    const botMessage: ChatMessage = {
      text: response.message,
      isUser: false,
    };

    return [botMessage];
  }

  async clearHistory(): Promise<ChatMessage[]> {
    await this.startNewChat(this.currentTopic);
    return [];
  }
}

export const chatService = new ChatService();
