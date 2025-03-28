import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  wordsServiceInstance,
  chatServiceInstance,
  exerciseServiceInstance,
  authService,
  topicsServiceInstance,
  statsServiceInstance,
  type User,
} from '@/services/index';

export function useWords() {
  return useQuery({
    queryKey: ['words'],
    queryFn: () => wordsServiceInstance.getWords(),
  });
}

export function useWord(word: string) {
  return useQuery({
    queryKey: ['words', word],
    queryFn: () => wordsServiceInstance.getWord(word),
    enabled: !!word,
  });
}

export function useSearchWords(query: string) {
  const { data: words = [] } = useWords();

  return useQuery({
    queryKey: ['words', 'search', query],
    queryFn: () => {
      const searchLower = query.toLowerCase();
      return words.filter(
        (word) =>
          word.word.toLowerCase().includes(searchLower) ||
          word.translation.toLowerCase().includes(searchLower)
      );
    },
    enabled: true,
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
    }) => wordsServiceInstance.addWord(word, translation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: string) => wordsServiceInstance.deleteWord(word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => statsServiceInstance.getUserStats(),
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => topicsServiceInstance.getTopics(),
  });
}

export function useSearchTopics(query: string) {
  const { data: topics = [] } = useTopics();

  return useQuery({
    queryKey: ['topics', 'search', query],
    queryFn: () => {
      const searchLower = query.toLowerCase();
      return topics.filter((topic) =>
        topic.name.toLowerCase().includes(searchLower)
      );
    },
    enabled: true,
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
    queryFn: () => chatServiceInstance.getChatHistory(),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => chatServiceInstance.sendMessage(text),
    onSuccess: (updatedHistory) => {
      queryClient.setQueryData(['chatHistory'], updatedHistory);
    },
  });
}

export function useClearChatHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatServiceInstance.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
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
    }) => exerciseServiceInstance.submitAnswer(exerciseId, answer),
  });
}

export function useExerciseProgress() {
  return useQuery({
    queryKey: ['exerciseProgress'],
    queryFn: () => exerciseServiceInstance.getUserProgress(),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      authService.updateUserProfile(updates),
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
      const currentUser = await authService.getCurrentUser();
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

export function useGetWord() {
  return useMutation({
    mutationFn: (word: string) => wordsServiceInstance.getWord(word),
  });
}

export function useStreak() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: () => statsServiceInstance.getStreak(),
  });
}

export function useUpdateStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => statsServiceInstance.updateStreak(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useNextExercise() {
  return useQuery({
    queryKey: ['nextExercise'],
    queryFn: () => exerciseServiceInstance.getNextExercise(),
  });
}
