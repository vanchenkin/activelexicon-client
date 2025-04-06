import { mockAuthService } from './mockAuthService';
import { mockTopicsService } from './mockTopicsService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockExploreService = {
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
      const topics = await mockTopicsService.getTopics();
      const selectedTopic = topics.find((t) => t.id === topicId);
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
