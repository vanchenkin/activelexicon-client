import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

let mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    text: 'Привет! Я AI-помощник для изучения английского языка. Чем я могу помочь?',
    isUser: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const mockAIResponses: Record<string, string[]> = {
  default: [
    'Интересный вопрос! Давайте разберемся.',
    'Я могу помочь вам с этим.',
    'Хороший вопрос! Вот что я знаю по этой теме.',
  ],
  greeting: [
    'Привет! Как у вас дела с изучением английского?',
    'Здравствуйте! Чем я могу помочь сегодня?',
    'Добрый день! Готов помочь с английским языком.',
  ],
  translation: [
    'Вот перевод этого слова: ',
    'На русском это означает: ',
    'Это слово переводится как: ',
  ],
};

export const mockChatService = {
  async getChatHistory(): Promise<ChatMessage[]> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return [...mockChatHistory];
  },

  async sendMessage(text: string): Promise<ChatMessage[]> {
    await delay(800);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    mockChatHistory.push(userMessage);

    await delay(2000);

    let responseType = 'default';
    if (
      text.toLowerCase().match(/привет|здравствуй|добрый день|добрый вечер/)
    ) {
      responseType = 'greeting';
    } else if (text.toLowerCase().match(/перевод|перевести|как будет/)) {
      responseType = 'translation';
    }

    const responses = mockAIResponses[responseType];
    const responseText =
      responses[Math.floor(Math.random() * responses.length)];

    let fullResponse = responseText;
    if (responseType === 'translation') {
      const words = text.split(' ').filter((w) => w.length > 3);
      if (words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        fullResponse += `"${randomWord}" - mock translation`;
      }
    }

    const aiMessage: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      text: fullResponse,
      isUser: false,
      timestamp: new Date(),
    };

    mockChatHistory.push(aiMessage);

    return [...mockChatHistory];
  },

  async clearHistory(): Promise<boolean> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    mockChatHistory = mockChatHistory.slice(0, 1);
    return true;
  },
};
