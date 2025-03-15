const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface WordDetails {
  word: string;
  translation: string;
  partOfSpeech: string;
  gender?: string;
  example: string;
  englishExample?: string;
}

const mockTranslations: Record<string, WordDetails> = {
  desktop: {
    word: 'desktop',
    translation: 'рабочий стол',
    partOfSpeech: 'существительное',
    gender: 'муж. род',
    example: 'Я сохранил файл на рабочем столе.',
    englishExample: 'I saved the file on the desktop.',
  },
  printing: {
    word: 'printing',
    translation: 'печать',
    partOfSpeech: 'существительное',
    gender: 'жен. род',
    example: 'Печать документов может занять некоторое время.',
    englishExample: 'Printing documents may take some time.',
  },
  industry: {
    word: 'industry',
    translation: 'промышленность',
    partOfSpeech: 'существительное',
    gender: 'жен. род',
    example: 'Автомобильная промышленность играет важную роль в экономике.',
    englishExample:
      'The automotive industry plays an important role in the economy.',
  },
  electronic: {
    word: 'electronic',
    translation: 'электронный',
    partOfSpeech: 'прилагательное',
    example: 'Мне нужно проверить мою электронную почту.',
    englishExample: 'I need to check my electronic mail.',
  },
  specimen: {
    word: 'specimen',
    translation: 'образец',
    partOfSpeech: 'существительное',
    gender: 'муж. род',
    example: 'Учёные изучают образец новой ткани.',
    englishExample: 'Scientists are studying a specimen of the new fabric.',
  },
  publishing: {
    word: 'publishing',
    translation: 'издательство',
    partOfSpeech: 'существительное',
    gender: 'ср. род',
    example: 'Это издательство выпускает множество научных журналов.',
    englishExample: 'This publishing house produces many scientific journals.',
  },
  software: {
    word: 'software',
    translation: 'программное обеспечение',
    partOfSpeech: 'существительное',
    gender: 'ср. род',
    example: 'Мне нужно обновить программное обеспечение на моем компьютере.',
    englishExample: 'I need to update the software on my computer.',
  },
};

const defaultWordDetails: Omit<WordDetails, 'word'> = {
  translation: 'перевод недоступен',
  partOfSpeech: 'часть речи не определена',
  example: 'Пример предложения отсутствует.',
  englishExample: 'Example sentence not available.',
};

export const mockTranslationService = {
  async getWordDetails(word: string): Promise<WordDetails> {
    await delay(500);

    const lowercaseWord = word.toLowerCase();

    if (mockTranslations[lowercaseWord]) {
      return mockTranslations[lowercaseWord];
    }

    return {
      word: word,
      ...defaultWordDetails,
    };
  },
};
