// Mock Vocabulary Service
import { Word, UserStats } from './vocabularyService';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial mock data
const mockVocabularyWords: Word[] = [
  {
    id: '1',
    word: 'hello',
    translation: 'привет',
    examples: ['Hello, how are you?', 'Hello world!'],
    learned: true,
  },
  {
    id: '2',
    word: 'goodbye',
    translation: 'до свидания',
    examples: ['Goodbye, see you tomorrow!', 'He said goodbye and left.'],
    learned: false,
  },
  {
    id: '3',
    word: 'book',
    translation: 'книга',
    examples: ['I read a book yesterday.', 'This book is interesting.'],
    learned: false,
  },
  {
    id: '4',
    word: 'water',
    translation: 'вода',
    examples: ['I need a glass of water.', 'The water is cold.'],
    learned: true,
  },
  {
    id: '5',
    word: 'food',
    translation: 'еда',
    examples: ['The food was delicious.', 'I need to buy some food.'],
    learned: false,
  },
];

// Mock user statistics
const mockUserStats: UserStats = {
  wordsLearned: 2,
  totalWords: 5,
  streak: 3,
  lastActive: new Date().toISOString(),
};

class MockVocabularyService {
  // Get all words
  async getWords(): Promise<Word[]> {
    await delay(600);
    return [...mockVocabularyWords];
  }

  // Get a single word by ID
  async getWord(id: string): Promise<Word> {
    await delay(400);

    const word = mockVocabularyWords.find((w) => w.id === id);

    if (!word) {
      throw new Error(`Word with ID ${id} not found`);
    }

    return { ...word };
  }

  // Mark a word as learned/unlearned
  async toggleWordLearned(id: string): Promise<Word> {
    await delay(500);

    const wordIndex = mockVocabularyWords.findIndex((w) => w.id === id);

    if (wordIndex === -1) {
      throw new Error(`Word with ID ${id} not found`);
    }

    const updatedWord = {
      ...mockVocabularyWords[wordIndex],
      learned: !mockVocabularyWords[wordIndex].learned,
    };

    // Update the mock data
    mockVocabularyWords[wordIndex] = updatedWord;

    // Update mock stats if needed
    if (updatedWord.learned) {
      mockUserStats.wordsLearned += 1;
    } else {
      mockUserStats.wordsLearned -= 1;
    }

    // Update last active date
    mockUserStats.lastActive = new Date().toISOString();

    return { ...updatedWord };
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    await delay(400);

    // Ensure stats are accurate based on current data
    mockUserStats.wordsLearned = mockVocabularyWords.filter(
      (w) => w.learned
    ).length;
    mockUserStats.totalWords = mockVocabularyWords.length;

    return { ...mockUserStats };
  }
}

export const mockVocabularyService = new MockVocabularyService();
