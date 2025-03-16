import { Word, UserStats } from './wordsService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockWords: Word[] = [
  {
    word: 'hello',
    translation: 'привет',
    examples: ['Hello, how are you?', 'Hello world!'],
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    word: 'goodbye',
    translation: 'до свидания',
    examples: ['Goodbye, see you tomorrow!', 'He said goodbye and left.'],
    addedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    word: 'book',
    translation: 'книга',
    examples: ['I read a book yesterday.', 'This book is interesting.'],
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    word: 'water',
    translation: 'вода',
    examples: ['I need a glass of water.', 'The water is cold.'],
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
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

  async getWord(word: string): Promise<Word> {
    await delay(400);

    const foundWord = mockWords.find((w) => w.word === word);

    if (!foundWord) {
      throw new Error(`Word not found: ${word}`);
    }

    return foundWord;
  }

  async addWord(word: string, translation: string): Promise<Word> {
    await delay(500);

    const newWord: Word = {
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

  async deleteWord(word: string): Promise<boolean> {
    const initialLength = mockWords.length;
    const wordToDelete = mockWords.find((w) => w.word === word);

    const updatedMockWords = mockWords.filter((w) => w.word !== word);
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
