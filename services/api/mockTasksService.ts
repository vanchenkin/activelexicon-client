import { ExerciseType, Exercise } from './tasksService';
import { mockAuthService } from './mockAuthService';

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

const allExercises = [
  ...matchingExercises,
  ...fillBlankExercises,
  ...multipleChoiceExercises,
];

export const mockTasksService = {
  async getNextExercise(): Promise<Exercise> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return allExercises[Math.floor(Math.random() * allExercises.length)];
  },

  async getExercisesByType(
    type: ExerciseType,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<Exercise[]> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    let filtered = allExercises.filter((ex) => ex.type === type);

    if (difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === difficulty);
    }

    return filtered;
  },

  async submitAnswer(exerciseId: string, answer: any): Promise<boolean> {
    await delay(600);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const exercise = allExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    if (exercise.type === ExerciseType.WriteText) {
      const requiredParts = exercise.solution
        .split(',')
        .map((s) => s.trim().toLowerCase());
      return (
        typeof answer === 'string' &&
        requiredParts.every((part) => answer.toLowerCase().includes(part))
      );
    } else if (
      exercise.type === ExerciseType.FillWord ||
      exercise.type === ExerciseType.AnswerQuestion
    ) {
      return (
        typeof answer === 'string' &&
        answer.toLowerCase() === exercise.solution.toLowerCase()
      );
    }

    return false;
  },
};
