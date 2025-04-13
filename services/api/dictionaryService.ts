import { ApiService } from './api';

export interface Translation {
  text: string;
}

export interface DictionaryWord {
  word: string;
  progress: number;
  translations: Translation[];
  isReadyToRepeat: boolean;
}
export interface WordFrequencyItem {
  word: string;
  count: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ApiDictionaryWord {
  word: string;
  translations: Translation[];
  progress?: number;
  is_ready_to_repeat?: boolean;
}

interface ApiWordInfo {
  word: string;
  translations: Translation[];
}

interface ApiWordFrequencyItem {
  word: string;
  used_count: number;
}

class DictionaryService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getWordInfo(word: string): Promise<{
    word: string;
    translations: Translation[];
  } | null> {
    try {
      const response = await this.api.get<{
        word: string;
        translations: Translation[];
      }>(`/dictionary/word-info/${encodeURIComponent(word)}`);
      return {
        word: response.word,
        translations: response.translations,
      };
    } catch (error) {
      console.error('Error fetching word info:', error);
      return null;
    }
  }

  async getWordFrequency(
    page: number = 1,
    pageSize: number = 10
  ): Promise<WordFrequencyItem[]> {
    const params = {
      page: page.toString(),
      page_size: pageSize.toString(),
    };
    const response = await this.api.get<{ words: ApiWordFrequencyItem[] }>(
      '/dictionary/words-frequency',
      params
    );
    return response.words.map((item) => ({
      word: item.word,
      count: item.used_count,
    }));
  }

  async addWord(word: string): Promise<DictionaryWord> {
    const wordResponse = await this.api.post<DictionaryWord>(
      '/dictionary/words',
      {
        word,
      }
    );
    return wordResponse;
  }

  async deleteWord(word: string): Promise<void> {
    await this.api.delete(`/dictionary/words/${encodeURIComponent(word)}`);
  }

  async getWord(word: string): Promise<ApiWordInfo> {
    try {
      const info = await this.getWordInfo(word);
      return {
        word: info?.word || word,
        translations: info?.translations || [],
      };
    } catch (error) {
      console.error('Error fetching word:', error);
      return {
        word,
        translations: [],
      };
    }
  }

  async getWordsWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<DictionaryWord>> {
    try {
      const params = {
        page: page.toString(),
        page_size: pageSize.toString(),
      };
      const response = await this.api.get<{
        words: ApiDictionaryWord[];
        pages_count: number;
        total?: number;
      }>('/dictionary/words', params);

      const words = response.words.map((w) => ({
        word: w.word,
        translations: w.translations,
        progress: w.progress || 0,
        isReadyToRepeat: w.is_ready_to_repeat || false,
      }));

      return {
        items: words,
        total: response.total || words.length,
        page,
        pageSize,
        totalPages:
          response.pages_count ||
          Math.ceil((response.total || words.length) / pageSize),
      };
    } catch (error) {
      console.error('Error fetching paginated words:', error);
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }
}

export const dictionaryService = new DictionaryService();
