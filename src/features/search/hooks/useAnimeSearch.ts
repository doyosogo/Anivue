import { useQuery } from '@tanstack/react-query';

import { fetchAnimeSearch } from '../../../services/anilist/api';
import { anilistQueryKeys } from '../../../services/anilist/queryKeys';
import {
  canRunSearch,
  toAnimeSearchVariables,
  type SearchUrlState,
} from '../utils/searchUrlState';

export function useAnimeSearch(searchState: SearchUrlState) {
  const variables = toAnimeSearchVariables(searchState);
  const enabled = canRunSearch(searchState);

  return useQuery({
    enabled,
    queryKey: anilistQueryKeys.search(variables),
    queryFn: ({ signal }) => fetchAnimeSearch(variables, { signal }),
    placeholderData: (previousData) => previousData,
  });
}
