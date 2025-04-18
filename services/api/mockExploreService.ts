import { mockAuthService } from './mockAuthService';
import { mockTopicsService } from './mockTopicsService';
import { Complexity } from '@/types/common';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockExploreService = {
  async generateText(
    topicName: string | null = 'general',
    complexity: Complexity = 'normal'
  ): Promise<string> {
    await delay(1500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    let complexityText = '';
    switch (complexity) {
      case 'low':
        complexityText = 'simple vocabulary and basic grammar';
        break;
      case 'normal':
        complexityText = 'moderate vocabulary and intermediate grammar';
        break;
      case 'high':
        complexityText = 'advanced vocabulary and complex grammar';
        break;
    }

    return `This is a generated text about ${topicName} with ${complexityText}. It contains several paragraphs of content language that would be useful for learning new vocabulary. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic. The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.The text would typically be much longer and contain various words and phrases related to the selected topic.`;
  },
};
