import { ApiService } from './api';

interface GenerateTextPayload {
  topic: string;
  difficulty: 'low' | 'normal' | 'high';
}

class ExploreService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async generateText(
    topicId: string | null,
    customTopic: string | null,
    difficulty: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<string> {
    const payload: Partial<GenerateTextPayload> = {
      difficulty,
    };

    if (topicId) {
      payload.topic = customTopic || topicId;
    } else if (customTopic) {
      payload.topic = customTopic;
    }

    const response = await this.api.post<{ text: string }>(
      '/search/texts',
      payload
    );
    return response.text;
  }
}

export const exploreService = new ExploreService();
