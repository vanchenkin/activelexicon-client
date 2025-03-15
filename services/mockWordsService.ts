// Mock Words Service
import { Word, UserStats } from './wordsService';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial mock data
const mockWords: Word[] = [
  {
    id: '1',
    word: 'hello',
    translation: 'привет',
    examples: ['Hello, how are you?', 'Hello world!'],
    learned: true,
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '2',
    word: 'goodbye',
    translation: 'до свидания',
    examples: ['Goodbye, see you tomorrow!', 'He said goodbye and left.'],
    learned: false,
    addedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
  },
  {
    id: '3',
    word: 'book',
    translation: 'книга',
    examples: ['I read a book yesterday.', 'This book is interesting.'],
    learned: false,
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: '4',
    word: 'water',
    translation: 'вода',
    examples: ['I need a glass of water.', 'The water is cold.'],
    learned: true,
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: '5',
    word: 'food',
    translation: 'еда',
    examples: ['The food was delicious.', 'I need to buy some food.'],
    learned: false,
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
];

// Mock user statistics
const mockUserStats: UserStats = {
  learnedWords: 2,
  totalWords: 5,
  learningStreak: 3,
  lastActiveDate: new Date(),
};

class MockWordsService {
  // Get all words
  async getWords(): Promise<Word[]> {
    await delay(600);
    return [...mockWords];
  }

  // Get a single word by ID
  async getWord(id: string): Promise<Word> {
    await delay(400);

    const word = mockWords.find((w) => w.id === id);

    if (!word) {
      throw new Error(`Word with ID ${id} not found`);
    }

    return { ...word };
  }

  // Search words
  async searchWords(query: string): Promise<Word[]> {
    await delay(300);

    if (!query) return [...mockWords];

    return mockWords.filter(
      (word) =>
        word.word.toLowerCase().includes(query.toLowerCase()) ||
        word.translation.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Add a new word
  async addWord(word: string, translation: string): Promise<Word> {
    await delay(500);

    const newWord: Word = {
      id: `word-${Date.now()}`,
      word,
      translation,
      examples: [],
      learned: false,
      addedAt: new Date(),
    };

    mockWords.unshift(newWord);

    // Update mock stats
    mockUserStats.totalWords += 1;
    mockUserStats.lastActiveDate = new Date();

    return { ...newWord };
  }

  // Mark a word as learned/unlearned
  async toggleWordLearned(id: string): Promise<Word> {
    await delay(500);

    const wordIndex = mockWords.findIndex((w) => w.id === id);

    if (wordIndex === -1) {
      throw new Error(`Word with ID ${id} not found`);
    }

    const updatedWord = {
      ...mockWords[wordIndex],
      learned: !mockWords[wordIndex].learned,
    };

    // Update the mock data
    mockWords[wordIndex] = updatedWord;

    // Update mock stats if needed
    if (updatedWord.learned) {
      mockUserStats.learnedWords += 1;
    } else {
      mockUserStats.learnedWords -= 1;
    }

    // Update last active date
    mockUserStats.lastActiveDate = new Date();

    return { ...updatedWord };
  }

  // Delete a word
  async deleteWord(id: string): Promise<boolean> {
    await delay(300);

    const initialLength = mockWords.length;
    const wordToDelete = mockWords.find((w) => w.id === id);

    // Update the mock data array
    const updatedMockWords = mockWords.filter((word) => word.id !== id);
    mockWords.length = 0;
    mockWords.push(...updatedMockWords);

    // Update mock stats if needed
    if (wordToDelete) {
      mockUserStats.totalWords -= 1;
      if (wordToDelete.learned) {
        mockUserStats.learnedWords -= 1;
      }
    }

    return mockWords.length < initialLength;
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    await delay(400);

    // Ensure stats are accurate based on current data
    mockUserStats.learnedWords = mockWords.filter((w) => w.learned).length;
    mockUserStats.totalWords = mockWords.length;

    return { ...mockUserStats };
  }
}

export const mockWordsService = new MockWordsService();
