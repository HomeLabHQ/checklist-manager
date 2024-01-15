import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, Layout, theme } from "antd";
import { useAppSelector } from "./redux/hooks";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProjectPage from "./pages/ProjectPage";
import CheckListTemplatePage from "./pages/ChecklistTemplatePage";
import CheckListRunPage from "./pages/CheckListRunPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { mode } = useAppSelector((state) => state.auth);
  const { darkAlgorithm, defaultAlgorithm } = theme;
  return (
    <ConfigProvider theme={{ algorithm: mode == "dark" ? darkAlgorithm : defaultAlgorithm }}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/:project"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:project/template/new/"
              element={
                <ProtectedRoute>
                  <CheckListTemplatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:project/template/:template"
              element={
                <ProtectedRoute>
                  <CheckListTemplatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:project/template-run/:template_run"
              element={
                <ProtectedRoute>
                  <CheckListRunPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Layout>
    </ConfigProvider>
  );
}
