import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useAuthHydrated } from "../../features/auth/hooks";
import { PageSpinner } from "../ui/Spinner";

export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthHydrated();
  const location = useLocation();

  // Wait until localStorage has been read to avoid an auth-flash redirect.
  if (!hydrated) return <PageSpinner />;

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/** Inverse of ProtectedRoute — redirects to dashboard if already signed in. */
export function PublicOnlyRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthHydrated();
  if (!hydrated) return <PageSpinner />;
  if (accessToken) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
