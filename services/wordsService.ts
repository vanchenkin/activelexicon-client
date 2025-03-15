import { ApiService } from './api';

export interface UserWord {
  id: string;
  word: string;
  translation: string;
  isLearned: boolean;
  addedAt: Date;
}

export interface UserStats {
  totalWords: number;
  learnedWords: number;
  learningStreak: number;
  lastLearnedDate: Date | null;
}

class WordsService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getUserWords(): Promise<UserWord[]> {
    const response = await this.api.get<UserWord[]>('/words');

    // Convert string dates to Date objects
    return response.map((word) => ({
      ...word,
      addedAt: new Date(word.addedAt),
    }));
  }

  async searchUserWords(query: string): Promise<UserWord[]> {
    if (!query) return this.getUserWords();

    const response = await this.api.get<UserWord[]>(`/words/search`, { query });

    // Convert string dates to Date objects
    return response.map((word) => ({
      ...word,
      addedAt: new Date(word.addedAt),
    }));
  }

  async addWord(word: string, translation: string): Promise<UserWord> {
    const response = await this.api.post<UserWord>('/words', {
      word,
      translation,
    });

    // Convert string date to Date object
    return {
      ...response,
      addedAt: new Date(response.addedAt),
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
      lastLearnedDate: response.lastLearnedDate
        ? new Date(response.lastLearnedDate)
        : null,
    };
  }
}

export const wordsService = new WordsService();
