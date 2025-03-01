// Mock API service with simulated network delays
import { mockAuthService } from './mockAuth';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface Word {
  id: string;
  word: string;
  translation: string;
  examples: string[];
  learned: boolean;
}

export interface UserStats {
  wordsLearned: number;
  totalWords: number;
  streak: number;
  lastActive: string;
}

// Mock data
const mockWords: Word[] = [
  {
    id: '1',
    word: 'apple',
    translation: 'яблоко',
    examples: ['I ate an apple for breakfast', 'The apple tree is in bloom'],
    learned: false
  },
  {
    id: '2',
    word: 'book',
    translation: 'книга',
    examples: ['I read a book yesterday', 'She wrote a book about her travels'],
    learned: true
  },
  {
    id: '3',
    word: 'computer',
    translation: 'компьютер',
    examples: ['I work on my computer every day', 'The computer is broken'],
    learned: false
  },
  {
    id: '4',
    word: 'house',
    translation: 'дом',
    examples: ['I live in a small house', 'They built a new house last year'],
    learned: false
  },
  {
    id: '5',
    word: 'car',
    translation: 'машина',
    examples: ['I drive a red car', 'The car is in the garage'],
    learned: true
  }
];

const mockUserStats: UserStats = {
  wordsLearned: 2,
  totalWords: 5,
  streak: 3,
  lastActive: new Date().toISOString()
};

// API methods
export const mockApi = {
  // Get all words
  async getWords(): Promise<Word[]> {
    await delay(800);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return mockWords;
  },

  // Get a single word by ID
  async getWord(id: string): Promise<Word> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const word = mockWords.find(w => w.id === id);
    if (!word) throw new Error('Word not found');
    
    return word;
  },

  // Mark a word as learned/unlearned
  async toggleWordLearned(id: string): Promise<Word> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const wordIndex = mockWords.findIndex(w => w.id === id);
    if (wordIndex === -1) throw new Error('Word not found');
    
    mockWords[wordIndex].learned = !mockWords[wordIndex].learned;
    return mockWords[wordIndex];
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    return {
      ...mockUserStats,
      wordsLearned: mockWords.filter(w => w.learned).length,
      totalWords: mockWords.length
    };
  }
}; 