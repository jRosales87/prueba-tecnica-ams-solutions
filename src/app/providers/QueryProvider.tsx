import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { ReactNode } from 'react';

const ONE_HOUR = 1000 * 60 * 60;


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_HOUR,
      gcTime: ONE_HOUR,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});


const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'ecommerce-query-cache',
  throttleTime: 1000,
});


interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_HOUR,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
