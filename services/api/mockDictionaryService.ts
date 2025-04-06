import { Word, WordFrequency, PaginatedResult } from './dictionaryService';
import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockWords: Word[] = [
  {
    id: '1',
    word: 'hello',
    translation: 'привет',
    repetitions: 5,
    lastRepetition: new Date(Date.now() - 86400000),
    difficulty: 'easy',
    status: 'learned',
  },
  {
    id: '2',
    word: 'world',
    translation: 'мир',
    repetitions: 3,
    lastRepetition: new Date(Date.now() - 172800000),
    difficulty: 'medium',
    status: 'learning',
  },
];

const mockFrequencyWords: WordFrequency[] = [
  {
    id: '1',
    word: 'the',
    translation: 'определенный артикль',
    frequency: 156,
    lastUsed: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    word: 'to',
    translation: 'к, в, по направлению',
    frequency: 124,
    lastUsed: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    word: 'and',
    translation: 'и',
    frequency: 118,
    lastUsed: new Date(Date.now() - 259200000),
  },
  {
    id: '4',
    word: 'of',
    translation: 'из, о',
    frequency: 106,
    lastUsed: new Date(Date.now() - 345600000),
  },
  {
    id: '5',
    word: 'in',
    translation: 'в, внутри',
    frequency: 92,
    lastUsed: new Date(Date.now() - 432000000),
  },
  {
    id: '6',
    word: 'a',
    translation: 'неопределенный артикль',
    frequency: 90,
    lastUsed: new Date(Date.now() - 518400000),
  },
  {
    id: '7',
    word: 'is',
    translation: 'есть, является',
    frequency: 82,
    lastUsed: new Date(Date.now() - 604800000),
  },
  {
    id: '8',
    word: 'that',
    translation: 'что, тот',
    frequency: 76,
    lastUsed: new Date(Date.now() - 691200000),
  },
  {
    id: '9',
    word: 'for',
    translation: 'для, за',
    frequency: 74,
    lastUsed: new Date(Date.now() - 777600000),
  },
  {
    id: '10',
    word: 'it',
    translation: 'это, оно',
    frequency: 70,
    lastUsed: new Date(Date.now() - 864000000),
  },
  {
    id: '11',
    word: 'with',
    translation: 'с, вместе с',
    frequency: 68,
    lastUsed: new Date(Date.now() - 950400000),
  },
  {
    id: '12',
    word: 'as',
    translation: 'как, в качестве',
    frequency: 65,
    lastUsed: new Date(Date.now() - 1036800000),
  },
  {
    id: '13',
    word: 'on',
    translation: 'на, по',
    frequency: 60,
    lastUsed: new Date(Date.now() - 1123200000),
  },
  {
    id: '14',
    word: 'be',
    translation: 'быть',
    frequency: 58,
    lastUsed: new Date(Date.now() - 1209600000),
  },
  {
    id: '15',
    word: 'this',
    translation: 'это, этот',
    frequency: 55,
    lastUsed: new Date(Date.now() - 1296000000),
  },
];

class MockDictionaryService {
  private words: Word[] = [...mockWords];
  private frequencyWords: WordFrequency[] = [...mockFrequencyWords];

  async getWords(): Promise<Word[]> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return this.words;
  }

  async getWordsWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Word>> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = this.words.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: this.words.length,
      page,
      pageSize,
      totalPages: Math.ceil(this.words.length / pageSize),
    };
  }

  async getWord(word: string): Promise<Word | null> {
    await delay(200);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const foundWord = this.words.find((w) => w.word === word);
    return foundWord || null;
  }

  async getWordFrequency(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<WordFrequency>> {
    await delay(400);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = this.frequencyWords.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: this.frequencyWords.length,
      page,
      pageSize,
      totalPages: Math.ceil(this.frequencyWords.length / pageSize),
    };
  }

  async addWord(word: string, translation: string): Promise<Word> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const newWord: Word = {
      id: Date.now().toString(),
      word,
      translation,
      repetitions: 0,
      lastRepetition: null,
      difficulty: 'medium',
      status: 'new',
    };

    this.words.push(newWord);
    return newWord;
  }

  async updateWord(id: string, updates: Partial<Word>): Promise<Word> {
    await delay(200);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const index = this.words.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('Word not found');

    this.words[index] = { ...this.words[index], ...updates };
    return this.words[index];
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
