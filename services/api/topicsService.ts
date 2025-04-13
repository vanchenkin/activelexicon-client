import { ApiService } from './api';

export interface Topic {
  name: string;
  icon: string;
}

class TopicsService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getTopics(): Promise<Topic[]> {
    const response = await this.api.get<{ topics: Topic[] }>('/search/topics');

    return response.topics.map((topic) => ({
      name: topic.name,
      icon: topic.icon,
    }));
  }
}

export const topicsService = new TopicsService();
