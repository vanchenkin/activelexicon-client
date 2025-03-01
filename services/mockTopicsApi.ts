// Mock API service for topics
import { mockAuthService } from './mockAuth';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Types
export interface Topic {
  id: string;
  name: string;
  icon: string;
}

// Mock data
const mockTopics: Topic[] = [
  { id: '1', name: 'Наука', icon: 'flask-outline' },
  { id: '2', name: 'Технологии', icon: 'hardware-chip-outline' },
  { id: '3', name: 'Бизнес', icon: 'briefcase-outline' },
  { id: '4', name: 'Здоровье', icon: 'fitness-outline' },
  { id: '5', name: 'Искусство', icon: 'color-palette-outline' },
  { id: '6', name: 'Спорт', icon: 'football-outline' },
  { id: '7', name: 'Путешествия', icon: 'airplane-outline' },
  { id: '8', name: 'Еда', icon: 'restaurant-outline' },
  { id: '9', name: 'Музыка', icon: 'musical-notes-outline' },
  { id: '10', name: 'Кино', icon: 'film-outline' },
];

// API methods
export const mockTopicsApi = {
  // Get all topics
  async getTopics(): Promise<Topic[]> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return mockTopics;
  },

  // Search topics
  async searchTopics(query: string): Promise<Topic[]> {
    await delay(400);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    if (!query) return mockTopics;

    return mockTopics.filter((topic) =>
      topic.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Generate text based on topic
  async generateText(
    topicId: string | null,
    customTopic: string | null,
    complexity: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<string> {
    await delay(1500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    let topic = 'general';

    if (topicId) {
      const selectedTopic = mockTopics.find((t) => t.id === topicId);
      if (selectedTopic) {
        topic = selectedTopic.name;
      }
    } else if (customTopic) {
      topic = customTopic;
    }

    let complexityText = '';
    switch (complexity) {
      case 'easy':
        complexityText = 'simple vocabulary and basic grammar';
        break;
      case 'medium':
        complexityText = 'moderate vocabulary and intermediate grammar';
        break;
      case 'hard':
        complexityText = 'advanced vocabulary and complex grammar';
        break;
    }

    return `This is a generated text about ${topic} with ${complexityText}. It contains several paragraphs of content that would be useful for learning new vocabulary. The text would typically be much longer and contain various words and phrases related to the selected topic.`;
  },
};
