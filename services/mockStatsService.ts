import { StatsData, UserStreak } from './statsService';

class MockStatsService {
  private mockStats: StatsData = {
    totalWords: 120,
    learnedWords: 85,
    practiceCompleted: 42,
    lastActiveDate: new Date().toISOString(),
    streak: {
      currentStreak: 5,
      maxStreak: 15,
      lastActiveDate: new Date().toISOString(),
    },
  };

  async getUserStats(): Promise<StatsData> {
    return Promise.resolve({ ...this.mockStats });
  }

  async getStreak(): Promise<UserStreak> {
    return Promise.resolve({ ...this.mockStats.streak });
  }

  async updateStreak(): Promise<UserStreak> {
    const updatedStreak = {
      ...this.mockStats.streak,
      currentStreak: this.mockStats.streak.currentStreak + 1,
      lastActiveDate: new Date().toISOString(),
    };

    if (updatedStreak.currentStreak > updatedStreak.maxStreak) {
      updatedStreak.maxStreak = updatedStreak.currentStreak;
    }

    this.mockStats.streak = updatedStreak;
    this.mockStats.lastActiveDate = new Date().toISOString();

    return Promise.resolve({ ...updatedStreak });
  }
}

export const mockStatsService = new MockStatsService();
