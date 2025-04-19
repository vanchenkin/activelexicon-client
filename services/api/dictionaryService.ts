import { ApiService } from './api';

export interface Translation {
  translation: string;
  part_of_speech: string;
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
    inUserDictionary: boolean;
  } | null> {
    try {
      const response = await this.api.get<{
        word: string;
        translations: Translation[];
        in_user_dictionary: boolean;
      }>(`/dictionary/word-info/${encodeURIComponent(word)}`);
      return {
        word: response.word,
        translations: response.translations,
        inUserDictionary: response.in_user_dictionary,
      };
    } catch (error) {
      console.error('Error fetching word info:', error);
      return null;
    }
  }

  async getWordFrequency(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    words: WordFrequencyItem[];
    total_pages: number;
  }> {
    const params = {
      page: page.toString(),
      page_size: pageSize.toString(),
    };
    const response = await this.api.get<{
      words: ApiWordFrequencyItem[];
      total_pages: number;
    }>('/dictionary/words-frequency', params);
    return {
      words: response.words.map((item) => ({
        word: item.word,
        count: item.used_count,
      })),
      total_pages: response.total_pages,
    };
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

  async getWord(word: string): Promise<{
    word: string;
    translations: Translation[];
    inUserDictionary: boolean;
  }> {
    try {
      const info = await this.getWordInfo(word);
      return {
        word: info?.word || word,
        translations: info?.translations || [],
        inUserDictionary: info?.inUserDictionary || false,
      };
    } catch (error) {
      console.error('Error fetching word:', error);
      return {
        word,
        translations: [],
        inUserDictionary: false,
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
        total_pages: number;
      }>('/dictionary/words', params);

      const words = response.words.map((w) => ({
        word: w.word,
        translations: w.translations,
        progress: w.progress || 0,
        isReadyToRepeat: w.is_ready_to_repeat || false,
      }));

      return {
        items: words,
        page,
        pageSize,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching paginated words:', error);
      return {
        items: [],
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }
}

export const dictionaryService = new DictionaryService();
