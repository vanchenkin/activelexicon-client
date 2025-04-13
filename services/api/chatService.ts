import { ApiService } from './api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  timestamp: string;
}

interface MessageCheckResult {
  isCorrect: boolean;
  suggestions?: string[];
}

class ChatService {
  private api: ApiService;
  private currentTopic: string = 'new';

  constructor() {
    this.api = new ApiService();
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await this.api.get<{ history: ApiChatMessage[] }>(
      '/chat/history'
    );

    return response.history.map((message) => ({
      id: message.id,
      text: message.message,
      isUser: message.is_user,
      timestamp: new Date(message.timestamp),
    }));
  }

  async sendMessage(text: string): Promise<ChatMessage[]> {
    const response = await this.api.post<{ message: string }>('/chat/message', {
      message: text,
    });

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: response.message,
      isUser: false,
      timestamp: new Date(),
    };

    return [botMessage];
  }

  async startNewChat(topic: string): Promise<ChatMessage[]> {
    this.currentTopic = topic;
    const response = await this.api.post<{ message: string }>('/chat/start', {
      topic,
    });

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: response.message,
      isUser: false,
      timestamp: new Date(),
    };

    return [botMessage];
  }

  async clearHistory(): Promise<ChatMessage[]> {
    await this.startNewChat(this.currentTopic);
    return [];
  }

  async checkMessageCorrectness(text: string): Promise<MessageCheckResult> {
    const response = await this.api.post<MessageCheckResult>('/chat/check', {
      message: text,
    });

    return {
      isCorrect: response.isCorrect,
      suggestions: response.suggestions,
    };
  }
}

export const chatService = new ChatService();
