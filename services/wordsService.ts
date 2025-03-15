import { ApiService } from './api';

export interface Word {
  id: string;
  word: string;
  translation: string;
  examples?: string[];
  learned: boolean;
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
    const response = await this.api.get<Word[]>('/words');

    // Convert string dates to Date objects if needed
    return response.map((word) => ({
      ...word,
      addedAt:
        word.addedAt instanceof Date ? word.addedAt : new Date(word.addedAt),
    }));
  }

  async getWord(id: string): Promise<Word> {
    const word = await this.api.get<Word>(`/words/${id}`);

    // Convert string date to Date object if needed
    return {
      ...word,
      addedAt:
        word.addedAt instanceof Date ? word.addedAt : new Date(word.addedAt),
    };
  }

  async searchWords(query: string): Promise<Word[]> {
    if (!query) return this.getWords();

    const response = await this.api.get<Word[]>(`/words/search`, { query });

    // Convert string dates to Date objects if needed
    return response.map((word) => ({
      ...word,
      addedAt:
        word.addedAt instanceof Date ? word.addedAt : new Date(word.addedAt),
    }));
  }

  async addWord(word: string, translation: string): Promise<Word> {
    const response = await this.api.post<Word>('/words', {
      word,
      translation,
    });

    // Convert string date to Date object
    return {
      ...response,
      addedAt:
        response.addedAt instanceof Date
          ? response.addedAt
          : new Date(response.addedAt),
    };
  }

  async toggleWordLearned(id: string): Promise<Word> {
    const response = await this.api.patch<Word>(`/words/${id}/toggle-learned`);

    // Convert string date to Date object
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

    // Convert string date to Date object if it exists
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
