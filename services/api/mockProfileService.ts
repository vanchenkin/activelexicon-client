import { User } from './authService';
import { mockAuthService } from './mockAuthService';
import { ProfileUpdateResponse, StatsData } from './profileService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockProfileService {
  private mockStats: StatsData = {
    general: {
      level: 10,
      points: 1200,
      totalWordsWritten: 150,
      maxLevelPoints: 2000,
    },
    dictionary: {
      totalWordsAdded: 5,
      totalIntervalRepeats: 25,
      totalWordsLearned: 2,
      currentWordCount: 5,
    },
    search: {
      totalTextsRead: 8,
    },
    chat: {
      totalChatsStarted: 3,
      totalMessagesSent: 15,
      totalPerfectMessages: 10,
    },
    tasks: {
      totalInsertWordTasks: 12,
      totalQuestionAnswerTasks: 18,
      totalWriteTextTasks: 12,
    },
    streak: {
      tasksDoneToday: 3,
      currentStreakDays: 5,
      maxTasksPerDay: 10,
      maxStreakDays: 15,
    },
  };

  async getProfile(): Promise<User> {
    await delay(500);
    const user = await mockAuthService.getCurrentUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return user;
  }

  async getProfileStats(): Promise<StatsData> {
    await delay(400);

    const user = await mockAuthService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return { ...this.mockStats };
  }

  async getStats(): Promise<StatsData> {
    await delay(400);

    const user = await mockAuthService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return { ...this.mockStats };
  }

  async updateProfile(updates: Partial<User['profile']>): Promise<User> {
    await delay(300);

    const user = await mockAuthService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...updates,
      },
    };

    return updatedUser;
  }

  async changeLanguageLevel(
    languageLevel: string
  ): Promise<ProfileUpdateResponse> {
    await delay(600);

    const user = await mockAuthService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return { success: true };
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ProfileUpdateResponse> {
    await delay(700);

    const user = await mockAuthService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!currentPassword) {
      throw new Error('Current password is required');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    return { success: true };
  }
}

export const mockProfileService = new MockProfileService();
