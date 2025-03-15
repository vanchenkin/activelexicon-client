import { Word, UserStats } from './wordsService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockWords: Word[] = [
  {
    id: '1',
    word: 'hello',
    translation: 'привет',
    examples: ['Hello, how are you?', 'Hello world!'],
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    word: 'goodbye',
    translation: 'до свидания',
    examples: ['Goodbye, see you tomorrow!', 'He said goodbye and left.'],
    addedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    word: 'book',
    translation: 'книга',
    examples: ['I read a book yesterday.', 'This book is interesting.'],
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    word: 'water',
    translation: 'вода',
    examples: ['I need a glass of water.', 'The water is cold.'],
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    word: 'food',
    translation: 'еда',
    examples: ['The food was delicious.', 'I need to buy some food.'],
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const mockUserStats: UserStats = {
  learnedWords: 2,
  totalWords: 5,
  learningStreak: 3,
  lastActiveDate: new Date(),
};

class MockWordsService {
  async getWords(): Promise<Word[]> {
    await delay(600);
    return [...mockWords];
  }

  async getWord(id: string): Promise<Word> {
    await delay(400);

    const word = mockWords.find((w) => w.id === id);

    if (!word) {
      throw new Error(`Word with ID ${id} not found`);
    }

    return { ...word };
  }

  async searchWords(query: string): Promise<Word[]> {
    await delay(300);

    if (!query) return [...mockWords];

    return mockWords.filter(
      (word) =>
        word.word.toLowerCase().includes(query.toLowerCase()) ||
        word.translation.toLowerCase().includes(query.toLowerCase())
    );
  }

  async addWord(word: string, translation: string): Promise<Word> {
    await delay(500);

    const newWord: Word = {
      id: `word-${Date.now()}`,
      word,
      translation,
      examples: [],
      addedAt: new Date(),
    };

    mockWords.unshift(newWord);

    mockUserStats.totalWords += 1;
    mockUserStats.lastActiveDate = new Date();

    return { ...newWord };
  }

  async deleteWord(id: string): Promise<boolean> {
    await delay(300);

    const initialLength = mockWords.length;
    const wordToDelete = mockWords.find((w) => w.id === id);

    const updatedMockWords = mockWords.filter((word) => word.id !== id);
    mockWords.length = 0;
    mockWords.push(...updatedMockWords);

    if (wordToDelete) {
      mockUserStats.totalWords -= 1;
    }

    return mockWords.length < initialLength;
  }

  async getUserStats(): Promise<UserStats> {
    await delay(400);

    mockUserStats.learnedWords = 0;
    mockUserStats.totalWords = mockWords.length;

    return { ...mockUserStats };
  }

  async addWordToVocabulary(word: string): Promise<Word> {
    await delay(500);

    // Create a new word entry for the vocabulary using the provided word
    const newWord: Word = {
      id: `word-${Date.now()}`,
      word,
      translation: '', // Will be populated from backend in real implementation
      examples: [],
      addedAt: new Date(),
    };

    mockWords.unshift(newWord);
    mockUserStats.totalWords += 1;
    mockUserStats.lastActiveDate = new Date();

    return { ...newWord };
  }
}

export const mockWordsService = new MockWordsService();
