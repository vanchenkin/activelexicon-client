import { ApiService } from './api';

export interface Word {
  id: string;
  word: string;
  translation: string;
  repetitions: number;
  lastRepetition: Date | null;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'new' | 'learning' | 'learned';
}

export interface WordFrequency {
  id: string;
  word: string;
  translation: string;
  frequency: number;
  lastUsed: Date | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class DictionaryService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getWords(): Promise<Word[]> {
    return this.api.get<Word[]>('/dictionary/words');
  }

  async getWordsWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Word>> {
    const params = {
      page: page.toString(),
      page_size: pageSize.toString(),
    };
    return this.api.get<PaginatedResult<Word>>(
      '/dictionary/words-paginated',
      params
    );
  }

  async getWord(word: string): Promise<Word | null> {
    try {
      return await this.api.get<Word>(
        `/dictionary/words/${encodeURIComponent(word)}`
      );
    } catch (error) {
      console.error('Error fetching word:', error);
      return null;
    }
  }

  async getWordFrequency(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<WordFrequency>> {
    const params = {
      page: page.toString(),
      page_size: pageSize.toString(),
    };
    return this.api.get<PaginatedResult<WordFrequency>>(
      '/dictionary/words-frequency',
      params
    );
  }

  async addWord(word: string, translation: string): Promise<Word> {
    const newWord: Partial<Word> = {
      word,
      translation,
      repetitions: 0,
      lastRepetition: null,
      difficulty: 'medium',
      status: 'new',
    };

    return this.api.post<Word>('/dictionary/words', newWord);
  }

  async deleteWord(word: string): Promise<void> {
    return this.api.delete(`/dictionary/words/${encodeURIComponent(word)}`);
  }
}

export const dictionaryService = new DictionaryService();
