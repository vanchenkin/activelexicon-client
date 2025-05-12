import { ApiService } from './api';

export enum ExerciseType {
  WriteText = 'write-text',
  FillWord = 'insert-word',
  AnswerQuestion = 'question-answer',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  hint: string;
}

class TasksService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getInsertWordTask(): Promise<{ taskText: string; hint: string }> {
    const response = await this.api.post<{ task_text: string; hint: string }>(
      '/tasks/insert-word',
      {}
    );

    return {
      taskText: response.task_text,
      hint: response.hint,
    };
  }

  async checkInsertWordTask(answer: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    const response = await this.api.post<{
      correct: boolean;
      recommendations: string;
    }>('/tasks/insert-word/check', { answer });

    return response;
  }

  async getQuestionAnswerTask(): Promise<{ taskText: string; hint: string }> {
    const response = await this.api.post<{ task_text: string; hint: string }>(
      '/tasks/question-answer',
      {}
    );

    return {
      taskText: response.task_text,
      hint: response.hint,
    };
  }

  async checkQuestionAnswerTask(answer: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    const response = await this.api.post<{
      correct: boolean;
      recommendations: string;
    }>('/tasks/question-answer/check', { answer });

    return response;
  }

  async getWriteTextTask(): Promise<{ taskText: string }> {
    const response = await this.api.post<{ task_text: string }>(
      '/tasks/write-text',
      {}
    );

    return {
      taskText: response.task_text,
    };
  }

  async checkWriteTextTask(text: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    const response = await this.api.post<{
      correct: boolean;
      recommendations: string;
    }>('/tasks/write-text/check', { text });

    return response;
  }
}

export const tasksService = new TasksService();
