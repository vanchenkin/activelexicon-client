// Mock Translation Service
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface WordDetails {
  word: string;
  translation: string;
  partOfSpeech: string;
  gender?: string;
  example: string;
}

// Mock translations database
const mockTranslations: Record<string, WordDetails> = {
  desktop: {
    word: 'desktop',
    translation: 'рабочий стол',
    partOfSpeech: 'существительное',
    gender: 'муж. род',
    example: 'Я сохранил файл на рабочем столе.',
  },
  printing: {
    word: 'printing',
    translation: 'печать',
    partOfSpeech: 'существительное',
    gender: 'жен. род',
    example: 'Печать документов может занять некоторое время.',
  },
  industry: {
    word: 'industry',
    translation: 'промышленность',
    partOfSpeech: 'существительное',
    gender: 'жен. род',
    example: 'Автомобильная промышленность играет важную роль в экономике.',
  },
  electronic: {
    word: 'electronic',
    translation: 'электронный',
    partOfSpeech: 'прилагательное',
    example: 'Мне нужно проверить мою электронную почту.',
  },
  specimen: {
    word: 'specimen',
    translation: 'образец',
    partOfSpeech: 'существительное',
    gender: 'муж. род',
    example: 'Учёные изучают образец новой ткани.',
  },
  publishing: {
    word: 'publishing',
    translation: 'издательство',
    partOfSpeech: 'существительное',
    gender: 'ср. род',
    example: 'Это издательство выпускает множество научных журналов.',
  },
  software: {
    word: 'software',
    translation: 'программное обеспечение',
    partOfSpeech: 'существительное',
    gender: 'ср. род',
    example: 'Мне нужно обновить программное обеспечение на моем компьютере.',
  },
};

// Default response for words not in our database
const defaultWordDetails: Omit<WordDetails, 'word'> = {
  translation: 'перевод недоступен',
  partOfSpeech: 'часть речи не определена',
  example: 'Пример предложения отсутствует.',
};

export const mockTranslationService = {
  async getWordDetails(word: string): Promise<WordDetails> {
    // Simulate network delay
    await delay(500);

    const lowercaseWord = word.toLowerCase();

    if (mockTranslations[lowercaseWord]) {
      return mockTranslations[lowercaseWord];
    }

    // Return default data for unknown words
    return {
      word: word,
      ...defaultWordDetails,
    };
  },

  async addWordToVocabulary(word: string): Promise<boolean> {
    // Simulate network delay
    await delay(300);

    // Mock always successful
    return true;
  },
};
