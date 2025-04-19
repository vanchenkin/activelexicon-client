import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

let mockChatHistory: ChatMessage[] = [];

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
      text,
      isUser: true,
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
      text: fullResponse,
      isUser: false,
    };

    mockChatHistory.push(aiMessage);

    return [userMessage, aiMessage];
  },

  async clearHistory(): Promise<ChatMessage[]> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    mockChatHistory = mockChatHistory.slice(0, 1);
    return [...mockChatHistory];
  },

  async startNewChat(topic: string): Promise<ChatMessage[]> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    mockChatHistory = [];

    const welcomeMessage: ChatMessage = {
      text: `Let's chat about "${topic}"! What would you like to know?`,
      isUser: false,
    };

    mockChatHistory.push(welcomeMessage);

    return [...mockChatHistory];
  },

  async checkMessageCorrectness(text: string): Promise<{
    isCorrect: boolean;
    suggestions?: string[];
  }> {
    await delay(1500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const hasErrors =
      text.toLowerCase().includes('error') || Math.random() > 0.7;

    const suggestions = hasErrors
      ? [
          'Check your grammar',
          'Consider using different tense',
          'Revise word order',
        ]
      : undefined;

    return {
      isCorrect: !hasErrors,
      suggestions,
    };
  },
};
