import { mockAuthService } from './mockAuthService';
import { realAuthService } from './authService';
import { wordsService } from './wordsService';
import { chatService } from './chatService';
import { exerciseService } from './exerciseService';
import { translationService } from './translationService';
import { topicsService } from './topicsService';
import { notificationService } from './notificationService';
import { setRefreshTokenFunction } from './api';

import { mockWordsService } from './mockWordsService';
import { mockChatService } from './mockChatService';
import { mockExerciseService } from './mockExerciseService';
import { mockTranslationService } from './mockTranslationService';
import { mockTopicsService } from './mockTopicsService';

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

export const translationServiceInstance = USE_REAL_BACKEND
  ? translationService
  : mockTranslationService;

export const topicsServiceInstance = USE_REAL_BACKEND
  ? topicsService
  : mockTopicsService;

setRefreshTokenFunction(async (refreshToken: string) => {
  return authService.refreshToken(refreshToken);
});

export type { User } from './authService';
export type { Word, UserStats } from './wordsService';
export type { ChatMessage } from './chatService';
export type { Exercise, ExerciseType, UserProgress } from './exerciseService';
export type { WordDetails } from './translationService';
export type { Topic } from './topicsService';

export { notificationService };
