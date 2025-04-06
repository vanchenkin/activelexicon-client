import { mockAuthService } from './mockAuthService';
import { realAuthService } from './authService';
import { wordsService } from './wordsService';
import { chatService } from './chatService';
import { exerciseService } from './exerciseService';
import { topicsService } from './topicsService';
import { notificationService } from '../notificationService';
import { statsService } from './statsService';
import { setRefreshTokenFunction } from './api';

import { mockWordsService } from './mockWordsService';
import { mockChatService } from './mockChatService';
import { mockExerciseService } from './mockExerciseService';
import { mockTopicsService } from './mockTopicsService';
import { mockStatsService } from './mockStatsService';

export const USE_REAL_BACKEND = false;

export const authService = USE_REAL_BACKEND ? realAuthService : mockAuthService;

export const wordsServiceInstance = USE_REAL_BACKEND
  ? wordsService
  : mockWordsService;

export const chatServiceInstance = USE_REAL_BACKEND
  ? chatService
  : mockChatService;

export const exerciseServiceInstance = USE_REAL_BACKEND
  ? exerciseService
  : mockExerciseService;

export const topicsServiceInstance = USE_REAL_BACKEND
  ? topicsService
  : mockTopicsService;

export const statsServiceInstance = USE_REAL_BACKEND
  ? statsService
  : mockStatsService;

setRefreshTokenFunction(async (refreshToken: string) => {
  return authService.refreshToken(refreshToken);
});

export type { User } from './authService';
export type { Word, UserStats } from './wordsService';
export type { ChatMessage } from './chatService';
export type { Exercise, ExerciseType, UserProgress } from './exerciseService';
export type { Topic } from './topicsService';
export type { StatsData, UserStreak } from './statsService';

export { notificationService };
