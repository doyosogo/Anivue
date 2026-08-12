import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { AnimeDetailsPage } from '../features/anime/pages/AnimeDetailsPage';
import { HomePage } from '../features/home/pages/HomePage';
import { MyListPage } from '../features/my-list/pages/MyListPage';
import { NotFoundPage } from '../features/not-found/pages/NotFoundPage';
import { ViewingHistoryPage } from '../features/recently-viewed/pages/ViewingHistoryPage';
import { SearchPage } from '../features/search/pages/SearchPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/browse',
        element: <SearchPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/my-list',
        element: <MyListPage />,
      },
      {
        path: '/history',
        element: <ViewingHistoryPage />,
      },
      {
        path: '/anime/:id',
        element: <AnimeDetailsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
