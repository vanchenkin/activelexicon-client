// Mock Chat Service
import { mockAuthService } from './mockAuth';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Initial message history
let mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    text: 'Привет! Я AI-помощник для изучения английского языка. Чем я могу помочь?',
    isUser: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Mock AI responses based on input
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
  // Get chat history
  async getChatHistory(): Promise<ChatMessage[]> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return [...mockChatHistory];
  },

  // Send message and get AI response
  async sendMessage(text: string): Promise<ChatMessage[]> {
    await delay(800);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    // Add to history
    mockChatHistory.push(userMessage);

    // Generate AI response
    await delay(1000); // Additional delay to simulate AI thinking

    // Select response type based on message content
    let responseType = 'default';
    if (
      text.toLowerCase().match(/привет|здравствуй|добрый день|добрый вечер/)
    ) {
      responseType = 'greeting';
    } else if (text.toLowerCase().match(/перевод|перевести|как будет/)) {
      responseType = 'translation';
    }

    // Get random response from selected type
    const responses = mockAIResponses[responseType];
    const responseText =
      responses[Math.floor(Math.random() * responses.length)];

    // For translation requests, add a mock translation
    let fullResponse = responseText;
    if (responseType === 'translation') {
      // Extract potential word to translate
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

    // Add to history
    mockChatHistory.push(aiMessage);

    return [...mockChatHistory];
  },

  // Clear chat history
  async clearHistory(): Promise<boolean> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    // Keep the initial welcome message
    mockChatHistory = mockChatHistory.slice(0, 1);
    return true;
  },
};
