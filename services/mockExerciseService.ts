import { ExerciseType } from './exerciseService';
import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Exercise {
  id: string;
  type: ExerciseType;
  text: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    type: 'fill-word',
    text: 'The student _____ studying for their exam.',
    options: ['is', 'are', 'were', 'was'],
    correctAnswer: 'is',
    hint: 'The subject is singular',
  },
  {
    id: 'ex3',
    type: 'make-text',
    text: 'wake',
    correctAnswer: 'I wake up early',
    hint: 'I ___ up early',
  },
];

interface UserProgress {
  completedExercises: string[];
  currentExerciseIndex: number;
  streak: number;
  lastCompletedDate: Date | null;
}

let userProgress: UserProgress = {
  completedExercises: [],
  currentExerciseIndex: 0,
  streak: 0,
  lastCompletedDate: null,
};

export const mockExerciseService = {
  async getNextExercise(): Promise<Exercise | null> {
    await delay(500);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    if (userProgress.currentExerciseIndex < mockExercises.length) {
      return mockExercises[userProgress.currentExerciseIndex];
    }

    return null;
  },

  async submitAnswer(exerciseId: string, answer: string): Promise<boolean> {
    await delay(700);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const exercise = mockExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    const isCorrect =
      exercise.correctAnswer.toLowerCase() === answer.toLowerCase();

    if (isCorrect) {
      if (!userProgress.completedExercises.includes(exerciseId)) {
        userProgress.completedExercises.push(exerciseId);
      }

      userProgress.currentExerciseIndex++;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = userProgress.lastCompletedDate;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate) {
        const lastCompletedDay = new Date(lastDate);
        lastCompletedDay.setHours(0, 0, 0, 0);

        if (lastCompletedDay.getTime() === yesterday.getTime()) {
          userProgress.streak++;
        } else if (lastCompletedDay.getTime() < yesterday.getTime()) {
          userProgress.streak = 1;
        }
      } else {
        userProgress.streak = 1;
      }

      userProgress.lastCompletedDate = new Date();
    }

    return isCorrect;
  },

  async getUserProgress(): Promise<UserProgress> {
    await delay(400);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return { ...userProgress };
  },

  async resetProgress(): Promise<void> {
    await delay(300);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    userProgress = {
      completedExercises: [],
      currentExerciseIndex: 0,
      streak: 0,
      lastCompletedDate: null,
    };
  },
};
