import { ExerciseType } from './tasksService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const matchingExercises = [
  {
    id: '1',
    type: ExerciseType.WriteText,
    difficulty: 'easy' as const,
    content: 'Write the correct translation for: house, car, tree',
    solution: 'test',
    hint: 'Match "house" with "дом" to get started.',
  },
];

const fillBlankExercises = [
  {
    id: '2',
    type: ExerciseType.FillWord,
    difficulty: 'medium' as const,
    content: 'The cat is sitting on the _____.',
    solution: 'table',
    hint: 'Think of a flat surface with four legs.',
  },
];

const multipleChoiceExercises = [
  {
    id: '3',
    type: ExerciseType.AnswerQuestion,
    difficulty: 'hard' as const,
    content: 'What is the translation of "книга"?',
    solution: 'book',
    hint: 'It has pages and a cover.',
  },
];

export const mockTasksService = {
  async getInsertWordTask(): Promise<{ taskText: string; hint: string }> {
    await delay(200);
    const exercise =
      fillBlankExercises[Math.floor(Math.random() * fillBlankExercises.length)];
    return {
      taskText: exercise.content,
      hint: exercise.hint,
    };
  },

  async checkInsertWordTask(answer: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    await delay(200);
    const exercise =
      fillBlankExercises[Math.floor(Math.random() * fillBlankExercises.length)];
    return {
      correct: answer.toLowerCase() === exercise.solution.toLowerCase(),
      recommendations: '',
    };
  },

  async getQuestionAnswerTask(): Promise<{ taskText: string; hint: string }> {
    await delay(200);
    const exercise =
      multipleChoiceExercises[
        Math.floor(Math.random() * multipleChoiceExercises.length)
      ];
    return {
      taskText: exercise.content,
      hint: exercise.hint,
    };
  },

  async checkQuestionAnswerTask(answer: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    await delay(200);
    const exercise =
      multipleChoiceExercises[
        Math.floor(Math.random() * multipleChoiceExercises.length)
      ];
    return {
      correct: answer.toLowerCase() === exercise.solution.toLowerCase(),
      recommendations: '',
    };
  },

  async getWriteTextTask(): Promise<{ taskText: string }> {
    await delay(200);
    const exercise =
      matchingExercises[Math.floor(Math.random() * matchingExercises.length)];
    return {
      taskText: exercise.content,
    };
  },

  async checkWriteTextTask(text: string): Promise<{
    correct: boolean;
    recommendations: string;
  }> {
    await delay(200);
    const exercise =
      matchingExercises[Math.floor(Math.random() * matchingExercises.length)];
    const requiredParts = exercise.solution
      .split(',')
      .map((s) => s.trim().toLowerCase());
    return {
      correct: requiredParts.every((part) => text.toLowerCase().includes(part)),
      recommendations: '',
    };
  },
};
