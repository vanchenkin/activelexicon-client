import { ApiService } from './api';
import { User } from './authService';

export interface ProfileUpdateResponse {
  success: boolean;
}

interface ApiStatsResponse {
  general: {
    level: number;
    points: number;
    total_words_written: number;
    max_level_points: number;
  };
  dictionary: {
    total_words_added: number;
    total_interval_repeats: number;
    total_words_learned: number;
    current_word_count: number;
  };
  search: {
    total_texts_read: number;
  };
  chat: {
    total_chats_started: number;
    total_messages_sent: number;
    total_perfect_messages: number;
  };
  tasks: {
    total_insert_word_tasks: number;
    total_question_answer_tasks: number;
    total_write_text_tasks: number;
  };
  streak: {
    tasks_done_today: number;
    current_streak_days: number;
    max_tasks_per_day: number;
    max_streak_days: number;
  };
}

export interface StatsData {
  general: {
    level: number;
    points: number;
    totalWordsWritten: number;
    maxLevelPoints: number;
  };
  dictionary: {
    totalWordsAdded: number;
    totalIntervalRepeats: number;
    totalWordsLearned: number;
    currentWordCount: number;
  };
  search: {
    totalTextsRead: number;
  };
  chat: {
    totalChatsStarted: number;
    totalMessagesSent: number;
    totalPerfectMessages: number;
  };
  tasks: {
    totalInsertWordTasks: number;
    totalQuestionAnswerTasks: number;
    totalWriteTextTasks: number;
  };
  streak: {
    tasksDoneToday: number;
    currentStreakDays: number;
    maxTasksPerDay: number;
    maxStreakDays: number;
  };
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
    const response = await this.api.get<{
      email: string;
      language_level: string;
      calculated_language_level: string;
      avatar_id: number;
    }>('/profile');

    return {
      email: response.email,
      profile: {
        avatarId: response.avatar_id,
        languageLevel: response.language_level,
        calculatedLanguageLevel: response.calculated_language_level,
      },
    };
  }

  async getProfileStats(): Promise<StatsData> {
    const response = await this.api.get<ApiStatsResponse>('/stats');

    return {
      general: {
        level: response.general.level,
        points: response.general.points,
        totalWordsWritten: response.general.total_words_written,
        maxLevelPoints: response.general.max_level_points,
      },
      dictionary: {
        totalWordsAdded: response.dictionary.total_words_added,
        totalIntervalRepeats: response.dictionary.total_interval_repeats,
        totalWordsLearned: response.dictionary.total_words_learned,
        currentWordCount: response.dictionary.current_word_count,
      },
      search: {
        totalTextsRead: response.search.total_texts_read,
      },
      chat: {
        totalChatsStarted: response.chat.total_chats_started,
        totalMessagesSent: response.chat.total_messages_sent,
        totalPerfectMessages: response.chat.total_perfect_messages,
      },
      tasks: {
        totalInsertWordTasks: response.tasks.total_insert_word_tasks,
        totalQuestionAnswerTasks: response.tasks.total_question_answer_tasks,
        totalWriteTextTasks: response.tasks.total_write_text_tasks,
      },
      streak: {
        tasksDoneToday: response.streak.tasks_done_today,
        currentStreakDays: response.streak.current_streak_days,
        maxTasksPerDay: response.streak.max_tasks_per_day,
        maxStreakDays: response.streak.max_streak_days,
      },
    };
  }

  async changeLanguageLevel(
    languageLevel: string
  ): Promise<ProfileUpdateResponse> {
    await this.api.post('/profile/change-language-level', {
      language_level: languageLevel,
    });
    return { success: true };
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ProfileUpdateResponse> {
    await this.api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return { success: true };
  }

  async updateProfile(updates: Partial<User['profile']>): Promise<User> {
    if (updates.languageLevel) {
      await this.changeLanguageLevel(updates.languageLevel);
    }

    const currentProfile = await this.getProfile();

    return {
      email: currentProfile.email,
      profile: {
        ...currentProfile.profile,
        avatarId: updates.avatarId || currentProfile.profile.avatarId,
        languageLevel:
          updates.languageLevel || currentProfile.profile.languageLevel,
        calculatedLanguageLevel: currentProfile.profile.calculatedLanguageLevel,
      },
    };
  }
}

export const profileService = new ProfileService();
