import { ApiService } from './api';

export interface WordDetails {
  word: string;
  translation: string;
  partOfSpeech: string;
  gender?: string;
  example: string;
}

class TranslationService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getWordDetails(word: string): Promise<WordDetails> {
    return this.api.get<WordDetails>(
      `/translation/word/${encodeURIComponent(word)}`
    );
  }

  async addWordToVocabulary(word: string): Promise<boolean> {
    const response = await this.api.post<{ success: boolean }>(
      '/vocabulary/add',
      { word }
    );
    return response.success;
  }
}

export const translationService = new TranslationService();
