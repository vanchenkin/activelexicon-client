import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Topic {
  name: string;
  icon: string;
}

const mockTopics: Topic[] = [
  { name: 'Science', icon: 'flask-outline' },
  { name: 'Technology', icon: 'hardware-chip-outline' },
  { name: 'Business', icon: 'briefcase-outline' },
  { name: 'Health', icon: 'fitness-outline' },
  { name: 'Art', icon: 'color-palette-outline' },
  { name: 'Sport', icon: 'football-outline' },
  { name: 'Travel', icon: 'airplane-outline' },
  { name: 'Food', icon: 'restaurant-outline' },
  { name: 'Music', icon: 'musical-notes-outline' },
  { name: 'Cinema', icon: 'film-outline' },
];

export const mockTopicsService = {
  async getTopics(): Promise<Topic[]> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return mockTopics;
  },
};
