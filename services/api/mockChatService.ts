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
    text: 'Hello! I am AI-assistant for learning English. How can I help you?',
    isUser: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const mockAIResponses: Record<string, string[]> = {
  default: [
    "Interesting question! Let's figure it out.",
    'I can help you with this.',
    "Good question! Here's what I know about this topic.",
  ],
  greeting: [
    'Hello! How are you doing with English learning?',
    "Good day! I'm ready to help with English.",
  ],
  translation: [
    'Here is the translation of this word: ',
    'In Russian, it means: ',
    'This word translates as: ',
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
    if (text.toLowerCase().match(/hello|hi|good day|good evening/)) {
      responseType = 'greeting';
    } else if (text.toLowerCase().match(/translation|translate|how to say/)) {
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
