import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi, Word, UserStats } from '@/services/mockApi';
import { mockTopicsApi, Topic } from '@/services/mockTopicsApi';
import { mockChatService, ChatMessage } from '@/services/mockChatService';
import { mockExerciseService, Exercise } from '@/services/mockExerciseService';
import { mockAuthService } from '@/services/mockAuth';

// Hook for fetching words
export function useWords() {
  return useQuery({
    queryKey: ['words'],
    queryFn: () => mockApi.getWords(),
  });
}

// Hook for fetching a single word
export function useWord(id: string) {
  return useQuery({
    queryKey: ['word', id],
    queryFn: () => mockApi.getWord(id),
    enabled: !!id,
  });
}

// Hook for toggling word learned status
export function useToggleWordLearned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockApi.toggleWordLearned(id),
    onSuccess: (updatedWord) => {
      // Update the words list
      queryClient.setQueryData<Word[]>(['words'], (oldWords) =>
        oldWords?.map((word) =>
          word.id === updatedWord.id ? updatedWord : word
        )
      );

      // Update the single word data
      queryClient.setQueryData(['word', updatedWord.id], updatedWord);

      // Invalidate stats to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });
}

// Hook for fetching user stats
export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => mockApi.getUserStats(),
  });
}

// Hook for fetching topics
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => mockTopicsApi.getTopics(),
  });
}

// Hook for searching topics
export function useSearchTopics(query: string) {
  return useQuery({
    queryKey: ['topics', 'search', query],
    queryFn: () => mockTopicsApi.searchTopics(query),
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
    }) => mockTopicsApi.generateText(topicId, customTopic, complexity),
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

// Hook for fetching current user data (profile)
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => {
      const user = mockAuthService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    // Avoid refetching too often
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook for updating user profile
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      mockAuthService.updateUserProfile(updates),
    onSuccess: (updatedUser) => {
      // Update the user data in the cache
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });
}

// Hook for adding experience points
export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (points: number) => mockAuthService.addExperience(points),
    onSuccess: (updatedUser) => {
      // Update the user data in the cache
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });
}
