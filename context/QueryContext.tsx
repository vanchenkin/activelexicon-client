import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  queryClient,
  initializeQueryClientPersistence,
} from '@/utils/queryClientPersistence';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeQueryClientPersistence();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
