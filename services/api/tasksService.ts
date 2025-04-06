import { ApiService } from './api';

export enum ExerciseType {
  WriteText = 'write-text',
  FillWord = 'fill-word',
  AnswerQuestion = 'answer-question',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  solution: string;
  hint: string;
}

class TasksService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getNextExercise(): Promise<Exercise> {
    return this.api.get<Exercise>('/exercises/next');
  }

  async getExercisesByType(
    type: ExerciseType,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<Exercise[]> {
    const params: Record<string, string> = {
      type,
    };

    if (difficulty) {
      params.difficulty = difficulty;
    }

    return this.api.get<Exercise[]>('/exercises', params);
  }

  async submitAnswer(exerciseId: string, answer: any): Promise<boolean> {
    const response = await this.api.post<{ correct: boolean }>(
      `/exercises/${exerciseId}/submit`,
      { answer }
    );
    return response.correct;
  }
}

export const tasksService = new TasksService();
