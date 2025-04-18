import {
  DictionaryWord,
  WordFrequencyItem,
  PaginatedResult,
  Translation,
} from './dictionaryService';
import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface MockWord {
  word: string;
  translations: Translation[];
  repetitions: number;
  lastRepetition: Date | null;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'new' | 'learning' | 'learned';
}

const mockWords: MockWord[] = [
  {
    word: 'hello',
    translations: [{ translation: 'привет' }],
    repetitions: 5,
    lastRepetition: new Date(),
    difficulty: 'easy',
    status: 'learned',
  },
  {
    word: 'world',
    translations: [{ translation: 'мир' }],
    repetitions: 3,
    lastRepetition: new Date(),
    difficulty: 'medium',
    status: 'learning',
  },
  {
    word: 'book',
    translations: [{ translation: 'книга' }],
    repetitions: 0,
    lastRepetition: new Date(),
    difficulty: 'medium',
    status: 'new',
  },
  {
    word: 'learn',
    translations: [{ translation: 'учить' }],
    repetitions: 2,
    lastRepetition: new Date(),
    difficulty: 'hard',
    status: 'learning',
  },
  {
    word: 'language',
    translations: [{ translation: 'язык' }],
    repetitions: 7,
    lastRepetition: new Date(),
    difficulty: 'easy',
    status: 'learned',
  },
  {
    word: 'dictionary',
    translations: [{ translation: 'словарь' }],
    repetitions: 4,
    lastRepetition: new Date(),
    difficulty: 'medium',
    status: 'learning',
  },
  {
    word: 'study',
    translations: [{ translation: 'изучать' }],
    repetitions: 1,
    lastRepetition: new Date(),
    difficulty: 'hard',
    status: 'learning',
  },
  {
    word: 'practice',
    translations: [{ translation: 'практика' }],
    repetitions: 6,
    lastRepetition: new Date(),
    difficulty: 'medium',
    status: 'learned',
  },
  {
    word: 'vocabulary',
    translations: [{ translation: 'словарный запас' }],
    repetitions: 5,
    lastRepetition: new Date(),
    difficulty: 'medium',
    status: 'learning',
  },
  {
    word: 'fluent',
    translations: [{ translation: 'беглый' }],
    repetitions: 8,
    lastRepetition: new Date(Date.now() - 21600000),
    difficulty: 'easy',
    status: 'learned',
  },
];

const mockFrequencyWords: WordFrequencyItem[] = [
  {
    word: 'the',
    count: 156,
  },
  {
    word: 'to',
    count: 124,
  },
  {
    word: 'and',
    count: 118,
  },
  {
    word: 'of',
    count: 106,
  },
  {
    word: 'in',
    count: 92,
  },
  {
    word: 'a',
    count: 90,
  },
  {
    word: 'is',
    count: 82,
  },
  {
    word: 'that',
    count: 76,
  },
  {
    word: 'for',
    count: 74,
  },
  {
    word: 'it',
    count: 70,
  },
  {
    word: 'with',
    count: 68,
  },
  {
    word: 'as',
    count: 65,
  },
  {
    word: 'on',
    count: 60,
  },
  {
    word: 'be',
    count: 58,
  },
  {
    word: 'this',
    count: 55,
  },
];

class MockDictionaryService {
  private words: MockWord[] = [...mockWords];
  private frequencyWords: WordFrequencyItem[] = [...mockFrequencyWords];

  async getWordsWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<DictionaryWord>> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const sortedWords = [...this.words].sort((a, b) => {
      if (!a.lastRepetition) return 1;
      if (!b.lastRepetition) return -1;
      return b.lastRepetition.getTime() - a.lastRepetition.getTime();
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = sortedWords.slice(startIndex, endIndex);
    const pages_count = Math.ceil(this.words.length / pageSize);

    const dictionaryWords = paginatedItems.map((word) => ({
      word: word.word,
      translations: word.translations,
      progress: word.repetitions || 0,
      isReadyToRepeat: word.status === 'learned' || false,
    }));

    return {
      items: dictionaryWords,
      total: this.words.length,
      page,
      pageSize,
      totalPages: pages_count,
    };
  }

  async getWordInfo(word: string): Promise<{
    word: string;
    translations: Translation[];
  } | null> {
    await delay(200);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const foundWord = this.words.find((w) => w.word === word);
    if (!foundWord) {
      return null;
    }
    return {
      word: foundWord.word,
      translations: foundWord.translations,
    };
  }

  async getWord(word: string): Promise<{
    word: string;
    translations: Translation[];
  }> {
    await delay(200);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

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

  async getWordFrequency(
    page: number = 1,
    pageSize: number = 10
  ): Promise<WordFrequencyItem[]> {
    await delay(400);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.frequencyWords.slice(startIndex, endIndex);
  }

  async addWord(word: string): Promise<DictionaryWord> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const existingWordInfo = await this.getWordInfo(word);
    const newWord: MockWord = {
      word,
      translations: existingWordInfo?.translations || [],
      repetitions: 0,
      lastRepetition: new Date(),
      difficulty: 'medium',
      status: 'new',
    };

    this.words.push(newWord);

    return {
      word: newWord.word,
      translations: newWord.translations,
      progress: newWord.repetitions,
      isReadyToRepeat: false,
    };
  }

  async deleteWord(word: string): Promise<void> {
    await delay(200);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    this.words = this.words.filter((w) => w.word !== word);
  }

  async export(): Promise<Blob> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const wordData = JSON.stringify(this.words);
    return new Blob([wordData], { type: 'application/json' });
  }

  async import(file: File): Promise<void> {
    await delay(800);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    this.words = [...mockWords, ...this.words];
  }
}

export const mockDictionaryService = new MockDictionaryService();
