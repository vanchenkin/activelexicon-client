import { ApiService } from './api';

export interface Word {
  id: string;
  word: string;
  translation: string;
  examples: string[];
  learned: boolean;
}

export interface UserStats {
  wordsLearned: number;
  totalWords: number;
  streak: number;
  lastActive: string;
}

class VocabularyService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Get all words
  async getWords(): Promise<Word[]> {
    return this.api.get<Word[]>('/vocabulary/words');
  }

  // Get a single word by ID
  async getWord(id: string): Promise<Word> {
    return this.api.get<Word>(`/vocabulary/words/${id}`);
  }

  // Mark a word as learned/unlearned
  async toggleWordLearned(id: string): Promise<Word> {
    return this.api.patch<Word>(`/vocabulary/words/${id}/toggle-learned`);
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    return this.api.get<UserStats>('/vocabulary/stats');
  }
}

export const vocabularyService = new VocabularyService();
