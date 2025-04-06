import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Topic {
  id: string;
  name: string;
  icon: string;
}

const mockTopics: Topic[] = [
  { id: '1', name: 'Science', icon: 'flask-outline' },
  { id: '2', name: 'Technology', icon: 'hardware-chip-outline' },
  { id: '3', name: 'Business', icon: 'briefcase-outline' },
  { id: '4', name: 'Health', icon: 'fitness-outline' },
  { id: '5', name: 'Art', icon: 'color-palette-outline' },
  { id: '6', name: 'Sport', icon: 'football-outline' },
  { id: '7', name: 'Travel', icon: 'airplane-outline' },
  { id: '8', name: 'Food', icon: 'restaurant-outline' },
  { id: '9', name: 'Music', icon: 'musical-notes-outline' },
  { id: '10', name: 'Cinema', icon: 'film-outline' },
];

export const mockTopicsService = {
  async getTopics(): Promise<Topic[]> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return mockTopics;
  },

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

    return `This is a generated text about ${topic} with ${complexityText}. It contains several paragraphs of content that would be useful for learning new vocabulary. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.`;
  },
};
