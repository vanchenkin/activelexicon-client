// Mock Words Service
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserWord {
  id: string;
  word: string;
  translation: string;
  isLearned: boolean;
  addedAt: Date;
}

// Initial mock data - set to empty array for empty state testing
let mockWords: UserWord[] = []; // Set to empty array to test the empty state

export interface UserStats {
  totalWords: number;
  learnedWords: number;
  learningStreak: number;
  lastLearnedDate: Date | null;
}

export const mockWordsService = {
  async getUserWords(): Promise<UserWord[]> {
    await delay(600);
    return [...mockWords];
  },

  async searchUserWords(query: string): Promise<UserWord[]> {
    await delay(300);

    if (!query) return [...mockWords];

    return mockWords.filter(
      (word) =>
        word.word.toLowerCase().includes(query.toLowerCase()) ||
        word.translation.toLowerCase().includes(query.toLowerCase())
    );
  },

  async addWord(word: string, translation: string): Promise<UserWord> {
    await delay(500);

    const newWord: UserWord = {
      id: `word-${Date.now()}`,
      word,
      translation,
      isLearned: false,
      addedAt: new Date(),
    };

    mockWords = [newWord, ...mockWords];
    return newWord;
  },

  async deleteWord(wordId: string): Promise<boolean> {
    await delay(300);

    const initialLength = mockWords.length;
    mockWords = mockWords.filter((word) => word.id !== wordId);

    return mockWords.length < initialLength;
  },

  async getUserStats(): Promise<UserStats> {
    await delay(400);

    const totalWords = mockWords.length;
    const learnedWords = mockWords.filter((word) => word.isLearned).length;

    const learnedWordsByDate = mockWords
      .filter((word) => word.isLearned)
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

    const lastLearnedDate =
      learnedWordsByDate.length > 0 ? learnedWordsByDate[0].addedAt : null;

    // Mock learning streak
    const learningStreak = Math.floor(Math.random() * 10) + 1;

    return {
      totalWords,
      learnedWords,
      learningStreak,
      lastLearnedDate,
    };
  },
};
