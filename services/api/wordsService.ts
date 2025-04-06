import { ApiService } from './api';

export interface Word {
  word: string;
  translation: string;
  examples?: string[];
  addedAt: Date;
}

export interface UserStats {
  totalWords: number;
  learnedWords: number;
  learningStreak: number;
  lastActiveDate: Date | null;
}

class WordsService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getWords(): Promise<Word[]> {
    const response = await this.api.get<Word[]>('/dictionary/words');

    return response.map((word) => ({
      ...word,
      addedAt:
        word.addedAt instanceof Date ? word.addedAt : new Date(word.addedAt),
    }));
  }

  async getWord(word: string): Promise<Word> {
    const response = await this.api.get<Word>(
      `/dictionary/word-info/${encodeURIComponent(word)}`
    );

    return {
      ...response,
      addedAt:
        response.addedAt instanceof Date
          ? response.addedAt
          : new Date(response.addedAt),
    };
  }

  async addWord(word: string, translation: string): Promise<Word> {
    const response = await this.api.post<Word>('/words', {
      word,
      translation,
    });

    return {
      ...response,
      addedAt:
        response.addedAt instanceof Date
          ? response.addedAt
          : new Date(response.addedAt),
    };
  }

  async deleteWord(wordId: string): Promise<boolean> {
    await this.api.delete(`/words/${wordId}`);
    return true;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get<UserStats>('/words/stats');

    return {
      ...response,
      lastActiveDate: response.lastActiveDate
        ? response.lastActiveDate instanceof Date
          ? response.lastActiveDate
          : new Date(response.lastActiveDate)
        : null,
    };
  }
}

export const wordsService = new WordsService();
