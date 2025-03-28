import { ApiService } from './api';

export type ExerciseType = 'make-text' | 'question-answer' | 'fill-word';

export interface Exercise {
  id: string;
  type: ExerciseType;
  text: string;
  options?: string[];
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

  async getNextExercise(): Promise<Exercise | null> {
    return this.api.get<Exercise | null>('/tasks/next');
  }

  async submitAnswer(exerciseId: string, answer: string): Promise<boolean> {
    const response = await this.api.post<{ isCorrect: boolean }>(
      '/tasks/check',
      {
        exerciseId,
        answer,
      }
    );

    return response.isCorrect;
  }

  async getUserProgress(): Promise<UserProgress> {
    const response = await this.api.get<UserProgress>('/tasks/progress');

    return {
      ...response,
      lastCompletedDate: response.lastCompletedDate
        ? new Date(response.lastCompletedDate)
        : null,
    };
  }

  async resetProgress(): Promise<void> {
    await this.api.post('/tasks/reset');
  }
}

export const exerciseService = new ExerciseService();
