import { ApiService } from './api';

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface ApiChatMessage {
  message: string;
  is_user: boolean;
}
interface ApiChatHistory {
  history: {
    content: string;
    role: string;
  }[];
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
    const response = await this.api.get<ApiChatHistory>('/chat/history');

    return response.history.map((message) => ({
      text: message.content,
      isUser: message.role === 'user',
    }));
  }

  async sendMessage(text: string): Promise<ChatMessage[]> {
    const response = await this.api.post<{ message: string }>('/chat/message', {
      message: text,
    });

    const userMessage: ChatMessage = {
      text: text,
      isUser: true,
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
