import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout';
import { AnimeDetailsPage } from '../features/anime/pages/AnimeDetailsPage';
import { BrowsePage } from '../features/browse/pages/BrowsePage';
import { HomePage } from '../features/home/pages/HomePage';
import { MyListPage } from '../features/my-list/pages/MyListPage';
import { NotFoundPage } from '../features/not-found/pages/NotFoundPage';

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
        element: <BrowsePage />,
      },
      {
        path: '/my-list',
        element: <MyListPage />,
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
