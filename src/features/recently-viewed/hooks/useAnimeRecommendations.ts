import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchAnimeRecommendations } from '../../../services/anilist/api';
import { anilistQueryKeys } from '../../../services/anilist/queryKeys';
import type { AniListMedia } from '../../../services/anilist/types';

const DEFAULT_RECOMMENDATION_COUNT = 12;

export function getValidRecommendationMedia(
  seedAnimeId: number,
  media: AniListMedia[],
): AniListMedia[] {
  const seenIds = new Set<number>([seedAnimeId]);
  const recommendations: AniListMedia[] = [];

  for (const item of media) {
    if (item.isAdult || seenIds.has(item.id)) {
      continue;
    }

    seenIds.add(item.id);
    recommendations.push(item);
  }

  return recommendations;
}

export function useAnimeRecommendations(
  animeId: number | null,
  {
    enabled = true,
    perPage = DEFAULT_RECOMMENDATION_COUNT,
  }: {
    enabled?: boolean;
    perPage?: number;
  } = {},
) {
  const query = useQuery({
    enabled: enabled && animeId !== null,
    queryKey:
      animeId === null
        ? anilistQueryKeys.recommendations(0, perPage)
        : anilistQueryKeys.recommendations(animeId, perPage),
    queryFn: ({ signal }) => {
      if (animeId === null) {
        throw new Error('Anime recommendations require an anime id.');
      }

      return fetchAnimeRecommendations({ id: animeId, perPage }, { signal });
    },
  });

  const recommendations = useMemo(() => {
    if (animeId === null || query.data?.Media === null || query.data === undefined) {
      return [];
    }

    return getValidRecommendationMedia(
      animeId,
      query.data.Media.recommendations.nodes
        .map((recommendation) => recommendation.mediaRecommendation)
        .filter((item): item is AniListMedia => item !== null),
    );
  }, [animeId, query.data]);

  return {
    ...query,
    recommendations,
  };
}
