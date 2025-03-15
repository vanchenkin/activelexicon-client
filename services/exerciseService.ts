import { ApiService } from './api';

export type ExerciseType = 'fill-blank' | 'multiple-choice' | 'translate';

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

  async getExercises(): Promise<Exercise[]> {
    return this.api.get<Exercise[]>('/exercises');
  }

  async getNextExercise(): Promise<Exercise | null> {
    return this.api.get<Exercise | null>('/exercises/next');
  }

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

  async getUserProgress(): Promise<UserProgress> {
    const response = await this.api.get<UserProgress>('/exercises/progress');

    return {
      ...response,
      lastCompletedDate: response.lastCompletedDate
        ? new Date(response.lastCompletedDate)
        : null,
    };
  }

  async resetProgress(): Promise<void> {
    await this.api.post('/exercises/reset');
  }
}

export const exerciseService = new ExerciseService();
