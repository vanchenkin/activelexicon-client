import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Topic {
  name: string;
  icon: string;
}

const mockTopics: Topic[] = [
  { name: 'Science', icon: 'icon_flask-outline' },
  { name: 'Technology', icon: 'icon_hardware-chip-outline' },
  { name: 'Business', icon: 'icon_briefcase-outline' },
  { name: 'Health', icon: 'icon_fitness-outline' },
  { name: 'Art', icon: 'icon_color-palette-outline' },
  { name: 'Sport', icon: 'icon_football-outline' },
  { name: 'Travel', icon: 'icon_airplane-outline' },
  { name: 'Food', icon: 'icon_restaurant-outline' },
  { name: 'Music', icon: 'icon_musical-notes-outline' },
  { name: 'Cinema', icon: 'icon_film-outline' },
];

export const mockTopicsService = {
  async getTopics(): Promise<Topic[]> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    return mockTopics;
  },
};
