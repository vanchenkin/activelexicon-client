import { ApiService } from './api';
import { User } from './authService';

export interface ProfileUpdateResponse {
  success: boolean;
}

export interface StatsData {
  totalWords: number;
  learnedWords: number;
  learning?: number;
  learned?: number;
  practiceCompleted: number;
  streak: UserStreak;
}

export interface UserStreak {
  currentStreak: number;
  maxStreak: number;
}

export class ProfileService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getProfile(): Promise<User> {
    const user = await this.api.get<User>('/profile');
    return user;
  }

  async getProfileStats(): Promise<StatsData> {
    const stats = await this.api.get<StatsData>('/profile/stats');
    return stats;
  }

  async getStats(): Promise<StatsData> {
    return this.api.get<StatsData>('/dictionary/stats');
  }

  async updateProfile(updates: Partial<User['profile']>): Promise<User> {
    const updatedUser = await this.api.patch<User>('/profile', updates);
    return updatedUser;
  }

  async changeLanguageLevel(
    languageLevel: string
  ): Promise<ProfileUpdateResponse> {
    const response = await this.api.post<ProfileUpdateResponse>(
      '/profile/change-language-level',
      {
        languageLevel,
      }
    );
    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ProfileUpdateResponse> {
    const response = await this.api.post<ProfileUpdateResponse>(
      '/profile/change-password',
      {
        currentPassword,
        newPassword,
      }
    );
    return response;
  }
}

export const profileService = new ProfileService();
