import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/Home.page';
import { useAppSelector } from '@/redux/hooks';
import { LoginPage } from '@/pages/Login.page';
import { ProjectPage } from '@/pages/Project.page';
import { TemplatePage } from '@/pages/Template.page';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: 'project/:project',
    element: (
      <ProtectedRoute>
        <ProjectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/:project/template/new',
    element: (
      <ProtectedRoute>
        <TemplatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/:project/template/:template',
    element: (
      <ProtectedRoute>
        <TemplatePage />
      </ProtectedRoute>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
