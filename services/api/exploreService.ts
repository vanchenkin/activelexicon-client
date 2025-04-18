import { ApiService } from './api';
import { Complexity } from '@/types/common';

interface GenerateTextPayload {
  topic: string;
  difficulty: Complexity;
}

class ExploreService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async generateText(
    topic: string,
    difficulty: Complexity = 'normal'
  ): Promise<string> {
    const payload: Partial<GenerateTextPayload> = {
      difficulty,
      topic,
    };

    const response = await this.api.post<{ text: string }>(
      '/search/texts',
      payload
    );
    return response.text;
  }
}

export const exploreService = new ExploreService();
