import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  dictionaryServiceInstance,
  chatServiceInstance,
  tasksServiceInstance,
  topicsServiceInstance,
  exploreServiceInstance,
  profileServiceInstance,
  type User,
  Exercise,
  ExerciseType,
  ProfileUpdateResponse,
} from '../services/api';
import * as React from 'react';
import {
  DictionaryWord,
  PaginatedResult,
  WordFrequencyItem,
} from '../services/api/dictionaryService';
import { ChatMessage } from '../services/api/chatService';
import { Complexity } from '@/types/common';

export function useWords(page: number = 1, pageSize: number = 10) {
  return usePagination(
    ['words'],
    dictionaryServiceInstance.getWordsWithPagination.bind(
      dictionaryServiceInstance
    ),
    { initialPage: page, initialPageSize: pageSize }
  );
}

export function useSearchWords(query: string) {
  const { data } = useWords();
  const words = data?.items || [];

  return useQuery({
    queryKey: ['words', 'search', query],
    queryFn: () => {
      const searchLower = query.toLowerCase();
      return words.filter(
        (word) =>
          word.word?.toLowerCase().includes(searchLower) ||
          word.translations?.some((translation) =>
            translation.translation.toLowerCase().includes(searchLower)
          )
      );
    },
    enabled: true,
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation<DictionaryWord, Error, { word: string }>({
    mutationFn: ({ word }: { word: string }) =>
      dictionaryServiceInstance.addWord(word),
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
    queryFn: () => profileServiceInstance.getProfileStats(),
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
      topic,
      complexity,
    }: {
      topic: string | null;
      complexity: Complexity;
    }) => exploreServiceInstance.generateText(topic, complexity),
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
    onSuccess: (newMessages) => {
      queryClient.setQueryData(['chatHistory'], (old: ChatMessage[] = []) => {
        return [...old, ...newMessages];
      });
    },
  });
}

export function useClearChatHistory() {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage[], Error>({
    mutationFn: () => chatServiceInstance.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}

export function useCheckMessageCorrectness() {
  return useMutation<
    { isCorrect: boolean; suggestions?: string[] },
    Error,
    string
  >({
    mutationFn: (text: string) =>
      chatServiceInstance.checkMessageCorrectness(text),
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async ({
      exerciseId,
      answer,
    }: {
      exerciseId: string;
      answer: string;
    }) => {
      if (exerciseId.startsWith('insert-word')) {
        return tasksServiceInstance.checkInsertWordTask(answer);
      } else if (exerciseId.startsWith('question-answer')) {
        return tasksServiceInstance.checkQuestionAnswerTask(answer);
      } else {
        return tasksServiceInstance.checkWriteTextTask(answer);
      }
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User['profile']>) =>
      profileServiceInstance.updateProfile(updates),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profileStats'] });
      queryClient.invalidateQueries({ queryKey: ['wordsStats'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useChangePassword() {
  return useMutation<
    ProfileUpdateResponse,
    Error,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: ({ currentPassword, newPassword }) =>
      profileServiceInstance.changePassword(currentPassword, newPassword),
  });
}

export function useGetWord(word: string) {
  return useQuery({
    queryKey: ['word', word],
    queryFn: () => dictionaryServiceInstance.getWord(word),
    enabled: !!word,
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
    queryFn: async () => {
      const types = ['insert-word', 'question-answer', 'write-text'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      let exercise: Exercise;

      try {
        if (randomType === 'insert-word') {
          const task = await tasksServiceInstance.getInsertWordTask();
          exercise = {
            id: `insert-word-${Date.now()}`,
            type: ExerciseType.FillWord,
            difficulty: 'medium',
            content: task.taskText,
            solution: '',
            hint: task.hint,
          };
        } else if (randomType === 'question-answer') {
          const task = await tasksServiceInstance.getQuestionAnswerTask();
          exercise = {
            id: `question-answer-${Date.now()}`,
            type: ExerciseType.AnswerQuestion,
            difficulty: 'medium',
            content: task.taskText,
            solution: '',
            hint: task.hint,
          };
        } else {
          const task = await tasksServiceInstance.getWriteTextTask();
          exercise = {
            id: `write-text-${Date.now()}`,
            type: ExerciseType.WriteText,
            difficulty: 'easy',
            content: task.taskText,
            solution: '',
            hint: '',
          };
        }

        return exercise;
      } catch (error) {
        console.error('Error generating exercise:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
}

export function useWordFrequency(page: number = 1, pageSize: number = 10) {
  return usePagination<WordFrequencyItem>(
    ['wordFrequency'],
    async (pg: number, pSize: number) => {
      const result = await dictionaryServiceInstance.getWordFrequency(
        pg,
        pSize
      );
      if (Array.isArray(result)) {
        return {
          items: result,
          total: result.length,
          page: pg,
          pageSize: pSize,
          totalPages: Math.ceil(result.length / pSize),
        };
      }
      return result;
    },
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

export function useStartNewChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topic: string) => chatServiceInstance.startNewChat(topic),
    onSuccess: (newChatHistory) => {
      queryClient.setQueryData(['chatHistory'], newChatHistory);
    },
  });
}
