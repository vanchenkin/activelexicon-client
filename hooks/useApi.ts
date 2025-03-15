import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockTopicsService } from '@/services/mockTopicsService';
import { mockChatService } from '@/services/mockChatService';
import { mockExerciseService } from '@/services/mockExerciseService';
import { mockAuthService } from '@/services/mockAuthService';
import { topicsServiceInstance, User } from '@/services/index';
import { mockWordsService } from '@/services/mockWordsService';
import { Word } from '@/services/wordsService';

// Hook for fetching words
export function useWords() {
  return useQuery({
    queryKey: ['words'],
    queryFn: () => mockWordsService.getWords(),
  });
}

// Hook for fetching a single word
export function useWord(id: string) {
  return useQuery({
    queryKey: ['words', id],
    queryFn: () => mockWordsService.getWord(id),
    enabled: !!id,
  });
}

// Hook for searching words
export function useSearchWords(query: string) {
  return useQuery({
    queryKey: ['words', 'search', query],
    queryFn: () => mockWordsService.searchWords(query),
    enabled: query.length > 0,
  });
}

// Hook for toggling word learned status
export function useToggleWordLearned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockWordsService.toggleWordLearned(id),
    onSuccess: (updatedWord: Word) => {
      // Update the words list
      queryClient.setQueryData<Word[]>(['words'], (oldWords) =>
        oldWords?.map((word) =>
          word.id === updatedWord.id ? updatedWord : word
        )
      );

      // Update the single word data
      queryClient.setQueryData(['words', updatedWord.id], updatedWord);

      // Invalidate stats to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

// Hook for adding a new word
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

// Hook for deleting a word
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

// Hook for fetching words stats
export function useUserStats() {
  return useQuery({
    queryKey: ['wordsStats'],
    queryFn: () => mockWordsService.getUserStats(),
  });
}

// Hook for fetching topics
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => mockTopicsService.getTopics(),
  });
}

// Hook for searching topics
export function useSearchTopics(query: string) {
  return useQuery({
    queryKey: ['topics', 'search', query],
    queryFn: () => mockTopicsService.searchTopics(query),
    enabled: query.length > 0,
  });
}

// Hook for generating text
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

// Hook for fetching chat history
export function useChatHistory() {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => mockChatService.getChatHistory(),
  });
}

// Hook for sending a message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => mockChatService.sendMessage(text),
    onSuccess: (updatedHistory) => {
      // Update chat history in cache
      queryClient.setQueryData(['chatHistory'], updatedHistory);
    },
  });
}

// Hook for clearing chat history
export function useClearChatHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mockChatService.clearHistory(),
    onSuccess: () => {
      // Invalidate and refetch chat history
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}

// Hook for fetching exercises
export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => mockExerciseService.getExercises(),
  });
}

// Hook for submitting an answer
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

// Hook for getting user progress
export function useExerciseProgress() {
  return useQuery({
    queryKey: ['exerciseProgress'],
    queryFn: () => mockExerciseService.getUserProgress(),
  });
}

// Hook for updating user profile
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      mockAuthService.updateUserProfile(updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      // Also update user stats which might depend on profile data
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

// Hook for adding experience points
export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      // Since mockAuthService doesn't have addExperience, we'll create a mock implementation
      const currentUser = await mockAuthService.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');

      // In a real implementation, this would be a service method
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
