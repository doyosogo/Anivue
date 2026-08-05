import { useQuery } from '@tanstack/react-query';

import { fetchAnimeDetails } from '../../../services/anilist/api';
import { anilistQueryKeys } from '../../../services/anilist/queryKeys';

export function useAnimeDetails(id: number | null) {
  return useQuery({
    enabled: id !== null,
    queryKey: id === null ? anilistQueryKeys.details(0) : anilistQueryKeys.details(id),
    queryFn: ({ signal }) => {
      if (id === null) {
        throw new Error('Anime id is required.');
      }

      return fetchAnimeDetails({ id }, { signal });
    },
  });
}
