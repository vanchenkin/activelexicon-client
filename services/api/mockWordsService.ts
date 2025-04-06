import { Word, UserStats } from './wordsService';
import wordsData from '../../words.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockWords: Word[] = wordsData.map((word) => ({
  ...word,
  addedAt: new Date(word.addedAt),
}));

const userWords = [mockWords[0], mockWords[1]];

const mockUserStats: UserStats = {
  learnedWords: 2,
  totalWords: 5,
  learningStreak: 3,
  lastActiveDate: new Date(),
};

class MockWordsService {
  async getWords(): Promise<Word[]> {
    await delay(600);
    return userWords;
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

    userWords.unshift(newWord);

    mockUserStats.totalWords += 1;
    mockUserStats.lastActiveDate = new Date();

    return { ...newWord };
  }

  async deleteWord(word: string): Promise<boolean> {
    const initialLength = userWords.length;
    const wordToDelete = userWords.find((w) => w.word === word);

    const updatedMockWords = userWords.filter((w) => w.word !== word);
    userWords.length = 0;
    userWords.push(...updatedMockWords);

    if (wordToDelete) {
      mockUserStats.totalWords -= 1;
    }

    return userWords.length < initialLength;
  }

  async getUserStats(): Promise<UserStats> {
    await delay(400);

    mockUserStats.learnedWords = 0;
    mockUserStats.totalWords = userWords.length;

    return { ...mockUserStats };
  }
}

export const mockWordsService = new MockWordsService();
