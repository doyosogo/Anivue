import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import {
  AniListNetworkError,
  isAniListClientError,
  isAniListRateLimitError,
} from '../../services/anilist/errors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isAniListRateLimitError(error) || isAniListClientError(error)) {
          return false;
        }

        return error instanceof AniListNetworkError
          ? failureCount < 2
          : failureCount < 1;
      },
      staleTime: 1000 * 60 * 10,
    },
  },
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
