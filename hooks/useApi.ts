import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  dictionaryServiceInstance,
  chatServiceInstance,
  tasksServiceInstance,
  topicsServiceInstance,
  exploreServiceInstance,
  profileServiceInstance,
  type User,
} from '@/services/api/index';
import React from 'react';
import { PaginatedResult, Word } from '@/services/api/dictionaryService';

export function useWords(page: number = 1, pageSize: number = 10) {
  return usePagination(
    ['words'],
    dictionaryServiceInstance.getWordsWithPagination.bind(
      dictionaryServiceInstance
    ),
    { initialPage: page, initialPageSize: pageSize }
  );
}

export function useWord(word: string) {
  return useQuery({
    queryKey: ['words', word],
    queryFn: () => dictionaryServiceInstance.getWord(word),
    enabled: !!word,
  });
}

export function useSearchWords(query: string) {
  const { data } = useWords();
  const words = data?.items || [];

  return useQuery({
    queryKey: ['words', 'search', query],
    queryFn: () => {
      const searchLower = query.toLowerCase();
      return words.filter(
        (word: Word) =>
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
    }) => dictionaryServiceInstance.addWord(word, translation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: string) => dictionaryServiceInstance.deleteWord(word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => profileServiceInstance.getStats(),
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
    }) => exploreServiceInstance.generateText(topicId, customTopic, complexity),
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
    }) => tasksServiceInstance.submitAnswer(exerciseId, answer),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      profileServiceInstance.updateProfile(updates),
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
      const currentUser = await profileServiceInstance.getProfile();
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
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
    },
  });
}

export function useGetWord() {
  return useMutation({
    mutationFn: (word: string) => dictionaryServiceInstance.getWord(word),
  });
}

export function useStreak() {
  const { data: profileStats } = useProfileStats();

  return useQuery({
    queryKey: ['streak'],
    queryFn: () =>
      profileStats?.streak || {
        currentStreak: 0,
        maxStreak: 0,
      },
    enabled: !!profileStats,
  });
}

export function useNextExercise() {
  return useQuery({
    queryKey: ['nextExercise'],
    queryFn: () => tasksServiceInstance.getNextExercise(),
  });
}

export function useWordFrequency(page: number = 1, pageSize: number = 10) {
  return usePagination(
    ['wordFrequency'],
    dictionaryServiceInstance.getWordFrequency.bind(dictionaryServiceInstance),
    { initialPage: page, initialPageSize: pageSize }
  );
}

export function usePagination<T>(
  queryKey: unknown[],
  fetchFn: (page: number, pageSize: number) => Promise<PaginatedResult<T>>,
  options?: {
    initialPage?: number;
    initialPageSize?: number;
    enabled?: boolean;
  }
) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    enabled = true,
  } = options || {};

  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const queryResult = useQuery({
    queryKey: [...queryKey, page, pageSize],
    queryFn: () => fetchFn(page, pageSize),
    enabled: enabled,
  });

  const goToPage = React.useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = React.useCallback(() => {
    if (queryResult.data && page < queryResult.data.totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, queryResult.data]);

  const prevPage = React.useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const setItemsPerPage = React.useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  return {
    ...queryResult,
    pagination: {
      page,
      pageSize,
      goToPage,
      nextPage,
      prevPage,
      setItemsPerPage,
      hasNextPage: queryResult.data
        ? page < queryResult.data.totalPages
        : false,
      hasPrevPage: page > 1,
      totalPages: queryResult.data?.totalPages || 0,
      totalItems: queryResult.data?.total || 0,
    },
  };
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profileStats'],
    queryFn: () => profileServiceInstance.getProfileStats(),
  });
}
