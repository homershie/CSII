import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './HomePage';
import { ExperimentRoute } from './ExperimentRoute';
import { NotFound } from './NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ':category/:slug', element: <ExperimentRoute /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
