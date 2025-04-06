import { ApiService } from './api';

class ExploreService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
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
      '/search/text',
      payload
    );
    return response.text;
  }
}

export const exploreService = new ExploreService();
