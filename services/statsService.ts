import { ApiService } from './api';

export interface UserStreak {
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string;
}

export interface StatsData {
  totalWords: number;
  learnedWords: number;
  practiceCompleted: number;
  lastActiveDate: string;
  streak: UserStreak;
}

export class StatsService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getUserStats(): Promise<StatsData> {
    return this.api.get<StatsData>('/stats');
  }

  async getStreak(): Promise<UserStreak> {
    return this.api.get<UserStreak>('/stats/streak');
  }

  async updateStreak(): Promise<UserStreak> {
    return this.api.post<UserStreak>('/stats/streak/update', {});
  }

  async resetStreak(): Promise<UserStreak> {
    return this.api.post<UserStreak>('/stats/streak/reset', {});
  }
}

export const statsService = new StatsService();
