import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'ACTIVE_LEXICON_QUERY_CACHE',
  throttleTime: 1000,
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
});

export const initializeQueryClientPersistence = () => {
  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    buster: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        if (query.queryKey[0] === 'user') {
          return true;
        }

        return (
          query.queryKey[0] === 'currentUser' ||
          query.queryKey[0] === 'userProgress' ||
          query.queryKey[0] === 'exercises' ||
          query.queryKey[0] === 'userWords' ||
          query.queryKey[0] === 'userStats' ||
          query.queryKey[0] === 'exerciseProgress'
        );
      },
    },
  });
};
