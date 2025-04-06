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
};
