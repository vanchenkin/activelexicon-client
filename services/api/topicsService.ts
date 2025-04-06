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
}

export const topicsService = new TopicsService();
