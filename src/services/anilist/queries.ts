export const ANILIST_MEDIA_FRAGMENT = `
  fragment AnimeCatalogueMedia on Media {
    id
    idMal
    title {
      english
      romaji
      native
    }
    description
    format
    status
    season
    seasonYear
    episodes
    duration
    genres
    averageScore
    popularity
    trending
    favourites
    isAdult
    siteUrl
    bannerImage
    coverImage {
      extraLarge
      large
      medium
      color
    }
    trailer {
      id
      site
      thumbnail
    }
    studios {
      nodes {
        id
        name
        isAnimationStudio
      }
    }
    nextAiringEpisode {
      episode
      airingAt
      timeUntilAiring
    }
  }
`;

const PAGE_INFO_FIELDS = `
  pageInfo {
    total
    currentPage
    lastPage
    hasNextPage
    perPage
  }
`;

export const TRENDING_ANIME_QUERY = `
  ${ANILIST_MEDIA_FRAGMENT}
  query TrendingAnime($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(type: ANIME, isAdult: false, sort: TRENDING_DESC) {
        ...AnimeCatalogueMedia
      }
    }
  }
`;

export const POPULAR_ANIME_QUERY = `
  ${ANILIST_MEDIA_FRAGMENT}
  query PopularAnime($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
        ...AnimeCatalogueMedia
      }
    }
  }
`;

export const CURRENT_SEASON_ANIME_QUERY = `
  ${ANILIST_MEDIA_FRAGMENT}
  query CurrentSeasonAnime(
    $page: Int!
    $perPage: Int!
    $season: MediaSeason!
    $seasonYear: Int!
  ) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(
        type: ANIME
        isAdult: false
        season: $season
        seasonYear: $seasonYear
        sort: POPULARITY_DESC
      ) {
        ...AnimeCatalogueMedia
      }
    }
  }
`;
