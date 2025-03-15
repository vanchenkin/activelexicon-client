import { ApiService } from './api';

export interface Topic {
  id: string;
  name: string;
  icon: string;
}

class TopicsService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Get all topics
  async getTopics(): Promise<Topic[]> {
    return this.api.get<Topic[]>('/topics');
  }

  // Search topics
  async searchTopics(query: string): Promise<Topic[]> {
    if (!query) return this.getTopics();

    return this.api.get<Topic[]>('/topics/search', { query });
  }

  // Generate text based on topic
  async generateText(
    topicId: string | null,
    customTopic: string | null,
    complexity: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<string> {
    const payload: any = { complexity };

    if (topicId) {
      payload.topicId = topicId;
    }

    if (customTopic) {
      payload.customTopic = customTopic;
    }

    const response = await this.api.post<{ text: string }>(
      '/topics/generate-text',
      payload
    );
    return response.text;
  }
}

export const topicsService = new TopicsService();
