import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockTopicsService } from '@/services/mockTopicsService';
import { mockChatService } from '@/services/mockChatService';
import { mockExerciseService } from '@/services/mockExerciseService';
import { mockAuthService } from '@/services/mockAuthService';
import { topicsServiceInstance, User } from '@/services/index';
import { mockWordsService } from '@/services/mockWordsService';
import { Word } from '@/services/wordsService';
import { mockTranslationService } from '@/services/mockTranslationService';
import { WordDetails } from '@/services/translationService';

export function useWords() {
  return useQuery({
    queryKey: ['words'],
    queryFn: () => mockWordsService.getWords(),
  });
}

export function useWord(id: string) {
  return useQuery({
    queryKey: ['words', id],
    queryFn: () => mockWordsService.getWord(id),
    enabled: !!id,
  });
}

export function useSearchWords(query: string) {
  return useQuery({
    queryKey: ['words', 'search', query],
    queryFn: () => mockWordsService.searchWords(query),
    enabled: query.length > 0,
  });
}

export function useToggleWordLearned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockWordsService.toggleWordLearned(id),
    onSuccess: (updatedWord: Word) => {
      queryClient.setQueryData<Word[]>(['words'], (oldWords) =>
        oldWords?.map((word) =>
          word.id === updatedWord.id ? updatedWord : word
        )
      );

      queryClient.setQueryData(['words', updatedWord.id], updatedWord);

      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      word,
      translation,
    }: {
      word: string;
      translation: string;
    }) => mockWordsService.addWord(word, translation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wordId: string) => mockWordsService.deleteWord(wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['wordsStats'],
    queryFn: () => mockWordsService.getUserStats(),
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => mockTopicsService.getTopics(),
  });
}

export function useSearchTopics(query: string) {
  return useQuery({
    queryKey: ['topics', 'search', query],
    queryFn: () => mockTopicsService.searchTopics(query),
    enabled: query.length > 0,
  });
}

export function useGenerateText() {
  return useMutation({
    mutationFn: ({
      topicId,
      customTopic,
      complexity = 'medium',
    }: {
      topicId: string | null;
      customTopic: string | null;
      complexity?: 'easy' | 'medium' | 'hard';
    }) => topicsServiceInstance.generateText(topicId, customTopic, complexity),
  });
}

export function useChatHistory() {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => mockChatService.getChatHistory(),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => mockChatService.sendMessage(text),
    onSuccess: (updatedHistory) => {
      queryClient.setQueryData(['chatHistory'], updatedHistory);
    },
  });
}

export function useClearChatHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mockChatService.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => mockExerciseService.getExercises(),
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      exerciseId,
      answer,
    }: {
      exerciseId: string;
      answer: string;
    }) => mockExerciseService.submitAnswer(exerciseId, answer),
  });
}

export function useExerciseProgress() {
  return useQuery({
    queryKey: ['exerciseProgress'],
    queryFn: () => mockExerciseService.getUserProgress(),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      mockAuthService.updateUserProfile(updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);

      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      const currentUser = await mockAuthService.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          experiencePoints: currentUser.profile.experiencePoints + points,
        },
      };

      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['exerciseProgress'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useWordDetails() {
  return useMutation({
    mutationFn: (word: string) => mockTranslationService.getWordDetails(word),
  });
}

export function useAddWordToVocabulary() {
  return useMutation({
    mutationFn: (word: string) =>
      mockTranslationService.addWordToVocabulary(word),
  });
}
