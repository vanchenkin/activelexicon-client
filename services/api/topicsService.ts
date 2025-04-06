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

  async getTopics(): Promise<Topic[]> {
    return this.api.get<Topic[]>('/topics');
  }

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
      '/generate-text',
      payload
    );
    return response.text;
  }
}

export const topicsService = new TopicsService();
