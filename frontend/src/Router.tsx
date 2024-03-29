import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/Home.page';
import { useAppSelector } from '@/redux/hooks';
import { LoginPage } from '@/pages/Login.page';
import { ProjectPage } from '@/pages/Project.page';
import { ChecklistPage } from '@/pages/Checklist.page';
import RunPage from './pages/Run.page';
import SignupConfirmPage from '@/pages/SignupConfirm.page';
import SocialLoginPage from '@/pages/SocialLogin.page';
import ProjectDetailPage from './pages/ProjectDetail.page';

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
    path: '/signup/confirm',
    element: <SignupConfirmPage />,
  },
  {
    path: '/social/:provider',
    element: <SocialLoginPage />,
  },
  {
    path: 'project/:project/',
    element: (
      <ProtectedRoute>
        <ProjectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/new/',
    element: (
      <ProtectedRoute>
        <ProjectDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/edit/:project',
    element: (
      <ProtectedRoute>
        <ProjectDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/:project/checklist',
    element: (
      <ProtectedRoute>
        <ChecklistPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/:project/checklist/:checklist',
    element: (
      <ProtectedRoute>
        <ChecklistPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'project/:project/checklist/:checklist/run/:run',
    element: (
      <ProtectedRoute>
        <RunPage />
      </ProtectedRoute>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
