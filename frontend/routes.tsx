import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute, PublicOnlyRoute } from "./components/layout/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import NewProjectPage from "./pages/NewProjectPage";
import WizardPage from "./pages/WizardPage";
import PromptResultPage from "./pages/PromptResultPage";
import TemplatesPage from "./pages/TemplatesPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      // Public-only (redirects to /dashboard if logged in)
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "/", element: <LandingPage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
        ],
      },
      // Protected
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/projects/new", element: <NewProjectPage /> },
          { path: "/projects/:projectId/wizard", element: <WizardPage /> },
          { path: "/prompts/:id", element: <PromptResultPage /> },
          { path: "/templates", element: <TemplatesPage /> },
        ],
      },
      // Redirects + catch-all
      { path: "/app", element: <Navigate to="/dashboard" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
