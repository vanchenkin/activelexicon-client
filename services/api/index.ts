import { mockAuthService } from './mockAuthService';
import { realAuthService } from './authService';
import { dictionaryService } from './dictionaryService';
import { chatService } from './chatService';
import { tasksService } from './tasksService';
import { topicsService } from './topicsService';
import { exploreService } from './exploreService';
import { notificationService } from '../notificationService';
import { setRefreshTokenFunction } from './api';
import { profileService } from './profileService';
import { mockProfileService } from './mockProfileService';

import { mockDictionaryService } from './mockDictionaryService';
import { mockChatService } from './mockChatService';
import { mockTasksService } from './mockTasksService';
import { mockTopicsService } from './mockTopicsService';
import { mockExploreService } from './mockExploreService';

export const USE_REAL_BACKEND = true;

export const authService = USE_REAL_BACKEND ? realAuthService : mockAuthService;

export const profileServiceInstance = USE_REAL_BACKEND
  ? profileService
  : mockProfileService;

export const dictionaryServiceInstance = USE_REAL_BACKEND
  ? dictionaryService
  : mockDictionaryService;

export const chatServiceInstance = USE_REAL_BACKEND
  ? chatService
  : mockChatService;

export const tasksServiceInstance = USE_REAL_BACKEND
  ? tasksService
  : mockTasksService;

export const topicsServiceInstance = USE_REAL_BACKEND
  ? topicsService
  : mockTopicsService;

export const exploreServiceInstance = USE_REAL_BACKEND
  ? exploreService
  : mockExploreService;

setRefreshTokenFunction(async (refreshToken: string) => {
  return authService.refreshToken(refreshToken);
});

export type { User, AuthResponse } from './authService';
export type { ProfileUpdateResponse, StatsData } from './profileService';
export type {
  DictionaryWord,
  WordFrequencyItem,
  Translation,
} from './dictionaryService';
export type { ChatMessage } from './chatService';
export { Exercise, ExerciseType } from './tasksService';
export type { Topic } from './topicsService';

export { notificationService };
