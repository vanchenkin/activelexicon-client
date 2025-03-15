import { ApiService } from './api';

export type ExerciseType = 'fill-blank' | 'multiple-choice' | 'translate';

export interface Exercise {
  id: string;
  type: ExerciseType;
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  hint?: string;
}

export interface UserProgress {
  completedExercises: string[];
  currentExerciseIndex: number;
  streak: number;
  lastCompletedDate: Date | null;
}

class ExerciseService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Get all exercises
  async getExercises(): Promise<Exercise[]> {
    return this.api.get<Exercise[]>('/exercises');
  }

  // Get next exercise
  async getNextExercise(): Promise<Exercise | null> {
    return this.api.get<Exercise | null>('/exercises/next');
  }

  // Submit answer
  async submitAnswer(exerciseId: string, answer: string): Promise<boolean> {
    const response = await this.api.post<{ isCorrect: boolean }>(
      '/exercises/submit',
      {
        exerciseId,
        answer,
      }
    );

    return response.isCorrect;
  }

  // Get user progress
  async getUserProgress(): Promise<UserProgress> {
    const response = await this.api.get<UserProgress>('/exercises/progress');

    // Convert string date to Date object if it exists
    return {
      ...response,
      lastCompletedDate: response.lastCompletedDate
        ? new Date(response.lastCompletedDate)
        : null,
    };
  }

  // Reset progress
  async resetProgress(): Promise<void> {
    await this.api.post('/exercises/reset');
  }
}

export const exerciseService = new ExerciseService();
