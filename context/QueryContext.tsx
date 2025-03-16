import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/context/queryClientPersistence';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
