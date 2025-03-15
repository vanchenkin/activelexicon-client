import { mockAuthService } from './mockAuthService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type ExerciseType = 'fill-blank' | 'multiple-choice' | 'translate';

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
    type: 'fill-blank',
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not _____ five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    correctAnswer: 'only',
    hint: 'This word emphasizes exclusivity',
  },
  {
    id: 'ex2',
    type: 'multiple-choice',
    text: 'Choose the correct word to complete the sentence: The student _____ studying for their exam.',
    options: ['is', 'are', 'were', 'was'],
    correctAnswer: 'is',
    hint: 'The subject is singular',
  },
  {
    id: 'ex3',
    type: 'translate',
    text: 'Translate this sentence to English: Он читает книгу.',
    correctAnswer: 'He is reading a book',
    hint: 'Present continuous tense',
  },
  {
    id: 'ex4',
    type: 'fill-blank',
    text: 'She _____ to the store yesterday to buy groceries.',
    correctAnswer: 'went',
    hint: 'Past tense of "go"',
  },
  {
    id: 'ex5',
    type: 'fill-blank',
    text: 'The weather _____ very nice today, so we decided to have a picnic.',
    correctAnswer: 'was',
    hint: 'Past tense of "is"',
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
  async getExercises(): Promise<Exercise[]> {
    await delay(800);
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return [...mockExercises];
  },

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
